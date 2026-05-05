import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicensingInfo } from './licensing-info.entity';
import { LicensingInfoService } from './licensing-info.service';
import { LicensingInfoController } from './licensing-info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LicensingInfo])],
  providers: [LicensingInfoService],
  controllers: [LicensingInfoController],
})
export class LicensingInfoModule { }
