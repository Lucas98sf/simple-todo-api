import httpStatus from 'http-status';
import { connection, disconnect } from 'mongoose';
import request from 'supertest';

import app from '@/app';
import config from '@/config';
import { connectToDatabase } from '@/db';

import { userData, userData2 } from './mocks';

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

describe('GET /user and GET /user/:id', () => {
	it('Should return an empty array when there is no users in the database', async () => {
		const response = await request(app).get(BASE_URI);

		expect(response.status).toBe(httpStatus.OK);
		expect(response.body).toEqual([]);
	});

	it('Should list all users', async () => {
		await request(app).post(BASE_URI).send(userData);
		await request(app).post(BASE_URI).send(userData2);

		const response = await request(app).get(BASE_URI);

		expect(response.status).toBe(httpStatus.OK);
		/* eslint-disable no-magic-numbers */
		expect(response.body).toHaveLength(2);
		const [responseBody1, responseBody2] = response.body;

		expect(responseBody1.email).toBe(userData.email);
		expect(responseBody1.username).toBe(userData.username);
		expect(responseBody1.password).toBeUndefined();
		expect(responseBody1._id).toBeDefined;

		expect(responseBody2.email).toBe(userData2.email);
		expect(responseBody2.username).toBe(userData2.username);
		expect(responseBody2.password).toBeUndefined();
		expect(responseBody2._id).toBeDefined;
		/* eslint-enable no-magic-numbers */
	});

	it('Should filter a user by id', async () => {
		const user = await request(app).post(BASE_URI).send(userData);

		const response = await request(app).get(`${BASE_URI}?id=${user.body._id}`);

		expect(response.status).toBe(httpStatus.OK);
		// eslint-disable-next-line no-magic-numbers
		expect(response.body).toHaveLength(1);
		const [responseBody] = response.body;

		expect(responseBody.email).toBe(userData.email);
		expect(responseBody.username).toBe(userData.username);
		expect(responseBody.password).toBeUndefined();
		expect(responseBody._id).toBeDefined;
	});

	it('Should filter a user by email', async () => {
		const user = await request(app).post(BASE_URI).send(userData);

		const response = await request(app).get(`${BASE_URI}?email=${user.body.email}`);

		expect(response.status).toBe(httpStatus.OK);
		// eslint-disable-next-line no-magic-numbers
		expect(response.body).toHaveLength(1);
		const [responseBody] = response.body;

		expect(responseBody.email).toBe(userData.email);
		expect(responseBody.username).toBe(userData.username);
		expect(responseBody.password).toBeUndefined();
		expect(responseBody._id).toBeDefined;
	});
});
