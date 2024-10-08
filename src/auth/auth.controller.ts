import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginDto } from "./dtos/login.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Sign In User
  @Post('signin')
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.validateUser(loginDto);
  }
  
  // Sign Up User
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }
}
