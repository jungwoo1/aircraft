"use client"

import { useAppContext } from "./providers"
import { cn } from "../lib/utils"
import { LayoutDashboard, Calendar, Plane, Settings, Cpu, LandPlot, Menu, Grid2X2 } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, activeAssetType, setActiveAssetType } = useAppContext()

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5 text-[#6A7282]" />,
      href: "#",
      type: null,
    },
    {
      label: "Calendar",
      icon: <Calendar className="h-5 w-5 text-[#6A7282]" />,
      href: "#",
      type: null,
    },
  ]

  const assetItems = [
    {
      label: "Aircraft",
      icon: <Plane className="h-5 w-5" />,
      href: "#",
      type: "Aircraft" as const,
    },
    {
      label: "Engine",
      icon: <Cpu className="h-5 w-5 text-[#6A7282]" />,
      href: "#",
      type: "Engine" as const,
    },
    {
      label: "APU",
      icon: (
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="w-[17.5px] h-[12.5px] bg-[#6A7282]"></div>
        </div>
      ),
      href: "#",
      type: "APU" as const,
    },
    {
      label: "Landing Gear",
      icon: <LandPlot className="h-5 w-5 text-[#6A7282]" />,
      href: "#",
      type: "Landing Gear" as const,
    },
  ]

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div
      className={cn(
        "border-r bg-white transition-all duration-300 flex flex-col h-full",
        sidebarCollapsed ? "w-16" : "w-[200px]",
      )}
      data-mode="open"
      style={{
        boxShadow: "1px 0px 8px rgba(184, 188, 200, 0.32)",
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        borderRight: "1px #F3F4F6 solid",
        paddingBottom: "24px",
      }}
    >
      <div className="flex flex-col justify-start items-start gap-2">
        {/* 로고 - 사이드바 상태에 따라 다른 로고 사용 */}
        <div className="w-full h-[58px] border-b border-[#E5E7EB] flex justify-center items-center">
          <Link href="/" className="flex items-center justify-center">
            {sidebarCollapsed ? (
              <div className="w-[18px] h-[20px] flex items-center justify-center">
                <Image
                  src="/vector.svg"
                  alt="Airstream Logo"
                  width={18}
                  height={20}
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-[123.5px] h-[39px] flex items-center justify-center">
                <Image
                  src="/g8.svg"
                  alt="Airstream Logo"
                  width={123.5}
                  height={39}
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </Link>
        </div>

        {/* 사이드바 토글 버튼 */}
        <div className="w-full h-[52px] border-b border-[#E5E7EB] flex justify-end items-center px-3 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            data-status="default"
            data-style="grayscale"
          >
            {sidebarCollapsed ? (
              <Grid2X2 className="h-5 w-5 text-[#101828]" />
            ) : (
              <Menu className="h-5 w-5 text-[#101828]" />
            )}
          </Button>
        </div>

        {/* 메뉴 항목 */}
        <div className="w-full flex-1 flex flex-col">
          <div className="p-2">
            {/* 일반 메뉴 항목 */}
            {navItems.map((item) => (
              <div
                key={item.label}
                className="h-10 px-3 py-2 flex items-center gap-4 rounded-md hover:bg-gray-100"
                data-mode="open"
                data-status="default"
                data-variant={item.label.toLowerCase()}
              >
                {item.icon}
                {!sidebarCollapsed && <span className="text-[#6A7282] font-medium text-base">{item.label}</span>}
              </div>
            ))}

            {/* Asset 섹션 */}
            {!sidebarCollapsed && (
              <div className="h-11 px-3 py-3 flex items-center gap-3 mt-2" data-mode="open">
                <span className="text-[#D1D5DC] text-xs font-medium">Asset</span>
                <div className="flex-1 h-[1px] bg-[#E5E7EB]"></div>
              </div>
            )}

            {/* Asset 메뉴 항목 */}
            {assetItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "h-10 px-3 py-2 flex items-center gap-4 rounded-md hover:bg-gray-100",
                  item.type === activeAssetType && "bg-[#E5E7EB]",
                )}
                data-mode="open"
                data-status={item.type === activeAssetType ? "active" : "default"}
                data-variant={item.label.toLowerCase()}
                onClick={() => setActiveAssetType(item.type)}
              >
                {item.type === activeAssetType ? <div className="w-5 h-5 text-[#615FFF]">{item.icon}</div> : item.icon}
                {!sidebarCollapsed && (
                  <span
                    className={cn(
                      "font-medium text-base",
                      item.type === activeAssetType ? "text-[#615FFF] font-semibold" : "text-[#6A7282]",
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 설정 버튼 */}
      <div className="p-2">
        <div
          className="h-10 px-3 py-2 flex items-center gap-4 rounded-md hover:bg-gray-100"
          data-mode="open"
          data-status="default"
          data-variant="setting"
        >
          <Settings className="h-5 w-5 text-[#6A7282]" />
          {!sidebarCollapsed && <span className="text-[#6A7282] font-medium text-base">Setting</span>}
        </div>
      </div>
    </div>
  )
}