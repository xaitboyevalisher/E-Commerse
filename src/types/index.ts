export interface Service {
  image: string;
  title: string;
}

export interface Category {
  id: number;
  name: string;
  photoPath: string;
  createdAt: string;
  updatedAt: string;
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
  data?: any; 
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  newPrice: number;
  categoryId: number;
  hasGift: boolean;
  photos: string[];
  lockType: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  colors: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface OrderRequestResponse <T> {
  status: string;
  message: string;
  data: T; 
};


export type OrderRequest = {
  orderLines: {
    lockId: number;
    amount: number;
  }[];
  customerDto: {
    name: string;
    surname: string;
    phone: string;
    email: string;
  };
  orderDetailDto: {
    city: string;
    branch: string;
    paymentType: "WITH_CARD" | "WITH_CASH";
    setupLock: boolean;
    installSoft: boolean;
    comment: string;
  };
  promoCode: string;
};


export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  gift?: string;
}

export interface BatteryDto {
  voltage: number;
  ampere: number;
}

export interface DoorWidthDto {
  a: number;
  b: number;
}

export interface LockSizeReq {
  a: number;
  b: number;
  c: number;
}

export interface LockDetails {
  lockId: number;
  memoryOfCards: number;
  application: boolean;
  colors: string[];
  materialUz: string;
  materialEn: string;
  materialRu: string;
  batteryDto: BatteryDto;
  unlockTypes: string[];
  doorType: string;
  doorWidthDto: DoorWidthDto;
  lockSizeReq: LockSizeReq;
  weight: number;
  equipmentUz: string;
  equipmentEn: string;
  equipmentRu: string;
}

