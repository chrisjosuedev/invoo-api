import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from "./dtos/create-user.dto";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  // TODO: Custom responses
  
  // Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
