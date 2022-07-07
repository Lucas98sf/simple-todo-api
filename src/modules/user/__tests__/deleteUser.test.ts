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

describe('DELETE /user/:id', () => {
	it('Should delete an user', async () => {
		const user = await request(app).post(BASE_URI).send(userData);
		const userId = user.body._id;

		const response = await request(app).delete(`${BASE_URI}/${userId}`);

		expect(response.status).toBe(httpStatus.NO_CONTENT);
		expect(response.body).toEqual({});
	});

	it('Should throw when userId does not exist in the database', async () => {
		const response = await request(app).delete(`${BASE_URI}/62c6e6e2cd43d155e6b949fc`);

		expect(response.status).toBe(httpStatus.PRECONDITION_FAILED);
	});

	it('Should throw when userId is not an valid ObjectId', async () => {
		const response = await request(app).delete(`${BASE_URI}/abc123`);

		expect(response.status).toBe(httpStatus.BAD_REQUEST);
	});
});
