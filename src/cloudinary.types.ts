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
}
