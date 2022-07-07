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

describe('PATCH /user/:id', () => {
	it('Should edit an user email', async () => {
		const user = await request(app).post(BASE_URI).send(userData);
		const userId = user.body._id;

		const newEmail = 'updated@email.com';
		const response = await request(app).patch(`${BASE_URI}/${userId}`).send({ email: newEmail });

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body._id).toBe(userId);

		expect(response.body.email).toBe(newEmail);

		expect(response.body.username).toBe(userData.username);
		expect(response.body.password).not.toBe(userData.password);
	});

	it('Should edit an user username', async () => {
		const user = await request(app).post(BASE_URI).send(userData);
		const userId = user.body._id;

		const newUsername = 'updatedName';
		const response = await request(app)
			.patch(`${BASE_URI}/${userId}`)
			.send({ username: newUsername });

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body._id).toBe(userId);

		expect(response.body.username).toBe(newUsername);

		expect(response.body.email).toBe(userData.email);
		expect(response.body.password).not.toBe(userData.password);
	});

	it('Should edit an user password', async () => {
		const user = await request(app).post(BASE_URI).send(userData);
		const userId = user.body._id;

		const newPassword = 'updatedName';
		const response = await request(app)
			.patch(`${BASE_URI}/${userId}`)
			.send({ password: newPassword });

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body._id).toBe(userId);

		expect(await compare(newPassword, response.body.password)).toBeTruthy();

		expect(response.body.username).toBe(userData.username);
		expect(response.body.email).toBe(userData.email);
	});

	it('Should throw when userId does not exist in the database', async () => {
		const response = await request(app)
			.patch(`${BASE_URI}/62c6e6e2cd43d155e6b949fc`)
			.send({ email: 'newemail@email.com' });

		expect(response.status).toBe(httpStatus.PRECONDITION_FAILED);
	});

	it('Should throw when userId is not an valid ObjectId', async () => {
		const response = await request(app)
			.patch(`${BASE_URI}/abc123`)
			.send({ email: 'newemail@email.com' });

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
	});

	it('Should throw when given email already exists in the database', async () => {
		const user = await request(app).post(BASE_URI).send(userData);
		const userId = user.body._id;

		const response = await request(app)
			.patch(`${BASE_URI}/${userId}`)
			.send({ email: userData.email });

		expect(response.status).toBe(httpStatus.CONFLICT);
	});

	it('Should throw when given username already exists in the database', async () => {
		const user = await request(app).post(BASE_URI).send(userData);
		const userId = user.body._id;

		const response = await request(app)
			.patch(`${BASE_URI}/${userId}`)
			.send({ username: userData.username });

		expect(response.status).toBe(httpStatus.CONFLICT);
	});
});
