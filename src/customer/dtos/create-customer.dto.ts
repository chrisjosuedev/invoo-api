import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerDto  {
  @MinLength(13, { message: 'id must have 13 character minimum.' })
  @MaxLength(13, { message: 'id should not be greater than 13 characters.' })
  @IsNotEmpty({ message: 'id is required.' })
  @IsString({ message: 'id must be a string.' })
  @Matches(new RegExp('^[0-9]*$'), { message: 'id must contain only numbers.' })
  id: string;

  @MinLength(2, { message: 'Fullname must have 2 character minimum.' })
  @MaxLength(50, { message: 'Fullname should not be greater than 50 characters.' })
  @IsNotEmpty({ message: 'Fullname is required.' })
  @IsString({ message: 'Fullname must be a string.' })
  fullName: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string.' })
  @MaxLength(20, { message: 'Phone should not be greater than 50 characters.' })
  @Matches(new RegExp('^[0-9]*$'), { message: 'Phone must contain only numbers.' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'RTN must be a string.' })
  @MinLength(14, { message: 'RTN must have 14 character minimum.' })
  @MaxLength(14, { message: 'RTN should not be greater than 14 characters.' })
  @Matches(new RegExp('^[0-9]*$'), { message: 'RTN must contain only numbers.' })
  rtn: string;
}
