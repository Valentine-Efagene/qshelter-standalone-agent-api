import request from 'supertest';
import DataEntry from "../src/common/helpers/DataEntry";
import { CreateAgentDto } from '../src/agent/agent.dto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
import { Agent } from '../src/agent/agent.entity';

export default class TestFunctions {
    public static async createUser(userService: UserService) {
        const createUserDto = DataEntry.createUserDto
        const user = await userService.create(createUserDto)

        expect(user).toBeDefined();
        expect(user.firstName).toEqual(createUserDto.firstName);
    }

    public static async createAgent(app: INestApplication<any>, userService: UserService): Promise<Agent> {
        const createUserDto = DataEntry.createUserDto
        const user = await userService.create(createUserDto)
        const createAgentDto: CreateAgentDto = DataEntry.buildCreateAgentDto(user.id)
        let agent: Agent

        await request(app.getHttpServer())
            .post('/agents')
            .send(createAgentDto)
            .expect((res) => {
                expect(res.body).toHaveProperty('data');
                agent = res.body.data as Agent
                expect(res.body.data.id).toBe(1);
                expect(res.body.data.title).toBe(createAgentDto.title);
                expect(res.body.data.name).toBe(createAgentDto.name);
                expect(res.body.statusCode).toBe(201);
            })
            .expect(201);

        await request(app.getHttpServer())
            .get('/agents/1')
            .expect(HttpStatus.OK)
            .expect(res => {
                expect(res.body.data.licensingInfo.length).toBe(1)
            })

        return agent
    }
}