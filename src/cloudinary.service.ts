import {
  BadGatewayException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Asset, AssetList } from './cloudinary.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CloudinaryService {
  private readonly secret: string;
  private readonly name: string;
  private readonly key: string;
  private cloudinary = cloudinary;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('CLOUDINARY_SECRET');
    this.name = this.configService.get<string>('CLOUDINARY_NAME');
    this.key = this.configService.get<string>('CLOUDINARY_KEY');

    if (!(this.secret && this.name && this.key)) {
      throw new InternalServerErrorException();
    }
    this.cloudinary.config({
      cloud_name: this.name,
      api_key: this.key,
      api_secret: this.secret,
    });
  }

  async getAssetList(): Promise<AssetList> {
    const cachedAssetList = await this.cacheManager.get<AssetList>('assetList');
    if (cachedAssetList) {
      return cachedAssetList;
    }

    try {
      const assetList = await this.cloudinary.search
        .expression('folder:test')
        .sort_by('uploaded_at', 'desc')
        .fields('asset_id')
        .execute();

      await this.cacheManager.set('assetList', assetList, 60 * 60 * 1000);
      return assetList;
    } catch (error) {
      console.error(error);
      throw new BadGatewayException();
    }
  }

  async getAssetsByIds(ids: string[], offset: number): Promise<Asset[]> {
    const cacheKey = `assets-${offset}`;
    const cachedAssets = await this.cacheManager.get<Asset[]>(cacheKey);
    if (cachedAssets) {
      return cachedAssets;
    }

    try {
      const rawAssets = await this.cloudinary.api.resources_by_asset_ids(ids, {
        context: true,
      });

      const assets = rawAssets.resources.map((asset) => ({
        secure_url: asset.secure_url,
        width: asset.width,
        height: asset.height,
      }));

      await this.cacheManager.set(cacheKey, assets);

      return assets;
    } catch (error) {
      console.error(error);
      throw new BadGatewayException();
    }
  }
}
