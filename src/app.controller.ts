import { Controller, Get, Inject, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'node:process';
import { formatSeconds } from './utils';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @Render('index')
  async root() {
    const homeImageAssetId = this.configService.get<string>(
      'HOME_IMAGE_CLOUDINARY_ASSET_ID',
    );
    const homeImage = await this.appService.getAssetById(homeImageAssetId);
    return {
      homeImageUrl: homeImage.secure_url,
      homeImageWidth: homeImage.width,
      homeImageHeight: homeImage.height,
      homeImageCaption: homeImage.context.caption,
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
