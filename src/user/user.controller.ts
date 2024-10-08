import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ResponseHandler } from 'src/common/builders/response.builder';

@Controller('users')
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

  // Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.create(createUserDto);
    return ResponseHandler.responseBuilder(HttpStatus.CREATED, 'User created successfully.', createdUser);
  }

  // Update User Info
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    // TODO: Get id from User Header TOKEN
    const updatedUser = await this.userService.update(updateUserDto, req.user.id);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'User updated successfully.', updatedUser);
  }

  // Desactive Account
  @Delete()
  async desactive(@Req() req: any) {
    await this.userService.desactivate(req.user.id);
    return ResponseHandler.responseBuilder(HttpStatus.OK, 'User removed successfully.');
  }
}
