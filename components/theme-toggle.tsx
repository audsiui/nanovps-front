"use client"

import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 等待客户端挂载，避免水合不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // 渲染一个占位符，保持布局稳定，防止闪烁
    return <div className="w-30 h-9 bg-muted/50 rounded-lg animate-pulse" />
  }

  return (
    <Tabs defaultValue={theme} onValueChange={setTheme}>
      <TabsList className="grid w-full grid-cols-3 h-9 p-1 bg-muted/80 backdrop-blur-sm">
        <TabsTrigger value="light" className="h-7 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-100" />
          <span className="sr-only">Light</span>
        </TabsTrigger>
        <TabsTrigger value="dark" className="h-7 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
          <Moon className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all light:-rotate-90 light:scale-0" />
          <span className="sr-only">Dark</span>
        </TabsTrigger>
        <TabsTrigger value="system" className="h-7 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
          <Laptop className="h-[1.1rem] w-[1.1rem]" />
          <span className="sr-only">System</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}