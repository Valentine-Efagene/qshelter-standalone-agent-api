import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [CaslModule],
  providers: [CommonService],
  controllers: [CommonController],
  exports: [],
})
export class CommonModule { }
