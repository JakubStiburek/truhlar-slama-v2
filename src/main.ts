import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartial(
    'footer',
    '<footer>\n' +
      '  <div class="footer-container">\n' +
      '    <div class="logo-container">\n' +
      '      <img class="logo" src="logo.png" alt="Firemní logo" width="50">\n' +
      '    </div>\n' +
      '    <ul class="footer-list">\n' +
      '      <li><a href="tel:608334824">+420 608 334 824</a></li>\n' +
      '      <li><a\n' +
      '        href="mailto:ondrej.slama@truhlarslama.cz">ondrej.slama@truhlarslama.cz</a></li>\n' +
      '      <li><a href="https://www.instagram.com/slamuv_truhlarsky_koutek/">IG: @slamuv_truhlarsky_koutek</a></li>\n' +
      '      <li><a href="https://www.facebook.com/profile.php?id=61553955157538">FB: Truhlář Sláma</a></li>\n' +
      '    </ul>\n' +
      '  </div>\n' +
      '</footer>',
  );
  hbs.registerPartial(
    'header',
    '<header>\n' +
      '  <div class="logo-container">\n' +
      '    <img class="logo" src="logo.png" alt="Firemní logo" width="50">\n' +
      '  </div>\n' +
      '  <span class="truhlar-slama">\n' +
      '      Truhlář Sláma\n' +
      '    </span>\n' +
      '  <div class="header-divider"></div>\n' +
      '  <nav>\n' +
      '    <div>\n' +
      '      <a href="/">Domů</a>\n' +
      '    </div>\n' +
      '    <div>\n' +
      '      <a href="portfolio?page=1">Portfolio</a>\n' +
      '    </div>\n' +
      '  </nav>\n' +
      '</header>',
  );
  hbs.registerPartial(
    'head',
    '  <meta charset="utf-8" />\n' +
      '  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />\n' +
      '  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />\n' +
      '  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />\n' +
      '  <link rel="manifest" href="/site.webmanifest" />\n' +
      '  <meta name="viewport" content="width=device-width" />\n' +
      '  <meta name="description"\n' +
      '        content="Truhlář Ondřej Sláma. Řemeslná výroba ze dřeva - nábytek, zakázková výroba, unikátní kousky. Tel: 608334824, mail: ondrej.slama@truhlarslama.cz" />\n' +
      '  <link rel="preconnect" href="https://fonts.googleapis.com">\n' +
      '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '  <link\n' +
      '    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,400;0,700;1,400&display=swap"\n' +
      '    rel="stylesheet">\n' +
      '  <link rel="stylesheet" type="text/css" href="css/common.css" />',
  );

  await app.listen(3000);
}
bootstrap();
