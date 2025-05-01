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
export interface DomainAssets {
  id: number;
  domain: string;
  urls: UrlWithAssets[];
}

export interface UrlWithAssets {
  id: number;
  url: string;
  assets: Asset[];
}

export interface Asset {
  id: number;
  type: string;
  status: string;
}
