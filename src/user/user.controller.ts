import { Body, Controller, Delete, Get, HttpStatus, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ResponseHandler } from 'src/common/builders/response.builder';
import { JwtAuthGuard } from 'src/common/guards/jwt-guard.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get All Users
  @Get()
  async getAllUsers(@Query() paginationData: PaginationDto) {
    const allUsers = await this.userService.findAllUsers(paginationData);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'List of all users registered.', allUsers);
  }

  // Get User By Username or Email
  @Get('/details')
  async getUserProfile(@Query('query') query: string) {
    const userDetails = await this.userService.findByUsernameOrEmail(query);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'User details found.', userDetails);
  }

  // Update User Info
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const updatedUser = await this.userService.update(updateUserDto, req.user?.id);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'User updated successfully.', updatedUser);
  }

  // Desactive Account
  @Delete()
  async desactive(@Req() req) {
    await this.userService.desactivate(req.user?.id);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'User removed successfully.');
  }
}
