"use client"

import React from "react"
import { AssetItem, useAppContext } from "./providers"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ExternalLink, ChevronLeft, ChevronRight, Cpu } from "lucide-react"

interface DataTableProps {
  assetType: "Aircraft" | "Engine" | "APU" | "Landing Gear"
  searchTerm?: string
  filteredData?: any[]
}

export function DataTable({ assetType, searchTerm = "", filteredData = [] }: DataTableProps) {
  const { setSelectedAsset, setDetailsOpen, setIsAddingAsset, assetList } = useAppContext()

  // 자산 행 클릭 핸들러
  const handleAssetRowClick = (row: any) => {
    if (row.assetData) {
      // 사용자가 추가한 자산인 경우
      setSelectedAsset(row.assetData)
    } else {
      // 기본 데이터인 경우 (예시 데이터) - 수정 가능하도록 AssetItem 형태로 변환
      const assetItem: AssetItem = {
        id: row.id,
        serialNo: row.serialNo,
        model: "B777-300ER",
        leaseStatus: "Leased",
        leaseStartDate: "24/11/07",
        leaseEndDate: "27/11/06",
        operator: "Korean Air",
        engineDesignation: "CFM56-7B",
        lifeRemaining: 84,
        manufacturer: "Boeing",
        manufactureDate: "2024/03/11",
        registrationNo: "A6-ENA",
        tsn: "23,456",
        csn: "12,345",
        tslsv: "23,456",
        cslsv: "12,345",
        operationStatus: "In-Service",
        imageUrl: "/airplane-in-flight.png",
      }
      setSelectedAsset(assetItem)
    }

    setIsAddingAsset(false)
    setDetailsOpen(true)
  }

  // 컬럼 정의 - 실제 픽셀 값 기반
  const getColumns = () => {
    if (assetType === "Aircraft") {
      return [
        { id: "select", header: "", width: "64px" },
        { id: "serialNo", header: "SERIAL NO.", width: "156px" },
        { id: "model", header: "MODEL / SERIES", width: "284px" },
        { id: "leaseStatus", header: "LEASE STATUS / TERM", width: "312px" },
        { id: "lessee", header: "LESSEE / LESSOR", width: "280px" },
        { id: "engineDesignation", header: "ENGINE DESIGNATION", width: "252px" },
        { id: "lifeRemaining", header: "LIFE REMAINING", width: "272px" },
      ]
    } else {
      return [
        { id: "select", header: "", width: "64px" },
        { id: "serialNo", header: "SERIAL NO.", width: "156px" },
        { id: "model", header: "MODEL / SERIES", width: "284px" },
        { id: "leaseStatus", header: "LEASE STATUS / TERM", width: "312px" },
        { id: "lessee", header: "LESSEE / LESSOR", width: "280px" },
        { id: "engineDesignation", header: "ENGINE DESIGNATION", width: "252px" },
        { id: "lifeRemaining", header: "LIFE REMAINING", width: "272px" },
      ]
    }
  }

  const columns = getColumns()

  // 모델명을 파싱해서 두 부분으로 나누는 함수
  const parseModelName = (model: string) => {
    if (!model) return { part1: "B777", part2: "300ER" }
    
    if (model.includes("-")) {
      const parts = model.split("-")
      return { part1: parts[0], part2: parts.slice(1).join("-") }
    }
    
    if (model.includes(" ")) {
      const parts = model.split(" ")
      return { part1: parts[0], part2: parts.slice(1).join(" ") }
    }
    
    const match = model.match(/^([A-Z]+\d*)(.*)$/)
    if (match) {
      return { part1: match[1], part2: match[2] || "300ER" }
    }
    
    return { part1: model, part2: "" }
  }

  // 리스 상태에 따른 색상 반환
  const getLeaseStatusColor = (status: string) => {
    switch (status) {
      case "Leased":
        return "bg-[#00D492]"
      case "Naked":
        return "bg-[#9CA3AF]"
      default:
        return "bg-[#615FFF]"
    }
  }

  // 검색어 필터링 함수
  const filterAssetsBySearch = (assets: any[], searchTerm: string) => {
    if (!searchTerm.trim()) return assets
    
    const lowerSearchTerm = searchTerm.toLowerCase()
    return assets.filter(asset => 
      asset.serialNo?.toLowerCase().includes(lowerSearchTerm) ||
      asset.model?.toLowerCase().includes(lowerSearchTerm) ||
      asset.operator?.toLowerCase().includes(lowerSearchTerm) ||
      asset.engineDesignation?.toLowerCase().includes(lowerSearchTerm)
    )
  }

  // 데이터 생성 함수
  const generateRows = (count: number) => {
    // 사용자가 추가한 에셋을 먼저 필터링 (검색어가 있다면)
    let filteredAssets = assetList
    if (searchTerm && searchTerm.trim() !== "") {
      filteredAssets = filterAssetsBySearch(assetList, searchTerm)
    }

    // 사용자 에셋을 테이블 행으로 변환
    const customAssets = filteredAssets.map((asset) => {
      const modelParts = parseModelName(asset.model)
      
      return {
        id: asset.id,
        serialNo: asset.serialNo,
        select: (
          <div 
            data-hover="False" 
            data-state="Default" 
            style={{
              width: '24px', 
              height: '24px', 
              position: 'relative', 
              background: 'white', 
              boxShadow: '0px 0px 3.0476186275482178px rgba(0, 0, 0, 0.10) inset', 
              borderRadius: 8, 
              border: '1px #E5E7EB solid'
            }} 
          />
        ),
        model: (
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-white border-[#99A1AF] text-[#4A5565] font-semibold h-7 px-3 flex items-center gap-2"
            >
              <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
              {modelParts.part1}
            </Badge>
            {modelParts.part2 && (
              <Badge
                variant="outline"
                className="bg-white border-[#99A1AF] text-[#4A5565] font-semibold h-7 px-3 flex items-center gap-2"
              >
                <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
                {modelParts.part2}
              </Badge>
            )}
          </div>
        ),
        leaseStatus: (
          <div className="flex items-center gap-3">
            <Badge
              className={`${getLeaseStatusColor(asset.leaseStatus || "")} text-white border-0 rounded-full px-3 h-7 flex items-center gap-1.5 font-semibold`}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              {asset.leaseStatus || "No Status"}
            </Badge>
            {asset.leaseStartDate && asset.leaseEndDate && (
              <span className="text-sm text-[#6A7282] font-semibold">
                {asset.leaseStartDate} - {asset.leaseEndDate}
              </span>
            )}
          </div>
        ),
        lessee: asset.operator ? `${asset.operator} / VMIC` : "No Operator / VMIC",
        engineDesignation: (
          <div className="flex items-center gap-4">
            <div className="w-[148px] h-7 px-2 py-1 bg-white border border-[#6A7282] rounded flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-[#101828]" />
                <span className="text-[#101828] font-semibold text-sm">{asset.engineDesignation || "No Engine"}</span>
              </div>
              <ExternalLink className="h-5 w-5 text-[#6A7282]" />
            </div>
          </div>
        ),
        lifeRemaining: (
          <div className="flex items-center gap-3">
            <div className="w-[172px] flex-1 h-5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#615FFF] rounded-full" 
                style={{ width: `${asset.lifeRemaining || 0}%` }}
              ></div>
            </div>
            <div className="w-8 flex justify-end">
              <span className="text-sm text-[#101828] font-semibold">{asset.lifeRemaining || 0}%</span>
            </div>
          </div>
        ),
        assetData: asset, // 원본 데이터 저장
      }
    })

    // 검색어가 있고 결과가 없다면 빈 배열 반환
    if (searchTerm && searchTerm.trim() !== "" && customAssets.length === 0) {
      return []
    }

    // 기본 데이터 생성 (검색어가 없을 때만)
    const defaultRows = (!searchTerm || searchTerm.trim() === "") 
      ? Array.from({ length: Math.max(0, count - customAssets.length) }, (_, i) => ({
          id: `default-asset-${i}`,
          serialNo: "722910",
          select: (
            <div 
              data-hover="False" 
              data-state="Default" 
              style={{
                width: '24px', 
                height: '24px', 
                position: 'relative', 
                background: 'white', 
                boxShadow: '0px 0px 3.0476186275482178px rgba(0, 0, 0, 0.10) inset', 
                borderRadius: 8, 
                border: '1px #E5E7EB solid'
              }} 
            />
          ),
          model: (
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="bg-white border-[#99A1AF] text-[#4A5565] font-semibold h-7 px-3 flex items-center gap-2"
              >
                <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
                B777
              </Badge>
              <Badge
                variant="outline"
                className="bg-white border-[#99A1AF] text-[#4A5565] font-semibold h-7 px-3 flex items-center gap-2"
              >
                <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
                300ER
              </Badge>
            </div>
          ),
          leaseStatus: (
            <div className="flex items-center gap-3">
              <Badge className="bg-[#00D492] text-white border-0 rounded-full px-3 h-7 flex items-center gap-1.5 font-semibold">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Leased
              </Badge>
              <span className="text-sm text-[#6A7282] font-semibold">24/11/07 - 27/11/06</span>
            </div>
          ),
          lessee: "Korean Air / VMIC",
          engineDesignation: (
            <div className="flex items-center gap-4">
              <div className="w-[148px] h-7 px-2 py-1 bg-white border border-[#6A7282] rounded flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-[#101828]" />
                  <span className="text-[#101828] font-semibold text-sm">CFM56-7B</span>
                </div>
                <ExternalLink className="h-5 w-5 text-[#6A7282]" />
              </div>
            </div>
          ),
          lifeRemaining: (
            <div className="flex items-center gap-3">
              <div className="w-[172px] flex-1 h-5 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-[#615FFF] rounded-full" style={{ width: "84%" }}></div>
              </div>
              <div className="w-8 flex justify-end">
                <span className="text-sm text-[#101828] font-semibold">84%</span>
              </div>
            </div>
          ),
          assetData: null, // 기본 데이터는 null
        }))
      : []

    return [...customAssets, ...defaultRows]
  }

  // 최종 행 데이터 생성
  const rows = generateRows(10)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* 테이블 영역 */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full" style={{ minWidth: "1620px" }}>
          <thead>
            <tr className="bg-[#F3F4F6] h-[42px]">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="text-left text-xs font-semibold text-[#6A7282] uppercase tracking-wider"
                  style={{ 
                    width: column.width,
                    minWidth: column.width,
                    maxWidth: column.width,
                    padding: column.id === "select" ? "0 12px" : "8px 12px 8px 20px"
                  }}
                >
                  {column.id === "select" ? (
                    <div className="flex justify-center items-center">
                      <div 
                        data-hover="False" 
                        data-state="Default" 
                        style={{
                          width: '24px', 
                          height: '24px', 
                          position: 'relative', 
                          background: 'white', 
                          boxShadow: '0px 0px 3.0476186275482178px rgba(0, 0, 0, 0.10) inset', 
                          borderRadius: 8, 
                          border: '1px #E5E7EB solid'
                        }} 
                      />
                    </div>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <React.Fragment key={`row-group-${row.id || index}`}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer h-14"
                    onClick={() => handleAssetRowClick(row)}
                  >
                    <td 
                      className="align-middle"
                      style={{ 
                        width: "64px",
                        minWidth: "64px",
                        maxWidth: "64px",
                        padding: "8px 12px"
                      }}
                    >
                      <div className="flex justify-center items-center">
                        {row.select}
                      </div>
                    </td>
                    <td 
                      className="font-semibold text-[#101828] text-sm align-middle"
                      style={{ 
                        width: "156px",
                        minWidth: "156px",
                        maxWidth: "156px",
                        padding: "8px 28px 8px 20px"
                      }}
                    >
                      {row.serialNo}
                    </td>
                    <td 
                      className="align-middle"
                      style={{ 
                        width: "284px",
                        minWidth: "284px",
                        maxWidth: "284px",
                        padding: "8px 12px"
                      }}
                    >
                      {row.model}
                    </td>
                    <td 
                      className="align-middle"
                      style={{ 
                        width: "312px",
                        minWidth: "312px",
                        maxWidth: "312px",
                        padding: "8px 12px"
                      }}
                    >
                      {row.leaseStatus}
                    </td>
                    <td 
                      className="font-semibold text-[#101828] text-sm align-middle"
                      style={{ 
                        width: "280px",
                        minWidth: "280px",
                        maxWidth: "280px",
                        padding: "8px 28px 8px 12px"
                      }}
                    >
                      {row.lessee}
                    </td>
                    <td 
                      className="align-middle"
                      style={{ 
                        width: "252px",
                        minWidth: "252px",
                        maxWidth: "252px",
                        padding: "8px 12px"
                      }}
                    >
                      {row.engineDesignation}
                    </td>
                    <td 
                      className="align-middle"
                      style={{ 
                        width: "272px",
                        minWidth: "272px",
                        maxWidth: "272px",
                        padding: "8px 28px 8px 12px"
                      }}
                    >
                      {row.lifeRemaining}
                    </td>
                  </tr>
                  {index < rows.length - 1 && (
                    <tr>
                      <td colSpan={columns.length} className="h-[1px] p-0">
                        <div className="h-[1px] bg-[#E5E7EB] mx-3"></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr key="no-results">
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No results found for "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 페이지네이션 */}
      <div className="flex items-center justify-start gap-3 pt-9 pb-4 px-7 bg-white">
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-30">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 bg-[#F5F5F5] border-[#A1A1A1] font-semibold">
          1
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 font-semibold">
          2
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 font-semibold">
          3
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 font-semibold">
          4
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 font-semibold">
          5
        </Button>
        <span className="mx-1 font-semibold">...</span>
        <Button variant="ghost" size="sm" className="h-8 w-8 font-semibold">
          99
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}