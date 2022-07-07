import { compare } from 'bcryptjs';
import httpStatus from 'http-status';
import { connection, disconnect } from 'mongoose';
import request from 'supertest';

import app from '@/app';
import config from '@/config';
import { connectToDatabase } from '@/db';
import { logger } from '@/logger';

import { userData } from './mocks';

beforeAll(async () => {
	logger.debug(config.MONGO_TEST_URI);
	await connectToDatabase(config.MONGO_TEST_URI);
});

beforeEach(async () => {
	await connection.db.dropDatabase();
});

afterAll(async () => {
	await disconnect();
});

const BASE_URI = '/api/v1/user';

describe('createUser', () => {
	it('Should create a new user', async () => {
		const response = await request(app).post(BASE_URI).send(userData);

		expect(response.status).toBe(httpStatus.CREATED);
		expect(response.body.email).toBe(userData.email);
		expect(response.body.username).toBe(userData.username);
		expect(await compare(userData.password, response.body.password)).toBeTruthy();
		expect(response.body._id).toBeDefined();
	});

	it('Should return a 400 error if the email is already in use', async () => {
		await request(app).post(BASE_URI).send(userData);

		const response = await request(app).post(BASE_URI).send(userData);

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
		expect(response.body.message).toBe(
			`User with email '${userData.email}' already exists in the database`
		);
	});

	it('Should return a 400 error if the username is already in use', async () => {
		await request(app)
			.post(BASE_URI)
			.send({ ...userData, email: 'test2@email.com' });

		const response = await request(app).post(BASE_URI).send(userData);

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
		expect(response.body.message).toBe(
			`User with username '${userData.username}' already exists in the database`
		);
	});

	it('Should throw 422 error if the input is invalid', async () => {
		enum Requests {
			empty,
			invalidEmail,
			invalidUsername,
			invalidPassword,
		}

		const requests = {
			empty: {},
			invalidEmail: { ...userData, email: 'invalidEmail' },
			invalidUsername: { ...userData, username: '@bad u$ername%' },
			invalidPassword: { ...userData, password: 'small' },
		};

		const responses = await Promise.all(
			Object.values(requests).map(async data => await request(app).post(BASE_URI).send(data))
		);

		expect(
			responses.every(response => response.status === httpStatus.UNPROCESSABLE_ENTITY)
		).toBeTruthy();

		expect(responses[Requests.empty]?.body.message).toContain('required');
		expect(responses[Requests.empty]?.body.message).toContain('email');
		expect(responses[Requests.empty]?.body.message).toContain('username');
		expect(responses[Requests.empty]?.body.message).toContain('password');

		expect(responses[Requests.invalidEmail]?.body.message).toContain('email');
		expect(responses[Requests.invalidPassword]?.body.message).toContain('password');
		expect(responses[Requests.invalidUsername]?.body.message).toContain('username');
	});
});
