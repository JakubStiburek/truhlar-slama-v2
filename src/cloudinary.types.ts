export interface AssetListItem {
  asset_id: string;
}

export interface AssetList {
  total_count: number;
  resources: AssetListItem[];
}

export interface Asset {
  secure_url: string;
  width: number;
  height: number;
  context?: {
    caption?: string;
    alt?: string;
    url?: string;
  };
}

export interface ResourceApiResponse {
  resources: {
    secure_url: string;
    width: number;
    height: number;
    context?: {
      custom?: {
        caption?: string;
        url?: string;
      };
    };
  }[];
}
