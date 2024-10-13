import { Module } from '@nestjs/common';
import { InvoiceDetailService } from './invoice-detail.service';
import { InvoiceDetailController } from './invoice-detail.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvoiceDetail } from "./entities/invoice-detail.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceDetail])],
  controllers: [InvoiceDetailController],
  providers: [InvoiceDetailService],
})
export class InvoiceDetailModule {}
