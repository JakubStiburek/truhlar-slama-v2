import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class AppService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async getAssets() {
    const assetList = await this.cloudinaryService.getAssetList();
    return await this.cloudinaryService.getAssetsByIds(
      assetList.resources.map((asset) => asset.asset_id),
    );
  }
}
