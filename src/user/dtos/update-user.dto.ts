import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UpdatePersonDto } from 'src/person/dtos/update-person.dto';

export class UpdateUserDto extends UpdatePersonDto {
  @IsOptional()
  @IsString({ message: 'Username must be a string.' })
  @MinLength(8, { message: 'Username must have 8 character minimum.' })
  @MaxLength(64, { message: 'Username should not be greater than 50 characters.' })
  username?: string;
}
