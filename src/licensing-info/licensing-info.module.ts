import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicensingInfo } from './licensing-info.entity';
import { LicensingInfoService } from './licensing-info.service';
import { LicensingInfoController } from './licensing-info.controller';
import { CaslModule } from '../common/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([LicensingInfo]), CaslModule],
  providers: [LicensingInfoService],
  controllers: [LicensingInfoController],
})
export class LicensingInfoModule { }
