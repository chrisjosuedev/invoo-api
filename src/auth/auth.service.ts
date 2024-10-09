import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { ErrorDto } from "src/common/dto/error-dto.dto";
import { AccessTokenPayload, TokenPayload } from "src/common/interfaces/jwt-token.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate Credentials
  async validateUser(loginDto: LoginDto): Promise<TokenPayload> {
    const { username, password } = loginDto;
    const foundUser = await this.userService.findByUsernameOrEmail(username);

    // Match Password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) throw new UnauthorizedException(new ErrorDto(HttpStatus.UNAUTHORIZED, 'Password is incorrect.'));

    // Check if user want to reactivate the account
    if (!foundUser.person.isActive) await this.userService.activate(foundUser.person_id);

    // Return user if all correct
    return this.signToken(foundUser);
  }

  // Login
  signToken(user: User): TokenPayload {
    const payload: AccessTokenPayload = { id: user.person_id, username: user.username  };
    return { token: this.jwtService.sign(payload) };
  }

  // Register
  async signUp(createUserDto: CreateUserDto): Promise<TokenPayload> {
    // Register User
    const createdUser = await this.userService.create(createUserDto);
    return this.signToken(createdUser);
  }
}
