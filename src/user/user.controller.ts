import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** TODO: Custom responses
   * Example:
   * {
   *  statusCode: number,
   *  message: string,
   *  data: T || T[]
   * }
   *
   **/

  /**
   * Get all users.
   * TODO: Add pagination and search
   */
  @Get()
  async getAllUsers(@Query() paginationData: PaginationDto) {
    return await this.userService.findAllUsers(paginationData);
  }

  // Get User By Username or Email
  @Get('/details')
  async getUserProfile(@Query('query') query: string) {
    return await this.userService.findByUsernameOrEmail(query);
  }

  // TODO: Get Profile User from TOKEN

  // Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  // Update User Info
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto) {
    // TODO: Get id from User Header
    const id = 12;
    return await this.userService.update(updateUserDto, id)
  }
}
