import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  ContactRequest,
  ContactResponse,
  UpdateProfilePayload,
  ApplicationData,
  ApplicationResponse,
} from "../types";

const baseUrl = "http://8.210.211.217:8080/api/v1";

const api: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshResponse: AxiosResponse = await axios.post(
            `${baseUrl}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("access_token", newAccessToken);

          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error("Refresh token xatosi:", refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const register = async (user: {
  name: string;
  email: string;
  password: string;
}): Promise<void> => {
  try {
    const response = await api.post("/auth/sign-up", user);

    if (response.status === 201) {
      console.log("Ro'yxatdan o'tish muvaffaqiyatli:", response.data);
      const { access_token, refresh_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ro'yxatdan o'tishda xato:", error.response?.data);
    } else {
      console.error("Tizimda xatolik yuz berdi:", error);
    }
    throw error;
  }
};

export const addContact = async (
  contact: ContactRequest
): Promise<ContactResponse> => {
  const response = await api.post<ContactResponse>("/contact/add", contact);
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfilePayload
): Promise<void> => {
  try {
    const response = await api.put("/user/update-profile", data);
    console.log("Profil muvaffaqiyatli yangilandi:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Profilni yangilashda xatolik:", error.response?.data);
    } else {
      console.error("Tizimda xatolik yuz berdi:", error);
    }
    throw error;
  }
};

export const submitApplication = async (
  application: ApplicationData
): Promise<ApplicationResponse> => {
  try {
    const response = await api.post<ApplicationResponse>(
      "/application/add",
      application
    );
    console.log("Ariza yuborildi:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ariza yuborishda xatolik:", error.response?.data);
    } else {
      console.error("Tizimda xatolik yuz berdi:", error);
    }
    throw error;
  }
};

export default api;
