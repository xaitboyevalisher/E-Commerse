import api from "../api/api";

export interface Lock {
  id: number;
  name: string;
  description: string;
  price: number;
  color: string;
  lockType: string;
  createdAt: string;
  updatedAt: string;
  photos: string[];
}

export const getLocks = async (): Promise<Lock[]> => {
  const response = await api.get("/lock/get-all-by-filter", {
    params: { page: 0, size: 10 },
  });
  return response.data.data;
};
