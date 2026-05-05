import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentDocument } from './agent-document.entity';
import { AgentDocumentService } from './agent-document.service';
import { AgentDocumentController } from './agent-document.controller';
import { S3UploaderModule } from '../s3-uploader/s3-uploader.module';
import { Agent } from '../agent/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgentDocument, Agent]), S3UploaderModule],
  providers: [AgentDocumentService],
  controllers: [AgentDocumentController],
  exports: [AgentDocumentService]
})
export class AgentDocumentModule { }
