// Token 管理工具

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  EXPIRES_AT: 'tokenExpiresAt',
  USER: 'user',
} as const;

// 获取 access token
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

// 获取 refresh token
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

// 获取 token 过期时间
export const getTokenExpiresAt = (): number | null => {
  if (typeof window === 'undefined') return null;
  const expiresAt = localStorage.getItem(TOKEN_KEYS.EXPIRES_AT);
  return expiresAt ? parseInt(expiresAt, 10) : null;
};

// 保存 token 信息
export const saveTokens = ({
  accessToken,
  refreshToken,
  expiresIn,
}: {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}) => {
  if (typeof window === 'undefined') return;

  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_KEYS.EXPIRES_AT, expiresAt.toString());

  if (refreshToken) {
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

// 清除所有 token
export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.EXPIRES_AT);
  localStorage.removeItem(TOKEN_KEYS.USER);
};

// 检查 token 是否即将过期（默认提前 5 分钟）
export const isTokenExpiringSoon = (bufferMinutes = 5): boolean => {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return true;

  const bufferMs = bufferMinutes * 60 * 1000;
  return Date.now() > expiresAt - bufferMs;
};

// 检查 token 是否已过期
export const isTokenExpired = (): boolean => {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return true;
  return Date.now() > expiresAt;
};
