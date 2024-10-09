import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePersonDto {
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
  // TODO: Custom Decorator to validate a phone number
  phone?: string;
}
