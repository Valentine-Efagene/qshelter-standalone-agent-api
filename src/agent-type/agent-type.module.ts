import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentTypeLookup } from './agent-type.entity';
import { AgentTypeService } from './agent-type.service';
import { AgentTypeController } from './agent-type.controller';
import { CaslModule } from '../common/casl/casl.module';

@Module({
    imports: [TypeOrmModule.forFeature([AgentTypeLookup]), CaslModule],
    providers: [AgentTypeService],
    controllers: [AgentTypeController],
    exports: [AgentTypeService, TypeOrmModule],
})
export class AgentTypeModule { }
