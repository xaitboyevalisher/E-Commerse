export interface Service {
  image: string;
  title: string;
}

export interface Category {
  id: number;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  photoPath: string;
}

export interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  originalPrice: string;
  available: boolean;
  onSale: boolean;
  hasGift: boolean;
}

export interface ProductCardProps {
  product: Product;
}

export interface FilterOptions {
  priceRange: [number, number];
  features: string[];
  colors?: string[];
  sizes?: string[];
}

export interface ContactRequest {
  name: string;
  email: string;
}

export interface ContactResponse {
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: {
      accessToken: string;
      refreshToken: string;
    };
    roles: string[];
  };
}
export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

// types.ts
export interface ApplicationData {
  name: string;
  company: string;
  phone: string;
  lockId: number;
  lockAmount: number;
  customLogo: boolean;
  helpSetup: boolean;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data?: any; // Or add specific response structure if known
}
