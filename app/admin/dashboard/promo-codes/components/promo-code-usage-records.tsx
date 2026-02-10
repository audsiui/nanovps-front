'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { usePromoCodeUsageRecords } from '@/lib/requests/promo-codes';

interface PromoCodeUsageRecordsProps {
  promoCodeId: number;
}

export function PromoCodeUsageRecords({ promoCodeId }: PromoCodeUsageRecordsProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = usePromoCodeUsageRecords({
    promoCodeId,
    page,
    pageSize,
  });

  const usages = data?.list || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>原金额</TableHead>
              <TableHead>优惠金额</TableHead>
              <TableHead>实付金额</TableHead>
              <TableHead>使用时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  暂无使用记录
                </TableCell>
              </TableRow>
            ) : (
              usages.map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell>{usage.user?.email || `用户#${usage.userId}`}</TableCell>
                  <TableCell>¥{usage.originalAmount}</TableCell>
                  <TableCell className="text-green-600">-¥{usage.discountAmount}</TableCell>
                  <TableCell>¥{usage.finalAmount}</TableCell>
                  <TableCell>{formatDate(usage.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
