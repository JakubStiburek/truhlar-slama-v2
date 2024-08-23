import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'node:process';
import { formatSeconds } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {}

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

  @Get('health')
  health() {
    return {
      status: 'UP',
      uptime: formatSeconds(Math.floor(process.uptime())),
    };
  }
}
