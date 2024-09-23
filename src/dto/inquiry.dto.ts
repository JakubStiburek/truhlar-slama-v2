export class InquiryDto {
  fname: string;
  lname: string;
  phone: string;
  region: string;
  inquiry: string;
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
