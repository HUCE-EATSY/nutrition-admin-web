let memoryAdminToken: string | null = sessionStorage.getItem('admin_token');

export const adminTokenStore = {
  getToken: (): string | null => {
    return memoryAdminToken;
  },
  
  setToken: (token: string | null): void => {
    memoryAdminToken = token;
    if (token) {
      sessionStorage.setItem('admin_token', token);
    } else {
      sessionStorage.removeItem('admin_token');
    }
  },
  
  clearToken: (): void => {
    memoryAdminToken = null;
    sessionStorage.removeItem('admin_token');
  }
};
