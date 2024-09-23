import { Controller, Get, Inject, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'node:process';
import { formatSeconds } from './utils';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InquiryDto } from './dto/inquiry.dto';
import { validate } from 'class-validator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @Render('index')
  async root(@Query() query: InquiryDto) {
    const hasInquiry = Object.keys(query).length > 0;
    const homeImageAssetId = this.configService.get<string>(
      'HOME_IMAGE_CLOUDINARY_ASSET_ID',
    );
    const homeImage = await this.appService.getAssetById(homeImageAssetId);
    if (!hasInquiry) {
      return {
        profileImageUrl: homeImage.secure_url,
        profileImageCaption: homeImage.context.caption,
        inquiryAccepted: false,
      };
    }

    const validationErrors = await validate(
      new InquiryDto(
        query.fname,
        query.lname,
        query.phone,
        query.region,
        query.inquiry,
        query.email,
      ),
    );

    if (validationErrors.length > 0) {
      return {
        profileImageUrl: homeImage.secure_url,
        profileImageCaption: homeImage.context.caption,
        inquiryAccepted: false,
        inquiryProcessingError: false,
        invalidFormData: true,
        inquiryForm: {
          ...query,
        },
      };
    }

    // Sending email is too slow, we show success immediately. If an error happens we log the query data and contact the customer.
    this.appService.processInquiry(query);

    return {
      profileImageUrl: homeImage.secure_url,
      profileImageCaption: homeImage.context.caption,
      inquiryAccepted: true,
      invalidFormData: validationErrors.length > 0,
      inquiryForm: {
        ...query,
      },
    };
  }

  @Get('portfolio')
  @Render('portfolio')
  async portfolio(@Query('page') page = 1) {
    const pageNumber = Number(page);
    const { assets, pagination } = await this.appService.getAssets(pageNumber);
    return {
      assetsLeft: assets.slice(0, assets.length / 2),
      assetsRight: assets.slice(assets.length / 2, assets.length),
      nextPage: pagination.total > pageNumber + 1 ? pageNumber + 1 : undefined,
      prevPage: pageNumber > 2 ? pageNumber - 1 : undefined,
      pagination: {
        pages: Array.from({ length: pagination.total }, (_, i) => ({
          number: i + 1,
          current: pagination.current === i + 1,
        })).slice(
          pagination.current > 3 ? pagination.current - 3 : 0,
          pagination.total >= pagination.current + 3
            ? pagination.current + 2
            : pagination.total,
        ),
        ...pagination,
      },
    };
  }

  @Get('admin')
  @Render('admin')
  admin() {
    return {
      baseUrl: this.configService.get<string>('BASE_URL'),
    };
  }

  @Get('cache')
  @Render('success')
  async getPortfolioCache() {
    await this.cacheManager.reset();
    return {};
  }

  @Get('health')
  health() {
    return {
      status: 'UP',
      uptime: formatSeconds(Math.floor(process.uptime())),
    };
  }
}
