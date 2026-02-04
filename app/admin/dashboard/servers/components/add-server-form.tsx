'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field';

interface AddServerFormProps {
  onSuccess: () => void;
}

export function AddServerForm({ onSuccess }: AddServerFormProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">基本信息</TabsTrigger>
        <TabsTrigger value="hardware">硬件配置</TabsTrigger>
        <TabsTrigger value="network">网络配置</TabsTrigger>
        <TabsTrigger value="resources">资源分配</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="mt-4">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>宿主机名称</FieldLabel>
              <Input placeholder="例如：HK-Node-01" />
            </Field>
            <Field>
              <FieldLabel>所属区域</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择区域" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hk">香港</SelectItem>
                  <SelectItem value="jp">日本</SelectItem>
                  <SelectItem value="sg">新加坡</SelectItem>
                  <SelectItem value="us">美国</SelectItem>
                  <SelectItem value="de">德国</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel>数据中心</FieldLabel>
            <Input placeholder="例如：HKBN, PCCW, Equinix" />
          </Field>
          <Field>
            <FieldLabel>备注说明</FieldLabel>
            <Input placeholder="可选填" />
          </Field>
          <Separator />
          <Field orientation="horizontal">
            <FieldLabel>
              启用状态
              <FieldDescription>上架后立即启用该宿主机</FieldDescription>
            </FieldLabel>
            <Switch defaultChecked />
          </Field>
        </FieldGroup>
      </TabsContent>

      <TabsContent value="hardware" className="mt-4">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>CPU 型号</FieldLabel>
              <Input placeholder="例如：Intel Xeon E5-2680 v4" />
            </Field>
            <Field>
              <FieldLabel>CPU 核心数</FieldLabel>
              <Input type="number" placeholder="例如：28" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>内存大小 (GB)</FieldLabel>
              <Input type="number" placeholder="例如：128" />
            </Field>
            <Field>
              <FieldLabel>硬盘大小 (GB)</FieldLabel>
              <Input type="number" placeholder="例如：2000" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>硬盘类型</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择硬盘类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssd">SSD</SelectItem>
                  <SelectItem value="nvme">NVMe</SelectItem>
                  <SelectItem value="hdd">HDD</SelectItem>
                  <SelectItem value="raid">RAID 阵列</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>虚拟化类型</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择虚拟化类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kvm">KVM</SelectItem>
                  <SelectItem value="vmware">VMware ESXi</SelectItem>
                  <SelectItem value="xen">Xen</SelectItem>
                  <SelectItem value="hyperv">Hyper-V</SelectItem>
                  <SelectItem value="proxmox">Proxmox VE</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FieldGroup>
      </TabsContent>

      <TabsContent value="network" className="mt-4">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>内网 IP</FieldLabel>
              <Input placeholder="例如：10.0.0.100" />
            </Field>
            <Field>
              <FieldLabel>公网 IP</FieldLabel>
              <Input placeholder="例如：203.0.113.1" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>网关</FieldLabel>
              <Input placeholder="例如：10.0.0.1" />
            </Field>
            <Field>
              <FieldLabel>子网掩码</FieldLabel>
              <Input placeholder="例如：255.255.255.0" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>主 DNS</FieldLabel>
              <Input placeholder="例如：8.8.8.8" />
            </Field>
            <Field>
              <FieldLabel>备用 DNS</FieldLabel>
              <Input placeholder="例如：8.8.4.4" />
            </Field>
          </div>
          <Field>
            <FieldLabel>带宽 (Mbps)</FieldLabel>
            <Input type="number" placeholder="例如：1000" />
          </Field>
        </FieldGroup>
      </TabsContent>

      <TabsContent value="resources" className="mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>最大虚拟机数</FieldLabel>
            <Input type="number" placeholder="例如：50" />
          </Field>
          <Separator />
          <Field>
            <FieldLabel>CPU 超售比例 (%)</FieldLabel>
            <Input type="number" placeholder="例如：200" />
          </Field>
          <Field>
            <FieldLabel>内存超售比例 (%)</FieldLabel>
            <Input type="number" placeholder="例如：150" />
          </Field>
          <Field>
            <FieldLabel>硬盘超售比例 (%)</FieldLabel>
            <Input type="number" placeholder="例如：100" />
          </Field>
          <Separator />
          <Field orientation="horizontal">
            <FieldLabel>
              自动分配
              <FieldDescription>新订单自动在此宿主机上创建实例</FieldDescription>
            </FieldLabel>
            <Switch />
          </Field>
        </FieldGroup>
      </TabsContent>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onSuccess}>
          取消
        </Button>
        <Button onClick={onSuccess}>保存配置</Button>
      </DialogFooter>
    </Tabs>
  );
}
