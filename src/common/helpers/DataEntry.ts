import { AgentType, PreferredContactMethod } from "../../agent/agent.enums";
import { CreateAgentDto } from "../../agent/agent.dto";
import { CreateUserDto } from "../../user/user.dto";
import { UserRole } from "../../user/user.enums";
import { CreateLicensingInfoDto } from "../../licensing-info/licensing-info.dto";
import { faker } from "@faker-js/faker/.";

export default class DataEntry {
    public static createUserDto: CreateUserDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        // email: faker.internet.email(),
        email: 'efagenevalentine@gmail.com',
        roles: [
            UserRole.AGENT
        ]
    };

    public static createAgentDto: CreateAgentDto = {
        userId: 1,
        title: 'Mr',
        name: 'John Doe',
        phone: '09034360573',
        phone2: null,
        companyName: 'Sam',
        rcNumber: null,
        companyEmail: 'sam@gmail.com',
        companyPhone: '09034360573',
        bankName: 'Sterling',
        accountName: 'Sam',
        accountNumber: '9403849384934',
        countryOfResidence: 'Nigeria',
        state: 'Lagos',
        city: 'Lagos',
        agentType: AgentType.ELITE_PARTNER,
        poc: {
            address: faker.location.streetAddress(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            state: faker.location.state(),
            country: faker.location.country(),
            phoneNumber: faker.phone.number(),
            email: faker.internet.email(),
            preferredContactMethod: PreferredContactMethod.PHONE_NUMBER
        },
    };

    public static buildCreateAgentDto: (id: number) => CreateAgentDto = (id) => {
        const createLicensingInfoDto: CreateLicensingInfoDto = {
            agentId: 1,
            regulatoryBody: faker.company.name(),
            url: faker.internet.url(),
        }

        return {
            userId: id,
            agentType: AgentType.ELITE_PARTNER,
            title: 'Mr',
            name: 'John Doe',
            phone: '09034360573',
            phone2: '',
            companyName: 'Sam',
            rcNumber: '74837483',
            companyEmail: 'sam@gmail.com',
            companyPhone: '09034360573',
            // bankName: 'Sterling',
            // accountName: 'Sam',
            // accountNumber: '9403849384934',
            countryOfResidence: 'Nigeria',
            state: 'Lagos',
            city: 'Lagos',
            licensingInfo: [createLicensingInfoDto],
            poc: {
                address: faker.location.streetAddress(),
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                state: faker.location.state(),
                country: faker.location.country(),
                phoneNumber: faker.phone.number({ style: 'international' }),
                email: faker.internet.email(),
                preferredContactMethod: PreferredContactMethod.PHONE_NUMBER
            },
        }
    };
}