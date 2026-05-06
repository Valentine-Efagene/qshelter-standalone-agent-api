import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
    HttpStatus,
    ParseIntPipe,
    HttpCode,
    Patch,
} from '@nestjs/common';
import OpenApiHelper from '../common/OpenApiHelper';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    ApiResult,
    okResponse,
    UpdateDocumentStatusDto,
} from '../common/common.dto';
import { ResponseMessage } from '../common/common.enum';
import { AuthGuard } from '../common/auth/auth.guard';
import { AgentDocumentService } from './agent-document.service';
import { CreateAgentDocumentDto, UpdateAgentDocumentDto } from './agent-document.dto';
import { AgentDocument } from './agent-document.entity';
import { S3UploaderService } from '../s3-uploader/s3-uploader.service';

@AuthGuard()
@Controller('agent-documents')
@ApiTags('Agent Documents')
@ApiResponse(OpenApiHelper.responseDoc)
export class AgentDocumentController {
    constructor(
        private readonly agentDocumentService: AgentDocumentService,
        private readonly s3UploaderService: S3UploaderService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Upload a file',
        description: '',
    })
    async create(
        @Body() createagentDocumentDto: CreateAgentDocumentDto,
    ): Promise<ApiResult<AgentDocument>> {
        const data = await this.agentDocumentService.create(createagentDocumentDto);
        return okResponse(data, ResponseMessage.CREATED);
    }

    @Get()
    @ApiResponse(OpenApiHelper.arrayResponseDoc)
    async findAll(): Promise<ApiResult<AgentDocument[]>> {
        const data = await this.agentDocumentService.findAll();
        return okResponse(data, ResponseMessage.FETCHED);
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResult<AgentDocument>> {
        const data = await this.agentDocumentService.findOne(id);
        return okResponse(data, ResponseMessage.FETCHED);
    }

    @HttpCode(HttpStatus.OK)
    @Post(':id/update-status')
    //@Roles([UserRole.ADMIN])
    @ApiOperation({ summary: '', tags: ['Admin'] })
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateDocumentStatusDto,
    ): Promise<ApiResult<AgentDocument>> {
        const data = await this.agentDocumentService.updateStatus(
            id,
            updateDto,
        );

        return okResponse(data, ResponseMessage.UPDATED);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateAgentDocumentDto,
    ): Promise<ApiResult<AgentDocument>> {
        if (updateDto.url) {
            const document = await this.agentDocumentService.findOne(id)

            try {
                await this.s3UploaderService.deleteFromS3(document.url)
            } catch (error) {
                console.log('Error while deleting a file from S3:', error)
            }
        }

        const data = await this.agentDocumentService.updateOne(id, updateDto);
        return okResponse(data, ResponseMessage.UPDATED);
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,): Promise<ApiResult<void>> {
        const document = await this.agentDocumentService.findOne(id)
        await this.s3UploaderService.deleteFromS3(document.url)
        await this.agentDocumentService.remove(id);

        return okResponse(null, ResponseMessage.DELETED);
    }
}
