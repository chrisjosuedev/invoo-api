import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First Name is required.' })
  @IsString({ message: 'First Name must be a string.' })
  @MinLength(2, { message: 'First name must have 2 character minimum.' })
  @MaxLength(50, { message: 'First name should not be greater than 50 characters.' })
  firstName: string;

  @MinLength(2, { message: 'Last Name must have 2 character minimum.' })
  @MaxLength(50, { message: 'Last Name should not be greater than 50 characters.' })
  @IsNotEmpty({ message: 'Last Name is required.' })
  @IsString({ message: 'Last Name must be a string.' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string.' })
  @MaxLength(20, { message: 'Phone should not be greater than 50 characters.' })
  @Matches(new RegExp('^[0-9]*$'), { message: 'Phone must contain only numbers.' })
  phone?: string;

  @IsNotEmpty({ message: 'Username is required.' })
  @IsString({ message: 'Username must be a string.' })
  @MinLength(8, { message: 'Username must have 8 character minimum.' })
  @MaxLength(64, { message: 'Username should not be greater than 50 characters.' })
  @Matches(new RegExp('^(?!d)[a-zA-Z0-9.]+$'), { message: 'Invalid username format.' })
  username: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must have 8 character minimum.' })
  @MaxLength(70, { message: 'Password should not be greater than 70 characters.' })
  password: string;

  @IsOptional()
  @IsBoolean({ message: 'Google Flag must be a booolean.' })
  isGoogle?: boolean;
}
