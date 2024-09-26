import { Controller } from '@nestjs/common';
import { InvoiceDetailService } from './invoice-detail.service';

@Controller('invoice-detail')
export class InvoiceDetailController {
  constructor(private readonly invoiceDetailService: InvoiceDetailService) {}
}
