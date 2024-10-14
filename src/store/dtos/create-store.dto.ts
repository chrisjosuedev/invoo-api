import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateStoreDto {
  @IsNotEmpty({ message: 'Store Name is required.' })
  @IsString({ message: 'Store Name must be a string.' })
  @MinLength(2, { message: 'Store name must have 2 character minimum.' })
  @MaxLength(100, { message: 'First name should not be greater than 100 characters.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MinLength(2, { message: 'Description must have 2 character minimum.' })
  @MaxLength(150, { message: 'Description should not be greater than 100 characters.' })
  description?: string;
  
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string.' })
  @MaxLength(20, { message: 'Phone should not be greater than 50 characters.' })
  @Matches(new RegExp('^[0-9]*$'), { message: 'Phone must contain only numbers.' })
  phone: string;
}