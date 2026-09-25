import {
  IsString,
  Length,
  Matches,
  MaxLength,
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
  IsBoolean,
  IsIn,
  ValidateIf,
} from 'class-validator';
export class CreateProjectDto {
  @IsString()
  @Length(1, 160)
  @Matches(/\S/)
  title!: string;
  @IsString()
  @Length(1, 180)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;
  @IsString()
  @Length(1, 100)
  @Matches(/\S/)
  category!: string;
  @IsString()
  @Length(1, 500)
  @Matches(/\S/)
  shortDescription!: string;
  @IsString()
  @Length(1, 20000)
  @Matches(/\S/)
  description!: string;
  @IsString()
  @MaxLength(2048)
  @Matches(/^(https:\/\/[^\s]+|\/projects\/[a-zA-Z0-9_./-]+)?$/)
  coverImage!: string;
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  @Matches(/^https:\/\/[^\s]+$/, { each: true })
  images!: string[];
  @IsArray()
  @ArrayMaxSize(40)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 60, { each: true })
  technologies!: string[];
  @IsString()
  @MaxLength(2048)
  @Matches(/^(https:\/\/github\.com\/[^\s]+)?$/)
  githubUrl!: string;
  @IsString()
  @MaxLength(2048)
  @Matches(/^(https?:\/\/[^\s]+)?$/)
  liveUrl!: string;
  @IsBoolean()
  featured!: boolean;
  @IsIn(['DRAFT', 'PUBLISHED'])
  status!: 'DRAFT' | 'PUBLISHED';
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @MaxLength(120)
  role?: string;
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(30)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 500, { each: true })
  features?: string[];
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(30)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 500, { each: true })
  benefits?: string[];
}
