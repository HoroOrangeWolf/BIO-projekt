import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true,
});

export const fetchCsrfToken = async () => {
  try {
    const response = await api.get('auth/csrf-token/');
    return response.data.csrfToken;
  } catch (error) {
    throw error;
  }
};

const initializeCsrfToken = async () => {
  try {
    const csrfToken = await fetchCsrfToken();
    if (csrfToken) {
      api.defaults.headers.common['X-CSRFToken'] = csrfToken;
    }
  } catch (error) {
    throw error;
  }
};

initializeCsrfToken();

api.interceptors.request.use((config) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (['post', 'put', 'patch', 'delete'].includes(config?.method?.toLowerCase())) {
    config.headers['X-CSRFToken'] = api.defaults.headers.common['X-CSRFToken'];
  }
  return config;
}, (error) => Promise.reject(error));

export const login = async (username: string, password: string, otp: string) => {
  const response = await api.post('auth/login/', { username, password, otp });
  await initializeCsrfToken();
  return response;
};

export const registerUser = async (userData: any) => api.post('auth/register/', userData);
export const logout = async () => api.post('auth/logout/');
export const setupTOTP = async () => api.get('auth/setup-totp/');
export const confirmTOTP = async (token: string) => api.post('auth/setup-totp/', { token });
export const getCurrentUser = async () => api.get('auth/current-user/');
export const getUsers = async (page: number, pageSize: number) => api.get(`admin/user/?page_size=${pageSize}?page=${page}`);
export const postUsers = async (data: any) => api.post('admin/user/', data);
export const patchUsers = async (id: string, data: any) => api.patch(`admin/user/${id}/`, data);
export const getGroups = async (page: number, pageSize: number) => api.get(`admin/group/?page_size=${pageSize}?page=${page}`);
export const getAllGroups = async () => api.get('admin/group/');
export const postGroups = async (data: any) => api.post('admin/group/', data);
export const patchGroups = async (id: string, data: any) => api.patch(`admin/group/${id}/`, data);
export const deleteGroups = async (id: string) => api.delete(`admin/group/${id}/`);
export const getAllPermissions = async () => api.get('admin/permission/');
export const getPermissions = async (page: number, pageSize: number) => api.get(`admin/permission/?page=${page}&page_size=${pageSize}`);

export default api;
