'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, RotateCw, RefreshCw } from 'lucide-react';
import { useAvailableImages } from '@/lib/requests/images';
import { useReinstallInstance } from '@/lib/requests/instances';
import type { InstanceDetail } from '@/lib/types';
import { toast } from 'sonner';

interface ReinstallDialogProps {
  instance: InstanceDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReinstallDialog({
  instance,
  open,
  onOpenChange,
}: ReinstallDialogProps) {
  const [selectedImageId, setSelectedImageId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: imagesData, isLoading: isLoadingImages } = useAvailableImages();
  const reinstallMutation = useReinstallInstance();

  const handleReinstall = async () => {
    if (!selectedImageId) {
      toast.error('请选择要重装的镜像');
      return;
    }

    if (password) {
      if (password.length < 6 || password.length > 32) {
        toast.error('密码长度必须在 6-32 位之间');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('两次输入的密码不一致');
        return;
      }
    }

    try {
      await reinstallMutation.mutateAsync({
        id: instance.id,
        imageId: Number(selectedImageId),
        password: password || undefined,
      });
      toast.success('实例重装成功');
      onOpenChange(false);
      setPassword('');
      setConfirmPassword('');
      setSelectedImageId('');
    } catch (error: any) {
      toast.error(error.message || '重装失败');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPassword('');
      setConfirmPassword('');
      setSelectedImageId('');
    }
    onOpenChange(isOpen);
  };

  const currentImageId = instance.image?.id?.toString() || '';

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RotateCw className="h-5 w-5" />
            重装实例
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block space-y-2">
              <span className="block">
                您即将重装实例 <strong>{instance.hostname || `实例 ${instance.id}`}</strong>
              </span>
              <span className="block text-yellow-600 dark:text-yellow-400">
                重装将删除现有数据，此操作不可恢复！
              </span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* 镜像选择 */}
          <div className="space-y-2">
            <Label>选择镜像</Label>
            {isLoadingImages ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>加载中...</span>
              </div>
            ) : (
              <Select
                value={selectedImageId || currentImageId}
                onValueChange={setSelectedImageId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择镜像" />
                </SelectTrigger>
                <SelectContent>
                  {imagesData?.list?.map((image) => (
                    <SelectItem key={image.id} value={image.id.toString()}>
                      {image.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* 密码输入 */}
          <div className="space-y-2">
            <Label htmlFor="password">新密码 (可选)</Label>
            <Input
              id="password"
              type="password"
              placeholder="留空则自动生成"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
                </SelectItem>
                <SelectItem value="reset-password">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    仅重置密码
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 镜像选择 */}
          {mode === 'reinstall' && (
            <div className="space-y-2">
              <Label>选择镜像</Label>
              {isLoadingImages ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>加载中...</span>
                </div>
              ) : (
                <Select
                  value={selectedImageId || currentImageId}
                  onValueChange={setSelectedImageId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择镜像" />
                  </SelectTrigger>
                  <SelectContent>
                    {imagesData?.list?.map((image) => (
                      <SelectItem key={image.id} value={image.id.toString()}>
                        {image.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* 密码输入 */}
          <div className="space-y-2">
            <Label htmlFor="password">
              新密码 {mode === 'reinstall' && '(可选)'}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={mode === 'reinstall' ? '留空则自动生成' : '6-32位密码'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 确认密码 */}
          {password && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button
            onClick={handleReinstall}
            disabled={reinstallMutation.isPending}
            variant="destructive"
          >
            {reinstallMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            确认重装
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
