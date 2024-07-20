const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const request = supertest(app);

const { connectDB, disconnectDB } = require('./db');
// jest.setTimeout(200000);

const userInput = { 
    userName: 'testUser',
    email: 'test@atmos.in',
    password: 'dushyant123',
};

const userLogin = {
    email: 'test@atmos.in',
    password: 'dushyant123'
};

describe('Section Routes', () => {
    beforeAll(async () => {
        await connectDB();
    });

    // beforeEach((done=>{
    //     done();
    // }))

    afterAll(async () => {
        await disconnectDB();
        // server.close();
    });

    describe('POST /section/create', () => {
        it('user should be logged in to create a section', async () => {
            const response = await request.post('/user/register').send(userInput);
            const response2 = await request.post('/user/login').send(userLogin);
            // console.log(response.body);
            expect(response2.status).toBe(200);
            expect(response2.body.success).toBe(true);
            expect(response2.body.message).toBe('Login Success');
            expect(response2.body.user).toBeDefined();

            // Save the token for future use
            token = response2.body.token;
        });

        it('should create a section', async () => {
            const response = await request.post('/section/create').set('Authorization', `Bearer ${token}`).send({
                sectionName: 'testSection',
                projectId: '644454f315ededc8026e7c06'
            });
            // console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Create section successfully');
            expect(response.body.section).toBeDefined();
            sectionId = response.body.section._id;
        });
    });

    describe('PUT /section/renameSection', () => {
        it('should get a section', async () => {
            const response = await request.put(`/section/renameSection/64455122bab6a91417e7cce5`).set('Authorization', `Bearer ${token}`).send({
                sectionName: 'testSectionRenamed'
            });
            // console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.section).toBeDefined();
        });
    });

    // describe('DELETE /section/deleteSection', () => {
    //     it('should get all sections', async () => {
    //         const response = await request.delete(`/section/deleteSection/64455122bab6a91417e7cce5`).set('Authorization', `Bearer ${token}`);
    //         console.log(response.body);
    //         expect(response.status).toBe(200);
    //         expect(response.body.success).toBe(true);
    //         expect(response.body.sections).toBeDefined();
    //     });
    // });

});