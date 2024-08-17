import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {}

  @Get('portfolio')
  @Render('portfolio')
  async portfolio() {
    const assets = await this.appService.getAssets();
    return {
      assets,
    };
  }
}
