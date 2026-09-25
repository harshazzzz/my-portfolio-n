import {
  IsString,
  Length,
  MaxLength,
  Matches,
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
  IsIn,
} from 'class-validator';
export class CreateBlogDto {
  @IsString()
  @Length(1, 160)
  @Matches(/\S/)
  title!: string;
  @IsString()
  @Length(1, 180)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;
  @IsString()
  @Length(1, 500)
  @Matches(/\S/)
  excerpt!: string;
  @IsString()
  @Length(1, 100000)
  @Matches(/\S/)
  content!: string;
  @IsString()
  @MaxLength(2048)
  @Matches(/^(https:\/\/[^\s]+|\/blog\/[a-zA-Z0-9_./-]+)?$/)
  coverImage!: string;
  @IsString()
  @Length(1, 80)
  @Matches(/\S/)
  category!: string;
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 40, { each: true })
  tags!: string[];
  @IsIn(['DRAFT', 'PUBLISHED'])
  status!: 'DRAFT' | 'PUBLISHED';
}
