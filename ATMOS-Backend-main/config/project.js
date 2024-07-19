const supertest = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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

const projectInput = {
    projectName: 'testProject',
    projectDescription: 'testProjectDescription',
    projectStatement: 'testProjectStatement',
    projectMission: 'testProjectMission',
    projectGuidelines: 'testProjectGuidelines',
    projectOwner: '644454ce15ededc8026e7bfa',
    projectType: 'testProjectType'
};


describe('Project Routes', () => {
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

    describe('POST /project/create', () => {
        it('user should be logged in to create a project', async () => {
            const response = await request.post('/user/register').send(userInput);
            const response2 = await request.post('/user/login').send(userLogin);
            // console.log(response.body);
            expect(response2.status).toBe(200);
            expect(response2.body.success).toBe(true);
            expect(response2.body.message).toBe('Login Success');
            expect(response2.body.user).toBeDefined();
            userId = response2.body.user._id;
            // Save the token for future use
            token = response2.body.token;
        });

        it('should create a project', async () => {
            // const response = await request.post('/user/login').send(userLogin);
            // // console.log(response.body);
            // expect(response.status).toBe(200);
            // expect(response.body.success).toBe(true);
            // expect(response.body.message).toBe('Login Success');
            // expect(response.body.user).toBeDefined();

            // // Save the token for future use
            // token = response.body.token;
            const response2 = await request.post('/project/create').set('Authorization', `Bearer ${token}`).send(projectInput);
            // console.log(response2.body);
            expect(response2.status).toBe(200);
            expect(response2.body.success).toBe(true);
            expect(response2.body.message).toBe('Project created successfully');
            expect(response2.body.project).toBeDefined();
            // Save the projectId for future use
            projectId = response2.body.project._id;
        });
    });

    describe.skip('GET /project/getUserProjects', () => {
        it('should get all projects', async () => {
            const response = await request.get('/project/getUserProjects').set('Authorization', `Bearer ${token}`);
            // console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.projects).toBeDefined();
        });
    });

    describe.skip('GET /project/getProjectDetails', () => {
        it('should get a project by id', async () => {
            const response = await request.get(`/project/getProjectDetails/${projectId}`).set('Authorization', `Bearer ${token}`);
            // console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.project).toBeDefined();
        });
    });

    describe('PUT /project/addTeamMember', () => {
        it('should add a team member to a project', async () => {
            const response = await request.put('/project/addTeamMember/644454f315ededc8026e7c06').set('Authorization', `Bearer ${token}`).send({ userId: '641d5832b6cd277cd1f9d201', accessLevel: 'lowAccess' });
            // console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User added to project');
        });
    });

    describe('POST /project/transferOwnership', () => {
        it('should transfer ownership of a project', async () => {
            const response = await request.post('/project/transferOwnership/644454f315ededc8026e7c06').set('Authorization', `Bearer ${token}`).send({ newOwner: '641c25296ea464a6a6799a7e' });
            // console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Project ownership transferred successfully');
        });
    });

    // Test changeUserAccessLevel
    describe.skip('POST /project/changeUserAccessLevel', () => {
        it('should change the access level of a user in a project', async () => {
            const myToken = jwt.sign({ _id: '644454ce15ededc8026e7bfa' }, process.env.TOKEN_SECRET, { expiresIn: '60' });
            const response = await request.post('/project/644454f315ededc8026e7c06/changeUserAccessLevel').set('Authorization', `Bearer ${myToken}`).send({ userId: '641dfcae9bfbc50118964537', newAccessLevel: 'mediumAccess' });
            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User access level changed successfully');
        });
    });

    describe.skip('POST /project/removeTeamMember', () => {
        it('should remove a team member in a project', async () => {
            const myToken = jwt.sign({ _id: '644454ce15ededc8026e7bfa' }, process.env.TOKEN_SECRET, { expiresIn: '60' });
            const response = await request.post('/project/644454f315ededc8026e7c06/removeTeamMember').set('Authorization', `Bearer ${myToken}`).send({ userId: '641dfcae9bfbc50118964537'});
            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User removed from project');
        });
    });

     // Testing route that require ProjectId
     describe.skip('With ProjectId and Token', () => {
        it('should delete a project', async () => {
            const response = await request.delete(`/project/deleteProject/${projectId}`).set('Authorization', `Bearer ${token}`);
            // console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Project deleted successfully');
        });
    });
});

