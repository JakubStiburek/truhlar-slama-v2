import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InquiryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  fname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  lname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  region: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1500)
  inquiry: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  email?: string;

  constructor(
    fname: string,
    lname: string,
    phone: string,
    region: string,
    inquiry: string,
    email?: string,
  ) {
    this.fname = fname;
    this.lname = lname;
    this.phone = phone;
    this.region = region;
    this.inquiry = inquiry;
    this.email = email;
  }
}
