import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { MailService } from './mail.service';
import { InquiryDto } from './dto/inquiry.dto';
import { RegionsMap } from './regions.map';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
  ) {}

  async getPortfolioAssets(pageNumber: number) {
    const offset = pageNumber - 1;
    const assetList = await this.cloudinaryService.getAssetList('portfolio');
    const currentPage = assetList.resources.slice(
      10 * offset,
      10 * offset + 10,
    );
    const assets = await this.cloudinaryService.getAssetsByIds(
      currentPage.map((asset) => asset.asset_id),
      offset,
      'portfolio',
    );

    return {
      assets,
      hasNextPage: assetList.resources.length > 10 * offset + 10,
      pagination: {
        current: pageNumber,
        total: Math.floor(assetList.resources.length / 10),
      },
    };
  }

  async getReviewsAssets() {
    const assetList = await this.cloudinaryService.getAssetList('reviews');
    return this.cloudinaryService.getAssetsByIds(
      assetList.resources.map((r) => r.asset_id),
      0,
      'reviews',
    );
  }

  async getAssetById(id: string) {
    return await this.cloudinaryService.getAssetById(id);
  }

  async processInquiry(inquiry: InquiryDto) {
    try {
      const data = {
        to: 'ondrej.slama@truhlarslama.cz',
        from: 'poptavky@truhlarslama.cz',
        subject: `${inquiry.fname} ${inquiry.lname} - Poptávka z webového formuláře`,
        text: `Zákazník: ${inquiry.fname} ${inquiry.lname}. Tel: ${inquiry.phone}. Email: ${inquiry.email || '(není)'} Kraj: ${RegionsMap.get(Number(inquiry.region))}. Poptávka: ${inquiry.inquiry}`,
      };
      await this.mailService.sendEmail(data);
    } catch (e) {
      this.logger.log(inquiry);
      this.logger.error(e);
    }
  }
}
