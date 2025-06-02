"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

// AssetItem 타입 정의
export interface AssetItem {
  id: string
  serialNo: string
  model: string
  leaseStatus?: string
  leaseStartDate?: string
  leaseEndDate?: string
  operator?: string
  engineDesignation?: string
  lifeRemaining?: number
  manufacturer?: string
  manufactureDate?: string
  registrationNo?: string
  tsn?: string
  csn?: string
  tslsv?: string
  cslsv?: string
  operationStatus?: string
  imageUrl?: string
}

// Context 타입 정의
interface AppContextType {
  // 사이드바 상태
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  activeAssetType: "Aircraft" | "Engine" | "APU" | "Landing Gear"
  setActiveAssetType: (type: "Aircraft" | "Engine" | "APU" | "Landing Gear") => void
  
  // 디테일 패널 상태
  detailsOpen: boolean
  setDetailsOpen: (open: boolean) => void
  
  // 매니지 패널 상태
  manageOpen: boolean
  setManageOpen: (open: boolean) => void
  
  // 선택된 자산
  selectedAsset: AssetItem | null
  setSelectedAsset: (asset: AssetItem | null) => void
  
  // 새 자산 추가 모드
  isAddingAsset: boolean
  setIsAddingAsset: (adding: boolean) => void
  
  // 자산 리스트 관리
  assetList: AssetItem[]
  addAsset: (asset: AssetItem) => void
  updateAsset: (updatedAsset: AssetItem) => void
  deleteAsset: (assetId: string) => void
}

// Context 생성
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider 컴포넌트
export function AppProvider({ children }: { children: ReactNode }) {
  // 상태들
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeAssetType, setActiveAssetType] = useState<"Aircraft" | "Engine" | "APU" | "Landing Gear">("Aircraft")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null)
  const [isAddingAsset, setIsAddingAsset] = useState(false)
  const [assetList, setAssetList] = useState<AssetItem[]>([])

  // 자산 추가 함수
  const addAsset = (asset: AssetItem) => {
    console.log("Adding asset to list:", asset)
    setAssetList(prevList => {
      const newList = [...prevList, asset]
      console.log("Updated asset list:", newList)
      return newList
    })
  }

  // 자산 업데이트 함수
  const updateAsset = (updatedAsset: AssetItem) => {
    console.log("Updating asset:", updatedAsset)
    
    // 기본 데이터(default-asset-*)인 경우 새 자산으로 추가
    if (updatedAsset.id.startsWith('default-asset')) {
      console.log("Default asset detected, converting to custom asset")
      addAsset(updatedAsset)
      return
    }
    
    // 기존 커스텀 자산 업데이트
    setAssetList(prevList => {
      const newList = prevList.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
      console.log("Updated asset list:", newList)
      return newList
    })
    
    // 선택된 자산도 업데이트
    if (selectedAsset && selectedAsset.id === updatedAsset.id) {
      setSelectedAsset(updatedAsset)
    }
  }

  // 자산 삭제 함수
  const deleteAsset = (assetId: string) => {
    console.log("Deleting asset:", assetId)
    setAssetList(prevList => {
      const newList = prevList.filter(asset => asset.id !== assetId)
      console.log("Updated asset list:", newList)
      return newList
    })
    
    // 삭제된 자산이 선택된 자산이라면 선택 해제
    if (selectedAsset && selectedAsset.id === assetId) {
      setSelectedAsset(null)
      setDetailsOpen(false)
    }
  }

  // Context 값
  const contextValue: AppContextType = {
    sidebarCollapsed,
    setSidebarCollapsed,
    activeAssetType,
    setActiveAssetType,
    detailsOpen,
    setDetailsOpen,
    manageOpen,
    setManageOpen,
    selectedAsset,
    setSelectedAsset,
    isAddingAsset,
    setIsAddingAsset,
    assetList,
    addAsset,
    updateAsset,
    deleteAsset,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// Context 훅
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}