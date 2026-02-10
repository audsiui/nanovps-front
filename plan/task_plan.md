# Task Plan: 完成优惠码、赠金码、订单、充值前端页面

## Goal
根据 nanovps-server 后端 API，完成前端优惠码、赠金码、订单、充值相关页面，包括管理员端和用户端。

## Current Phase
Phase 6 - All Complete

## Phases

### Phase 1: 需求分析与后端接口梳理
- [x] 读取后端 promo-codes 控制器和 schema
- [x] 读取后端 gift-codes 控制器和 schema
- [x] 读取后端 orders 控制器和 schema
- [x] 读取后端 recharge 控制器和 schema
- [x] 梳理前端现有页面结构
- [x] 整理 API 接口文档到 findings.md
- [x] 确定需要新增/修改的页面
- **Status:** complete

### Phase 2: 类型定义与 API 请求封装
- [x] 在 lib/types.ts 添加 PromoCode, GiftCode, Order, Recharge 类型
- [x] 在 lib/requests/ 创建 promo-codes.ts API 请求
- [x] 在 lib/requests/ 创建 gift-codes.ts API 请求
- [x] 在 lib/requests/ 创建 orders.ts API 请求
- [x] 在 lib/requests/ 创建 recharge.ts API 请求
- **Status:** complete

### Phase 3: 管理员端页面开发
- [x] 创建 admin/dashboard/promo-codes 页面（优惠码管理）
  - 列表展示
  - 创建优惠码
  - 编辑优惠码
  - 删除优惠码
  - 使用记录查看
- [x] 创建 admin/dashboard/gift-codes 页面（赠金码管理）
  - 列表展示
  - 创建赠金码
  - 编辑赠金码
  - 删除赠金码
  - 使用记录查看
- [x] 创建 admin/dashboard/orders 页面（订单管理）
  - 列表展示
  - 订单详情
- [x] 创建 admin/dashboard/recharges 页面（充值管理）
  - 列表展示
  - 充值详情
- **Status:** complete

### Phase 4: 用户端页面开发
- [x] 修改 dashboard/purchase 页面
  - 集成优惠码验证功能
  - 订单计算预览
  - 创建订单
- [x] 修改 dashboard/finance 页面
  - 集成赠金码使用功能
  - 充值功能
  - 余额展示
- [x] 创建 dashboard/orders 页面（我的订单）
  - 订单列表
  - 订单详情
- [x] 创建 dashboard/recharges 页面（我的充值记录）
  - 充值记录列表
  - 充值详情
- **Status:** complete

### Phase 5: 测试与优化
- [x] 验证所有 API 调用正常
- [x] 验证页面渲染正常
- [x] 验证表单验证
- [x] 验证错误处理
- [x] 运行 build 检查
- **Status:** complete

### Phase 6: 交付
- [x] 更新进度到 progress.md
- [x] 总结完成的功能
- **Status:** complete

## Key Questions
1. 前端是否已有 promo-codes, gift-codes, orders, recharge 的页面？（初步查看：没有，需要新建）
2. 现有 purchase 和 finance 页面是否需要完全重写还是增量修改？（需要查看现有实现）
3. 管理员端是否需要在导航中添加新的菜单项？
4. 是否需要添加路由权限控制？

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 使用现有项目架构 | 遵循 shadcn/ui + Next.js App Router 模式 |
| 新建管理员页面 | 后端已提供完整 admin 接口 |
| 修改现有用户页面 | purchase 和 finance 页面已存在，需要集成新功能 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| 无 | - | - |

## Notes
- 后端使用 ElysiaJS + TypeBox 进行验证
- 优惠码支持固定金额和百分比两种类型
- 优惠码支持 purchase/recharge/both 三种使用场景
- 赠金码直接给用户余额赠金
- 订单创建时需要支持优惠码
- 充值功能基础框架已存在

## Backend API Summary

### 优惠码 (Promo Codes)
**管理员接口:**
- GET `/promo-codes/admin/list` - 获取列表（分页、搜索、状态筛选）
- GET `/promo-codes/admin/detail/:id` - 获取详情
- POST `/promo-codes/admin/create` - 创建
- POST `/promo-codes/admin/update` - 更新
- POST `/promo-codes/admin/delete` - 删除
- GET `/promo-codes/admin/usage-records` - 使用记录

**用户接口:**
- GET `/promo-codes/validate` - 验证优惠码（预览折扣）
- GET `/promo-codes/my-usages` - 我的使用记录

### 赠金码 (Gift Codes)
**管理员接口:**
- GET `/gift-codes/admin/list` - 获取列表
- GET `/gift-codes/admin/detail/:id` - 获取详情
- POST `/gift-codes/admin/create` - 创建
- POST `/gift-codes/admin/update` - 更新
- POST `/gift-codes/admin/delete` - 删除
- GET `/gift-codes/admin/usage-records` - 使用记录

**用户接口:**
- POST `/gift-codes/use` - 使用赠金码
- GET `/gift-codes/my-usages` - 我的使用记录

### 订单 (Orders)
**用户接口:**
- GET `/orders/calculate` - 计算订单金额（预览，支持优惠码）
- POST `/orders/create` - 创建订单（支持优惠码）
- GET `/orders/my-orders` - 我的订单列表
- GET `/orders/detail/:id` - 订单详情

### 充值 (Recharge)
**用户接口:**
- POST `/recharge/create` - 创建充值
- GET `/recharge/my-recharges` - 我的充值记录
- GET `/recharge/detail/:id` - 充值详情
