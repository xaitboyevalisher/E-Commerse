export interface Service {
  image: string;
  title: string;
}

export interface Category {
  id: number;
  image: string;
  title: string;
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
