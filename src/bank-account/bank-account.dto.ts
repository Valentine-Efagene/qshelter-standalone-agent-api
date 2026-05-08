import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertBankAccountDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    agentId: number;

    @ApiProperty({ example: 'Access Bank Plc' })
    @IsNotEmpty()
    @MaxLength(255)
    bankName: string;

    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    @MaxLength(255)
    accountName: string;

    @ApiProperty({ example: '0123456789' })
    @IsNotEmpty()
    @MaxLength(255)
    accountNumber: string;
}
