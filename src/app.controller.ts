import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';

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
      assets: assetsWithPage.assets,
      nextPage: assetsWithPage.hasNextPage ? pageNumber + 1 : undefined,
      prevPage: pageNumber > 0 ? pageNumber - 1 : undefined,
    };
  }
}
