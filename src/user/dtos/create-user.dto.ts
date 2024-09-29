import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreatePersonDto } from 'src/person/dtos/create-person.dto';

export class CreateUserDto extends CreatePersonDto {
  @IsNotEmpty({ message: 'Username is required.' })
  @IsString({ message: 'Username must be a string.' })
  @MinLength(8, { message: 'Username must have 8 character minimum.' })
  @MaxLength(64, { message: 'Username should not be greater than 50 characters.' })
  username: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must have 8 character minimum.' })
  @MaxLength(70, { message: 'Password should not be greater than 70 characters.' })
  // TODO: Custom Decorator to validate a strong password
  password: string;

  @IsOptional()
  @IsBoolean({ message: 'Google Flag must be a booolean.' })
  isGoogle?: boolean;
}
