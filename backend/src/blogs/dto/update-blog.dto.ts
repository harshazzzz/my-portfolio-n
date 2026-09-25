import {
  IsString,
  Length,
  MaxLength,
  Matches,
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
  IsIn,
  ValidateIf,
} from 'class-validator';
export class UpdateBlogDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 160)
  @Matches(/\S/)
  title?: string;
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 180)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 500)
  @Matches(/\S/)
  excerpt?: string;
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 100000)
  @Matches(/\S/)
  content?: string;
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @MaxLength(2048)
  @Matches(/^(https:\/\/[^\s]+|\/blog\/[a-zA-Z0-9_./-]+)?$/)
  coverImage?: string;
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 80)
  @Matches(/\S/)
  category?: string;
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 40, { each: true })
  tags?: string[];
  @ValidateIf((_object, value) => value !== undefined)
  @IsIn(['DRAFT', 'PUBLISHED'])
  status?: 'DRAFT' | 'PUBLISHED';
}
