export const promoCodeTypeOptions = [
  { value: 'fixed', label: '固定金额', description: '直接减免固定金额' },
  { value: 'percentage', label: '百分比', description: '按百分比折扣，可设置最大优惠金额' },
] as const;

export const usageTypeOptions = [
  { value: 'purchase', label: '仅购买', description: '仅限购买实例时使用' },
  { value: 'recharge', label: '仅充值', description: '仅限充值时使用' },
  { value: 'both', label: '两者均可', description: '购买和充值均可使用' },
] as const;

export const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '启用' },
  { value: 'inactive', label: '禁用' },
] as const;
