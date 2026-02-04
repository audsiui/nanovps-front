'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Plus, Pencil, Trash2, HardDrive, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { toast } from 'sonner';
import type { Image } from '@/lib/types';
import {
  useImageList,
  useCreateImage,
  useUpdateImage,
  useDeleteImage,
  useToggleImageStatus,
} from '@/lib/requests/images';

// Zod 验证Schema
const imageSchema = z.object({
  name: z.string().min(1, '请输入镜像名称').max(64, '镜像名称最多64个字符'),
  family: z.string().min(1, '请输入镜像家族').max(32, '镜像家族最多32个字符'),
  description: z.string().max(200, '描述最多200个字符'),
  imageRef: z.string().min(1, '请输入镜像引用').max(200, '镜像引用最多200个字符'),
  isActive: z.boolean(),
});

type ImageFormData = z.infer<typeof imageSchema>;

export function ImageDictionary() {
  // 查询参数
  const [query] = useState({
    page: 1,
    pageSize: 100,
    isActive: undefined as boolean | undefined,
  });

  // 对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);

  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  // API hooks
  const { data, isLoading, refetch } = useImageList(query);
  const createImage = useCreateImage();
  const updateImage = useUpdateImage();
  const deleteImage = useDeleteImage();
  const toggleStatus = useToggleImageStatus();

  // 获取镜像列表
  const images = data?.list || [];

  // React Hook Form
  const form = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      name: '',
      family: '',
      description: '',
      imageRef: '',
      isActive: true,
    },
  });

  // 打开新增对话框
  const handleAdd = () => {
    setEditingImage(null);
    form.reset({
      name: '',
      family: '',
      description: '',
      imageRef: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (image: Image) => {
    setEditingImage(image);
    form.reset({
      name: image.name,
      family: image.family,
      description: image.description || '',
      imageRef: image.imageRef,
      isActive: image.isActive,
    });
    setIsDialogOpen(true);
  };

  // 打开删除确认对话框
  const openDeleteDialog = (id: number) => {
    setDeletingImageId(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!deletingImageId) return;
    try {
      await deleteImage.mutateAsync({ id: deletingImageId });
      toast.success('删除成功');
      setDeleteDialogOpen(false);
      setDeletingImageId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败');
    }
  };

  // 切换启用状态
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await toggleStatus.mutateAsync({ id, isActive: !isActive });
      toast.success('状态更新成功');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '状态更新失败');
    }
  };

  // 保存表单
  const onSubmit = async (data: ImageFormData) => {
    try {
      if (editingImage) {
        // 编辑模式
        await updateImage.mutateAsync({
          id: editingImage.id,
          name: data.name,
          family: data.family,
          description: data.description,
          imageRef: data.imageRef,
          isActive: data.isActive,
        });
        toast.success('更新成功');
      } else {
        // 新增模式
        await createImage.mutateAsync({
          name: data.name,
          family: data.family,
          description: data.description,
          imageRef: data.imageRef,
          isActive: data.isActive,
        });
        toast.success('添加成功');
      }
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败');
    }
  };

  // 是否正在提交
  const isSubmitting = createImage.isPending || updateImage.isPending;

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          新增镜像
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>镜像名称</TableHead>
            <TableHead>家族</TableHead>
            <TableHead className="max-w-50">镜像引用</TableHead>
            <TableHead className="w-25">状态</TableHead>
            <TableHead className="w-37.5 text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                加载中...
              </TableCell>
            </TableRow>
          ) : images.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            images.map((image) => (
              <TableRow key={image.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-0.5">
                    <span>{image.name}</span>
                    {image.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-50">
                        {image.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {image.family}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-xs truncate block max-w-50">
                    {image.imageRef}
                  </code>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={image.isActive}
                    onCheckedChange={() =>
                      handleToggleActive(image.id, image.isActive)
                    }
                    disabled={toggleStatus.isPending}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(image)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(image.id)}
                      disabled={deleteImage.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 新增/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? '编辑镜像' : '新增镜像'}
            </DialogTitle>
            <DialogDescription>
              {editingImage
                ? '修改镜像信息'
                : '添加新的系统镜像'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="py-4">
              <Field data-invalid={!!form.formState.errors.name}>
                <FieldLabel htmlFor="name">
                  镜像名称 <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  placeholder="例如：Ubuntu 22.04 LTS"
                  {...form.register('name')}
                  aria-invalid={!!form.formState.errors.name}
                />
                {form.formState.errors.name && (
                  <FieldError errors={[form.formState.errors.name]} />
                )}
              </Field>

              <Field data-invalid={!!form.formState.errors.family}>
                <FieldLabel htmlFor="family">
                  镜像家族 <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="family"
                  placeholder="例如：ubuntu, debian, centos"
                  {...form.register('family', {
                    onChange: (e) => {
                      form.setValue(
                        'family',
                        e.target.value.toLowerCase().replace(/\s/g, '')
                      );
                    },
                  })}
                  aria-invalid={!!form.formState.errors.family}
                />
                <FieldDescription>
                  用于分类和筛选，如 ubuntu、debian、centos
                </FieldDescription>
                {form.formState.errors.family && (
                  <FieldError errors={[form.formState.errors.family]} />
                )}
              </Field>

              <Field data-invalid={!!form.formState.errors.imageRef}>
                <FieldLabel htmlFor="imageRef">
                  镜像引用 <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="imageRef"
                  placeholder="例如：docker.io/library/ubuntu:22.04"
                  {...form.register('imageRef')}
                  aria-invalid={!!form.formState.errors.imageRef}
                />
                <FieldDescription>
                  镜像仓库完整地址，用于拉取镜像
                </FieldDescription>
                {form.formState.errors.imageRef && (
                  <FieldError errors={[form.formState.errors.imageRef]} />
                )}
              </Field>

              <Field data-invalid={!!form.formState.errors.description}>
                <FieldLabel htmlFor="description">描述</FieldLabel>
                <Input
                  id="description"
                  placeholder="镜像描述信息"
                  {...form.register('description')}
                  aria-invalid={!!form.formState.errors.description}
                />
                {form.formState.errors.description && (
                  <FieldError errors={[form.formState.errors.description]} />
                )}
              </Field>

              <Field orientation="horizontal">
                <FieldLabel htmlFor="isActive">启用该镜像</FieldLabel>
                <Switch
                  id="isActive"
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) =>
                    form.setValue('isActive', checked)
                  }
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingImage ? '保存修改' : '确认添加'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个镜像吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeletingImageId(null)}
              disabled={deleteImage.isPending}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteImage.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteImage.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
