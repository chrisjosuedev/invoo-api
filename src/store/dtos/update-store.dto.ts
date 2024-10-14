import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateStoreDto {
  @IsString({ message: 'Description must be a string.' })
  @MinLength(2, { message: 'Description must have 2 character minimum.' })
  @MaxLength(150, { message: 'Description should not be greater than 100 characters.' })
  description: string;
  
  @IsOptional()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;
  
  @IsOptional()
  @IsString({ message: 'Phone must be a string.' })
  @MaxLength(20, { message: 'Phone should not be greater than 50 characters.' })
  @Matches(new RegExp('^[0-9]*$'), { message: 'Phone must contain only numbers.' })
  phone: string;
}