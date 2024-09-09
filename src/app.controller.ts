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
    const assetsWithPage = await this.appService.getAssets(pageNumber - 1);
    return {
      assetsLeft: assetsWithPage.assets.slice(
        0,
        assetsWithPage.assets.length / 2,
      ),
      assetsRight: assetsWithPage.assets.slice(
        assetsWithPage.assets.length / 2,
        assetsWithPage.assets.length,
      ),
      nextPage: assetsWithPage.hasNextPage ? pageNumber + 1 : undefined,
      prevPage: pageNumber > 0 ? pageNumber - 1 : undefined,
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
