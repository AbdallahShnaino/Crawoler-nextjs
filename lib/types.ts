export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
}
export interface Domain {
  id: number;
  domain: string;
  urls?: Url[];
}
export interface Url {
  id: number;
  url: string;
  status: string;
}

export interface Asset {
  assetId: number;
  pageId: number;
  assetUrl: string;
  type: string;
  status: string;
  ocrResult: OcrResult;
}
export interface OcrResult {
  content: string;
  confidence: number;
}

export interface UrlWithAssets {
  id: number;
  url: string;
  assets: UrlAsset[];
}

export interface UrlAsset {
  id: number;
  type: string;
  status: string;
}
