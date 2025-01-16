import axios, { AxiosResponse, AxiosError } from "axios";

// Tạo instance của axios với cấu hình cơ bản
const api = axios.create({
  baseURL: "https://gl03.sangtran.dev/",
  // withCredentials: true,
});

// Thêm interceptor cho request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("user"); // Lấy token từ localStorage (hoặc nơi bạn lưu trữ)
    if (accessToken) {
      console.log(JSON.parse(accessToken));
      if (accessToken && JSON.parse(accessToken)?.access) {
        const Token = JSON.parse(accessToken)?.access?.replace(/"/g, "");

        console.log(Token);
        config.headers = config.headers || {}; // Đảm bảo headers không bị undefined

        config.headers["Authorization"] = `Bearer ${Token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Định nghĩa kiểu cho hàm getData
export const getData = async <T,>(
  endpoint: string,
  params: Record<string, unknown> = {},
  headers: Record<string, string> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get(endpoint, {
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 401) {
      // window.location.href = "/login";
    }
    throw axiosError;
  }
};
 

export const postData = async <T, U = unknown>(
  endpoint: string,
  data: U,
  headers: Record<string, string> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.post(endpoint, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 401) {
      // window.location.href = "/login";
      throw axiosError;
    }
    throw axiosError;
  }
};

// Định nghĩa kiểu cho hàm putData
export const putData = async <T, U = unknown>(
  endpoint: string,
  id: string | number,
  data: U,
  headers: Record<string, string> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.put(
      `${endpoint}/${id}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 401) {
      window.location.href = "/login";
    }
    throw axiosError;
  }
};

// Định nghĩa kiểu cho hàm deleteData
export const deleteData = async <T,>(
  endpoint: string,
  id: string | number,
  data: Record<string, unknown> = {},
  headers: Record<string, string> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.delete(`${endpoint}/${id}`, {
      headers,
      data,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 401) {
      window.location.href = "/login";
    }
    throw axiosError;
  }
};
