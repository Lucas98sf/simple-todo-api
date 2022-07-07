import { compare } from 'bcryptjs';
import httpStatus from 'http-status';
import { connection, disconnect } from 'mongoose';
import request from 'supertest';

import app from '@/app';
import config from '@/config';
import { connectToDatabase } from '@/db';

import { userData } from './mocks';

beforeAll(async () => {
	await connectToDatabase(config.MONGO_TEST_URI);
});

beforeEach(async () => {
	await connection.db.dropDatabase();
});

afterAll(async () => {
	await disconnect();
});

const BASE_URI = '/api/v1/user';

describe('POST /user', () => {
	it('Should create a new user', async () => {
		const response = await request(app).post(BASE_URI).send(userData);

		expect(response.status).toBe(httpStatus.CREATED);

		expect(response.body.email).toBe(userData.email);
		expect(response.body.username).toBe(userData.username);
		expect(await compare(userData.password, response.body.password)).toBeTruthy();
		expect(response.body._id).toBeDefined;
	});

	it('Should throw when the email is already in use', async () => {
		await request(app).post(BASE_URI).send(userData);

		const response = await request(app).post(BASE_URI).send(userData);

		expect(response.status).toBe(httpStatus.CONFLICT);
		expect(response.body.message).toBe(
			`User with email '${userData.email}' already exists in the database`
		);
	});

	it('Should throw when the username is already in use', async () => {
		await request(app)
			.post(BASE_URI)
			.send({ ...userData, email: 'test2@email.com' });

		const response = await request(app).post(BASE_URI).send(userData);

		expect(response.status).toBe(httpStatus.CONFLICT);
		expect(response.body.message).toBe(
			`User with username '${userData.username}' already exists in the database`
		);
	});

	it('Should throw when the input is invalid', async () => {
		enum Requests {
			empty,
			invalidEmail,
			emptyEmail,
			invalidUsername,
			emptyUsername,
			invalidPassword,
			emptyPassword,
		}

		const requests = {
			empty: {},
			invalidEmail: { ...userData, email: 'invalidEmail' },
			emptyEmail: { ...userData, email: undefined },
			invalidUsername: { ...userData, username: '@bad u$ername%' },
			emptyUsername: { ...userData, username: undefined },
			invalidPassword: { ...userData, password: 'small' },
			emptyPassword: { ...userData, password: undefined },
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
		expect(responses[Requests.emptyEmail]?.body.message).toContain('email');
		expect(responses[Requests.emptyEmail]?.body.message).toContain('required');

		expect(responses[Requests.invalidPassword]?.body.message).toContain('password');
		expect(responses[Requests.emptyPassword]?.body.message).toContain('password');
		expect(responses[Requests.emptyPassword]?.body.message).toContain('required');

		expect(responses[Requests.invalidUsername]?.body.message).toContain('username');
		expect(responses[Requests.emptyUsername]?.body.message).toContain('username');
		expect(responses[Requests.emptyUsername]?.body.message).toContain('required');
	});
});
