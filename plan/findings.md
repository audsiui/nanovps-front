# Findings & Research

## Requirements
根据 nanovps-server 后端接口，完成前端对应页面：

1. **优惠码 (Promo Codes)** - 固定金额/百分比折扣，支持购买和充值场景
2. **赠金码 (Gift Codes)** - 直接给用户余额赠金
3. **订单 (Orders)** - VPS实例购买订单，支持优惠码
4. **充值 (Recharge)** - 用户余额充值（基础框架）

## Backend API Details

### 1. 优惠码 (Promo Codes)

**数据模型:**
```typescript
interface PromoCode {
  id: number;
  code: string;                    // 优惠码字符串
  description?: string;            // 描述
  type: 'fixed' | 'percentage';    // 折扣类型
  value: string;                   // 优惠值
  minAmount?: string;              // 最小使用金额
  maxDiscount?: string;            // 最大优惠金额（仅percentage有效）
  usageType: 'purchase' | 'recharge' | 'both'; // 使用场景
  usageLimit?: number;             // 总使用次数限制
  usageCount: number;              // 已使用次数
  perUserLimit: number;            // 每用户限制次数
  startAt?: Date;                  // 生效时间
  endAt?: Date;                    // 过期时间
  isActive: boolean;               // 是否启用
  createdAt: Date;
  updatedAt: Date;
}
```

**管理员 API:**
- `GET /promo-codes/admin/list?page=&pageSize=&keyword=&isActive=`
- `GET /promo-codes/admin/detail/:id`
- `POST /promo-codes/admin/create` - Body: PromoCode 创建数据
- `POST /promo-codes/admin/update` - Body: { id, ...updateData }
- `POST /promo-codes/admin/delete` - Body: { id }
- `GET /promo-codes/admin/usage-records?promoCodeId=&page=&pageSize=`

**用户 API:**
- `GET /promo-codes/validate?code=&amount=&usageType=`
  - 验证优惠码有效性并计算折扣金额
  - usageType: 'purchase' | 'recharge'
- `GET /promo-codes/my-usages?page=&pageSize=`

### 2. 赠金码 (Gift Codes)

**数据模型:**
```typescript
interface GiftCode {
  id: number;
  code: string;              // 赠金码字符串
  description?: string;      // 描述
  amount: string;            // 赠金金额
  usageLimit?: number;       // 总使用次数限制
  usageCount: number;        // 已使用次数
  perUserLimit: number;      // 每用户限制次数
  startAt?: Date;            // 生效时间
  endAt?: Date;              // 过期时间
  isActive: boolean;         // 是否启用
  createdAt: Date;
  updatedAt: Date;
}
```

**管理员 API:**
- `GET /gift-codes/admin/list?page=&pageSize=&keyword=&isActive=`
- `GET /gift-codes/admin/detail/:id`
- `POST /gift-codes/admin/create` - Body: GiftCode 创建数据
- `POST /gift-codes/admin/update` - Body: { id, ...updateData }
- `POST /gift-codes/admin/delete` - Body: { id }
- `GET /gift-codes/admin/usage-records?giftCodeId=&page=&pageSize=`

**用户 API:**
- `POST /gift-codes/use` - Body: { code }
  - 用户使用赠金码，领取余额赠金
- `GET /gift-codes/my-usages?page=&pageSize=`

### 3. 订单 (Orders)

**数据模型:**
```typescript
interface Order {
  id: number;
  orderNo: string;           // 订单号
  userId: number;
  instanceId?: number;       // 实例ID（续费/升级时）
  nodePlanId: number;        // 节点套餐ID
  type: 'new' | 'renew' | 'upgrade';
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  billingCycle: string;      // monthly/quarterly/halfYearly/yearly
  durationMonths: number;    // 购买月数
  originalPrice: string;     // 原价
  discountAmount: string;    // 优惠金额
  finalPrice: string;        // 最终支付金额
  paymentChannel?: 'alipay' | 'wechat' | 'stripe' | 'paypal' | 'balance';
  paidAt?: Date;
  paymentTradeNo?: string;   // 第三方流水号
  periodStartAt?: Date;      // 服务开始时间
  periodEndAt?: Date;        // 服务结束时间
  remark?: string;           // 备注/失败原因
  createdAt: Date;
  updatedAt: Date;
}
```

**用户 API:**
- `GET /orders/calculate?nodePlanId=&billingCycle=&durationMonths=&promoCode=`
  - 预览订单金额，支持优惠码验证
- `POST /orders/create` - Body: { nodePlanId, billingCycle, durationMonths, promoCode? }
  - 创建实例购买订单
- `GET /orders/my-orders?page=&pageSize=&status=`
- `GET /orders/detail/:id`

### 4. 充值 (Recharge)

**数据模型:**
```typescript
interface Recharge {
  id: number;
  rechargeNo: string;        // 充值单号
  userId: number;
  amount: string;            // 充值金额
  bonusAmount: string;       // 赠送金额（优惠码抵扣或其他赠送）
  finalAmount: string;       // 实际到账金额
  status: 'pending' | 'paid' | 'cancelled' | 'failed';
  channel?: 'alipay' | 'wechat' | 'stripe' | 'paypal';
  paidAt?: Date;
  tradeNo?: string;          // 第三方流水号
  createdAt: Date;
  updatedAt: Date;
}
```

**用户 API:**
- `POST /recharge/create` - Body: { amount: number, channel: string }
  - channel: 'alipay' | 'wechat' | 'stripe' | 'paypal'
- `GET /recharge/my-recharges?page=&pageSize=&status=`
- `GET /recharge/detail/:id`

## Frontend Analysis

### 现有页面结构
```
app/
├── admin/dashboard/
│   ├── dictionaries/     # 字典管理（已存在）
│   ├── plans/           # 套餐管理（已存在）
│   ├── servers/         # 服务器管理（已存在）
│   ├── users/           # 用户管理（已存在）
│   ├── layout.tsx       # 管理员布局
│   └── page.tsx         # 管理员首页
├── dashboard/
│   ├── finance/         # 财务管理（需修改）
│   ├── purchase/        # 购买页面（需修改）
│   ├── servers/         # 我的服务器（已存在）
│   ├── tickets/         # 工单（已存在）
│   ├── layout.tsx       # 用户布局
│   └── page.tsx         # 用户首页
├── auth/                # 登录页
├── layout.tsx           # 根布局
└── page.tsx             # 首页
```

### 需要新增的页面
1. **管理员端:**
   - `app/admin/dashboard/promo-codes/page.tsx` - 优惠码管理
   - `app/admin/dashboard/gift-codes/page.tsx` - 赠金码管理
   - `app/admin/dashboard/orders/page.tsx` - 订单管理
   - `app/admin/dashboard/recharges/page.tsx` - 充值管理

2. **用户端:**
   - `app/dashboard/orders/page.tsx` - 我的订单（新增）
   - `app/dashboard/recharges/page.tsx` - 我的充值记录（新增）
   - 修改 `app/dashboard/purchase/page.tsx` - 集成优惠码
   - 修改 `app/dashboard/finance/page.tsx` - 集成赠金码和充值

### 需要新增/修改的文件

#### 1. 类型定义 (lib/types.ts)
- PromoCode 类型
- GiftCode 类型
- Order 类型
- Recharge 类型
- 相关枚举类型

#### 2. API 请求 (lib/requests/)
- `promo-codes.ts` - 优惠码 API
- `gift-codes.ts` - 赠金码 API
- `orders.ts` - 订单 API
- `recharge.ts` - 充值 API

#### 3. 现有文件检查
需要查看以下文件来决定如何修改：
- `app/dashboard/purchase/page.tsx`
- `app/dashboard/finance/page.tsx`
- `app/admin/dashboard/layout.tsx` (添加菜单)
- `app/dashboard/layout.tsx` (添加菜单)

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| 使用 shadcn/ui Table 组件 | 项目已有 Table 组件，保持风格一致 |
| 使用 React Hook Form + Zod | 项目已有表单验证模式 |
| 使用 TanStack Query | 项目已有数据获取模式 |
| 管理员和用户页面分离 | 权限控制清晰，符合现有架构 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| 后端返回金额字段为字符串 | 前端需要处理 Decimal 类型转换 |
| 日期字段为 Date 对象 | 需要处理序列化/反序列化 |

## Resources
- 后端项目: `C:\Users\fhmy\Documents\workspace\study\nanovps\nanovps-server`
- 前端项目: `C:\Users\fhmy\Documents\workspace\study\nanovps\nanovps-front`
- 计划文件: `C:\Users\fhmy\Documents\workspace\study\nanovps\nanovps-front\plan\`
