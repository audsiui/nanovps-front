/**
 * 用户类型定义
 * 对应后端 users 表结构
 */

/** 用户状态枚举 */
export type UserStatus = 0 | 1 | 2;

/** 用户角色 */
export type UserRole = 'user' | 'admin';

/** 用户对象 */
export interface User {
  /** 用户唯一标识 */
  id: number;
  /** 邮箱地址 */
  email: string;
  /** 密码哈希（前端不显示） */
  passwordHash?: string;
  /** 账户余额 */
  balance: string;
  /** 结算货币 */
  currency: string;
  /** 用户角色 */
  role: UserRole;
  /** 用户状态: 0=未验证, 1=正常, 2=封禁 */
  status: UserStatus;
  /** API访问密钥 */
  apiKey?: string | null;
  /** 双因素认证密钥（前端不显示） */
  twoFactorAuth?: string | null;
  /** 上次登录IP地址 */
  lastLoginIp?: string | null;
  /** 记录创建时间 */
  createdAt: string;
  /** 记录最后更新时间 */
  updatedAt: string;
}

/** 用户状态映射 */
export const userStatusMap: Record<UserStatus, { label: string; color: string }> = {
  0: { label: '未验证', color: 'bg-yellow-500' },
  1: { label: '正常', color: 'bg-green-500' },
  2: { label: '封禁', color: 'bg-red-500' },
};

/** 用户角色映射 */
export const userRoleMap: Record<UserRole, { label: string; badge: string }> = {
  user: { label: '普通用户', badge: 'bg-blue-500/10 text-blue-600' },
  admin: { label: '管理员', badge: 'bg-purple-500/10 text-purple-600' },
};
