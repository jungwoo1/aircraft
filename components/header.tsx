"use client"

import { Bell } from "lucide-react"
import { Button } from "./ui/button"

export function Header() {
  return (
    <div className="w-full min-h-[58px] px-7 py-[10.5px] bg-white border-b border-[#E5E7EB] flex justify-end items-center">
      <div className="flex items-center gap-6">
        {/* 알림 아이콘 */}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full border border-[#6A7282]"
        >
          <Bell className="h-4 w-4 text-[#6A7282]" />
        </Button>
        
        {/* 사용자 아바타 */}
        <div className="w-8 h-8 rounded-full bg-[#6A7282] border border-[#D1D5DC] flex items-center justify-center">
          <span className="text-white text-xs font-medium">J</span>
        </div>
      </div>
    </div>
  )
}