"use client"

import type React from "react"

import { useAppContext } from "./providers"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Search, ChevronDown, Plus, Trash2, Grid2X2, Table } from "lucide-react"
import { DataTable } from "./data-table"
import { useState } from "react"
import { DetailsPanel } from "./details-panel"

export function MainContent() {
  const { 
    activeAssetType, 
    setDetailsOpen, 
    detailsOpen,
    isAddingAsset, 
    setIsAddingAsset, 
    addAsset,
    selectedAsset,
    setSelectedAsset,
    manageOpen,
    setManageOpen 
  } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  // 검색 기능 구현
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // 실제 검색 로직 구현 (예시)
    if (value.trim() === "") {
      setFilteredData([])
    } else {
      // 여기서는 간단히 시리얼 번호로 필터링하는 예시를 보여줍니다
      // 실제 구현에서는 데이터 소스에 따라 필터링 로직을 조정해야 합니다
      const filtered = Array.from({ length: 10 }).filter((_, i) => `722910`.includes(value))
      setFilteredData(filtered)
    }
  }

  const handleAddNewClick = () => {
    setSelectedAsset(null)      // 새 자산이므로 선택된 자산 초기화
    setIsAddingAsset(true)      // 새 자산 모드
    setDetailsOpen(true)        // DetailsPanel 열기
  }

  const handleCloseModal = () => {
    setIsAddingAsset(false)
    setDetailsOpen(false)
    setSelectedAsset(null)
    setManageOpen(false)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* 헤더 섹션 */}
      <div 
        className="h-[52px] border-b border-[#E5E7EB] flex items-center justify-between bg-white flex-shrink-0"
        style={{
          paddingTop: "5.5px",
          paddingBottom: "6.5px",
          paddingLeft: "28px",
          paddingRight: "28px"
        }}
      >
        <div className="flex items-center gap-3">
          {/* 뷰 모드 선택기 */}
          <div 
            className="h-9 p-1 bg-[#F3F4F6] rounded-lg flex items-center gap-1"
            style={{ padding: "4px" }}
          >
            <div 
              className={`p-0.5 rounded-md overflow-hidden flex items-center gap-2.5 cursor-pointer ${
                viewMode === "table" 
                  ? "bg-white shadow-[0px_8px_8px_rgba(17,24,39,0.03)]" 
                  : ""
              }`}
              onClick={() => setViewMode("table")}
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                <Table className="w-3.5 h-3 text-[#101828]" />
              </div>
            </div>
            <div 
              className={`p-0.5 rounded-md overflow-hidden flex items-center gap-2.5 cursor-pointer ${
                viewMode === "card" 
                  ? "bg-white shadow-[0px_8px_8px_rgba(17,24,39,0.03)]" 
                  : ""
              }`}
              onClick={() => setViewMode("card")}
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                <Grid2X2 className="w-3.5 h-3.5 text-[#101828]" />
              </div>
            </div>
          </div>

          {/* 검색창 */}
          <div 
            className="w-80 h-9 px-3 py-2 bg-[#F3F4F6] rounded-[20px] border border-[#FAFAFA] flex items-center"
            style={{
              boxShadow: '0px -2px 4px rgba(255, 255, 255, 0.35) inset',
              outline: '1px #FAFAFA solid',
              outlineOffset: '-1px'
            }}
          >
            <div className="pt-0.5 pr-3 flex flex-col">
              <Search className="w-4 h-4 text-[#6A7282]" />
            </div>
            <div className="flex-1 py-1 overflow-hidden flex flex-col">
              <input
                type="search"
                placeholder="Search for serial number, model"
                className="w-full bg-transparent border-none outline-none text-sm text-[#6A7282] placeholder:text-[#6A7282] font-normal leading-5"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div 
            className="min-w-6 px-4 py-2 bg-white rounded-lg border border-[#D1D5DC] flex items-center gap-2 cursor-pointer hover:bg-gray-50"
            style={{ outline: '1px #D1D5DC solid', outlineOffset: '-1px' }}
          >
            <div className="flex flex-col">
              <Trash2 className="w-3.5 h-3.5 text-[#101828]" />
            </div>
            <div className="text-center text-[#101828] text-sm font-semibold leading-5">
              Delete
            </div>
          </div>
          <div 
            onClick={handleAddNewClick}
            className="w-[132px] h-9 min-w-[110px] min-h-9 px-3 py-2 bg-[#4F39F6] rounded-lg border border-[#372AAC] flex items-center gap-3 cursor-pointer hover:bg-[#372AAC]"
            style={{
              boxShadow: '0px 2px 2px -2px rgba(17, 24, 39, 0.06)',
              outline: '1px #372AAC solid',
              outlineOffset: '-1px'
            }}
          >
            <div className="h-full flex items-center gap-2">
              <div className="flex flex-col items-center">
                <Plus className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex items-center">
                <div className="text-center text-white text-sm font-semibold leading-5">
                  Add New
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* 컨트롤 섹션 */}
        <div className="px-7 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 px-1.5 bg-[#F3F4F6] border border-[#E5E7EB] rounded text-sm flex items-center">
                <span className="text-[#101828] font-normal">Total</span>
              </div>
              <span className="text-[rgba(0,0,0,0.65)] text-sm font-light">32</span>
            </div>
            <div className="flex items-center gap-3 bg-[#F3F4F6] px-3 py-2 rounded-lg shadow-[0px_1px_2px_rgba(255,255,255,0.25)_inset]">
              <span className="text-sm text-[#111827] font-normal">Last created</span>
              <ChevronDown className="h-4 w-4 text-[#101828]" />
            </div>
          </div>
        </div>

        {/* 데이터 테이블 영역 */}
        <div className="flex-1 h-full overflow-hidden px-7">
          <DataTable assetType={activeAssetType} searchTerm={searchTerm} filteredData={filteredData} />
        </div>
      </div>

      {/* DetailsPanel - detailsOpen 상태로만 제어 */}
      {detailsOpen && (
        <>
          <div className="absolute inset-0 bg-black/5 z-10" onClick={handleCloseModal} />
          <DetailsPanel
            showFooter={true}
            onClose={handleCloseModal}
          />
        </>
      )}
    </div>
  )
}