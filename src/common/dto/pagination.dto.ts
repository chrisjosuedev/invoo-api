import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number.' })
  @Type(() => Number)
  @Min(1, { message: 'Current Page should not be minor than 1.' })
  currentPage?: number = 1;

  @IsOptional()
  @IsNumber({}, { message: 'Skip must be a number.' })
  @Type(() => Number)
  itemsPerPage?: number = 10;

  
  @IsString({ message: 'Search must be a string.' })
  @IsOptional()
  search?: string;
}
