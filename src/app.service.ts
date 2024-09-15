import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class AppService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async getAssets(pageNumber: number) {
    const offset = pageNumber - 1;
    const assetList = await this.cloudinaryService.getAssetList();
    const currentPage = assetList.resources.slice(
      10 * offset,
      10 * offset + 10,
    );
    const assets = await this.cloudinaryService.getAssetsByIds(
      currentPage.map((asset) => asset.asset_id),
      offset,
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

  async getAssetById(id: string) {
    return await this.cloudinaryService.getAssetById(id);
  }
}
