import { Transform } from 'class-transformer';
import { IsString, IsEmail, Length, MaxLength, Matches } from 'class-validator';
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
export class CreateMessageDto {
  @Transform(trim) @IsString() @Length(1, 100) @Matches(/\S/) name!: string;
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email!: string;
  @Transform(trim) @IsString() @Length(1, 160) @Matches(/\S/) subject!: string;
  @Transform(trim)
  @IsString()
  @Length(1, 10000)
  @Matches(/\S/)
  message!: string;
}
