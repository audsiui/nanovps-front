'use client';

import { Globe, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { RegionDictionary } from './components/RegionDictionary';
import { ImageDictionary } from './components/ImageDictionary';

export default function DictionaryManagementPage() {
  return (
    <div className="space-y-6">
      {/* Tab 切换 */}
      <Tabs defaultValue="regions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-fit">
          <TabsTrigger value="regions" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">区域字典</span>
            <span className="sm:hidden">区域</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <HardDrive className="h-4 w-4" />
            <span className="hidden sm:inline">镜像字典</span>
            <span className="sm:hidden">镜像</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-5 w-5" />
                区域管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RegionDictionary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                镜像管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageDictionary />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
