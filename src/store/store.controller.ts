import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ResponseHandler } from 'src/common/builders/response.builder';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from "./dtos/update-store.dto";

@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // Get User Stores
  @Get()
  async getAllStores(@Query() paginationDto: PaginationDto, @Req() req: any) {
    const allStores = await this.storeService.findAllStores(paginationDto, req.user?.id);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'List of all user stores', allStores);
  }

  // Get Store by Id
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const store = await this.storeService.findById(id, req.user?.id);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'Store found.', store);
  }

  // Create a new Store
  @Post()
  async create(@Body() createStoreDto: CreateStoreDto, @Req() req: any) {
    const savedStore = await this.storeService.create(createStoreDto, req.user?.id);
    return ResponseHandler.responseBuilder(HttpStatus.CREATED, 'Store created successfully.', savedStore);
  }
  
  // Update Store
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateStoreDto: UpdateStoreDto, @Req() req: any) {
    const updatedStore = await this.storeService.update(updateStoreDto, id, req.user?.id);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'Store udpated successfully.', updatedStore);
  }

  // Delete Store
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    await this.storeService.delete(id, req.user?.id);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'Store removed successfully.');
  }
}
