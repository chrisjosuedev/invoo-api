import { Controller, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard.guard';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { ResponseHandler } from "src/common/builders/response.builder";

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Create a Customer
  @Post(':storeId')
  async create(@Param('storeId', ParseIntPipe) storeId: number, createCustomerDto: CreateCustomerDto, @Req() req: any) {
    const customerSaved = await this.customerService.create(createCustomerDto, storeId, req.user?.id);
    return ResponseHandler.responseBuilder(HttpStatus.CREATED, 'Customer created successfully.', customerSaved);
  }
}
