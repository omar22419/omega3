import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api-v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Request: attach Bearer token ────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response: handle 401 globally ───────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("force-logout"));
    }
    return Promise.reject(error);
  }
);

// ─── Typed helpers ────────────────────────────────────────────────────────────
export async function get<T>(url: string): Promise<T> {
  const res = await apiClient.get<T>(url);
  return res.data;
}

export async function post<T>(url: string, data: unknown): Promise<T> {
  const res = await apiClient.post<T>(url, data);
  return res.data;
}

export async function put<T>(url: string, data: unknown): Promise<T> {
  const res = await apiClient.put<T>(url, data);
  return res.data;
}

export async function patch<T>(url: string, data: unknown): Promise<T> {
  const res = await apiClient.patch<T>(url, data);
  return res.data;
}

export async function del<T>(url: string): Promise<T> {
  const res = await apiClient.delete<T>(url);
  return res.data;
}
