"use client"

import { useState, useEffect, useRef } from "react"
import { AssetItem, useAppContext } from "./providers"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Calendar, ChevronRight, Plane, ChevronDown, AlertTriangle, Ship, Upload, Search, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar as CalendarComponent } from "./ui/calendar"
import { format } from "date-fns"
import { ManagePanel } from "./manage-panel"
import { CustomDatePicker } from "./custom-date-picker"

interface DetailsPanelProps {
  showFooter?: boolean
  onClose?: () => void
}

export function DetailsPanel({ showFooter = true, onClose }: DetailsPanelProps) {
  const { 
    setDetailsOpen, 
    setManageOpen, 
    activeAssetType, 
    manageOpen, 
    selectedAsset, 
    assetList, 
    addAsset,
    updateAsset,
    isAddingAsset,
    setIsAddingAsset,
    setSelectedAsset
  } = useAppContext()

  // 편집 모드 상태 - 새 자산인 경우 기본적으로 편집 모드
  const [isEditing, setIsEditing] = useState(isAddingAsset)

  // 편집 가능한 필드들
  const [editData, setEditData] = useState({
    serialNo: "",
    model: "",
    engineDesignation: "",
    manufacturer: "",
    manufactureDate: null as Date | null,
    registrationNo: "",
    tsn: "",
    csn: "",
    tslsv: "",
    cslsv: "",
    leaseStatus: "",
    leaseStartDate: null as Date | null,
    leaseEndDate: null as Date | null,
    operator: "",
    operationStatus: "",
    lifeRemaining: 0,
    imageUrl: "/airplane-in-flight.png",
  })

  // 드롭다운 상태들
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showEngineDropdown, setShowEngineDropdown] = useState(false)
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false)
  const [showLeaseStatusDropdown, setShowLeaseStatusDropdown] = useState(false)
  const [showOperationStatusDropdown, setShowOperationStatusDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // 자동 저장 관련
  const [lastSavedTime, setLastSavedTime] = useState<Date>(new Date())
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const formDataRef = useRef<any>({})

  // 폼 유효성 검사
  const [isFormValid, setIsFormValid] = useState(false)

  // 옵션들
  const modelOptions = [
    { value: "B777-300ER", label: "B777-300ER" },
    { value: "B737-800", label: "B737-800" },
    { value: "A320neo", label: "A320neo" },
    { value: "A350-900", label: "A350-900" },
  ]

  const engineOptions = [
    { value: "CFM56-7B", label: "CFM56-7B" },
    { value: "GE90-115B", label: "GE90-115B" },
    { value: "Trent XWB", label: "Trent XWB" },
    { value: "PW1100G", label: "PW1100G" },
  ]

  const operatorOptions = [
    { value: "Korean Air", label: "Korean Air" },
    { value: "Emirates Airlines", label: "Emirates Airlines" },
    { value: "Lufthansa", label: "Lufthansa" },
    { value: "Singapore Airlines", label: "Singapore Airlines" },
  ]

  const leaseStatusOptions = [
    { value: "Leased", label: "Leased", color: "#00D492" },
    { value: "Naked", label: "Naked", color: "#9CA3AF" },
  ]

  const operationStatusOptions = [
    {
      value: "In-Service",
      label: "In-Service",
      color: "#00D492",
      bgColor: "#F0FDFA",
      borderColor: "#00D492",
      icon: <Ship className="h-4 w-4" />,
    },
    {
      value: "Out-of-Service",
      label: "Out-of-Service",
      color: "#F43F5E",
      bgColor: "#FFF1F2",
      borderColor: "#F43F5E",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
  ]

  // 폼 유효성 검사
  useEffect(() => {
    const requiredFields = [editData.serialNo, editData.model]
    setIsFormValid(requiredFields.every((field) => field.trim() !== ""))
  }, [editData.serialNo, editData.model])

  // 자동 저장 타이머 설정
  useEffect(() => {
    formDataRef.current = editData

    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setInterval(() => {
      autoSave()
    }, 60000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [editData])

  const autoSave = () => {
    if (!editData.serialNo.trim() && !isAddingAsset) {
      return
    }

    setIsAutoSaving(true)
    const formData = formDataRef.current
    localStorage.setItem("autoSavedAsset", JSON.stringify(formData))
    const now = new Date()
    setLastSavedTime(now)

    setTimeout(() => {
      setIsAutoSaving(false)
    }, 1000)
  }

  // 안전한 날짜 파싱 함수
  const parseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null
    
    try {
      let parsedDate: Date
      
      if (dateString.includes('/') && dateString.length >= 8) {
        parsedDate = new Date(dateString)
      }
      else if (dateString.includes('/') && dateString.length <= 8) {
        const parts = dateString.split('/')
        if (parts.length === 3) {
          let year = parseInt(parts[0])
          if (year < 100) {
            year += year < 50 ? 2000 : 1900
          }
          parsedDate = new Date(year, parseInt(parts[1]) - 1, parseInt(parts[2]))
        } else {
          return null
        }
      }
      else {
        parsedDate = new Date(dateString)
      }
      
      if (isNaN(parsedDate.getTime())) {
        return null
      }
      
      return parsedDate
    } catch (error) {
      console.warn('Date parsing error:', error)
      return null
    }
  }

  // selectedAsset이 변경될 때 또는 새 자산일 때 editData 초기화
  useEffect(() => {
    if (isAddingAsset) {
      // 새 자산인 경우 기본값으로 초기화
      setEditData({
        serialNo: "",
        model: "",
        engineDesignation: "",
        manufacturer: "",
        manufactureDate: null,
        registrationNo: "",
        tsn: "",
        csn: "",
        tslsv: "",
        cslsv: "",
        leaseStatus: "",
        leaseStartDate: null,
        leaseEndDate: null,
        operator: "",
        operationStatus: "",
        lifeRemaining: 0,
        imageUrl: "/airplane-in-flight.png",
      })
      setIsEditing(true)
    } else if (selectedAsset) {
      // 기존 자산인 경우 해당 데이터로 초기화
      setEditData({
        serialNo: String(selectedAsset.serialNo || ""),
        model: selectedAsset.model || "",
        engineDesignation: selectedAsset.engineDesignation || "",
        manufacturer: selectedAsset.manufacturer || "",
        manufactureDate: parseDate(selectedAsset.manufactureDate),
        registrationNo: selectedAsset.registrationNo || "",
        tsn: selectedAsset.tsn || "",
        csn: selectedAsset.csn || "",
        tslsv: selectedAsset.tslsv || "",
        cslsv: selectedAsset.cslsv || "",
        leaseStatus: selectedAsset.leaseStatus || "",
        leaseStartDate: parseDate(selectedAsset.leaseStartDate),
        leaseEndDate: parseDate(selectedAsset.leaseEndDate),
        operator: selectedAsset.operator || "",
        operationStatus: selectedAsset.operationStatus || "",
        lifeRemaining: selectedAsset.lifeRemaining || 0,
        imageUrl: selectedAsset.imageUrl || "/airplane-in-flight.png",
      })
      setIsEditing(true)
    }
  }, [selectedAsset, isAddingAsset])
  
  const handleManageClick = () => {
    setManageOpen(!manageOpen)
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      setDetailsOpen(false)
      setManageOpen(false)
      setIsEditing(false)
      setIsAddingAsset(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!isFormValid) {
      alert("Serial Number and Model are required fields.")
      return
    }

    // Life Remaining 계산 (임시로 기존값 유지하거나 랜덤값 사용)
    const calculatedLifeRemaining = editData.lifeRemaining || Math.floor(Math.random() * 100)

    if (isAddingAsset) {
      // 새 자산 추가
      const newAsset: AssetItem = {
        id: Date.now().toString(),
        serialNo: editData.serialNo,
        model: editData.model,
        engineDesignation: editData.engineDesignation || undefined,
        manufacturer: editData.manufacturer || undefined,
        manufactureDate: editData.manufactureDate ? format(editData.manufactureDate, "yyyy/MM/dd") : undefined,
        registrationNo: editData.registrationNo || undefined,
        tsn: editData.tsn || undefined,
        csn: editData.csn || undefined,
        tslsv: editData.tslsv || undefined,
        cslsv: editData.cslsv || undefined,
        leaseStatus: editData.leaseStatus,
        leaseStartDate: editData.leaseStartDate ? format(editData.leaseStartDate, "yy/MM/dd") : undefined,
        leaseEndDate: editData.leaseEndDate ? format(editData.leaseEndDate, "yy/MM/dd") : undefined,
        operator: editData.operator || undefined,
        operationStatus: editData.operationStatus || undefined,
        lifeRemaining: calculatedLifeRemaining,
        imageUrl: editData.imageUrl,
      }
      
      console.log("Adding new asset:", newAsset)
      if (addAsset) {
        addAsset(newAsset)
        console.log("Asset added successfully")
      }
      
      // 새 자산 추가 후 상태 초기화
      setIsAddingAsset(false)
      setSelectedAsset(newAsset) // 새로 추가된 자산을 선택된 자산으로 설정
      
    } else if (selectedAsset) {
      // 기존 자산이거나 기본 데이터 업데이트
      const updatedAsset: AssetItem = {
        id: selectedAsset.id.startsWith('default-asset') ? Date.now().toString() : selectedAsset.id, // 기본 데이터면 새 ID 생성
        serialNo: editData.serialNo,
        model: editData.model,
        engineDesignation: editData.engineDesignation || undefined,
        manufacturer: editData.manufacturer || undefined,
        manufactureDate: editData.manufactureDate ? format(editData.manufactureDate, "yyyy/MM/dd") : undefined,
        registrationNo: editData.registrationNo || undefined,
        tsn: editData.tsn || undefined,
        csn: editData.csn || undefined,
        tslsv: editData.tslsv || undefined,
        cslsv: editData.cslsv || undefined,
        leaseStatus: editData.leaseStatus,
        leaseStartDate: editData.leaseStartDate ? format(editData.leaseStartDate, "yy/MM/dd") : undefined,
        leaseEndDate: editData.leaseEndDate ? format(editData.leaseEndDate, "yy/MM/dd") : undefined,
        operator: editData.operator || undefined,
        operationStatus: editData.operationStatus || undefined,
        lifeRemaining: calculatedLifeRemaining,
        imageUrl: editData.imageUrl,
      }

      console.log("Processing asset save:", updatedAsset)
      
      if (selectedAsset.id.startsWith('default-asset')) {
        // 기본 데이터를 수정하는 경우 - 새 자산으로 추가
        console.log("Converting default asset to custom asset")
        if (addAsset) {
          addAsset(updatedAsset)
          console.log("Default asset converted and added successfully")
        }
      } else {
        // 기존 커스텀 자산을 업데이트하는 경우
        console.log("Updating existing custom asset")
        if (updateAsset) {
          updateAsset(updatedAsset)
          console.log("Custom asset updated successfully")
        }
      }
      
      setSelectedAsset(updatedAsset) // 업데이트된 자산을 선택된 자산으로 설정
    }
    
    setIsEditing(false)
    // 저장 후 패널을 닫지 않고 view 모드로 전환
  }

  const handleCancel = () => {
    if (isAddingAsset) {
      // 새 자산인 경우 패널 닫기
      handleClose()
    } else {
      // 기존 자산인 경우 원래 데이터로 되돌리기
      if (selectedAsset) {
        setEditData({
          serialNo: String(selectedAsset.serialNo || ""),
          model: selectedAsset.model || "",
          engineDesignation: selectedAsset.engineDesignation || "",
          manufacturer: selectedAsset.manufacturer || "",
          manufactureDate: parseDate(selectedAsset.manufactureDate),
          registrationNo: selectedAsset.registrationNo || "",
          tsn: selectedAsset.tsn || "",
          csn: selectedAsset.csn || "",
          tslsv: selectedAsset.tslsv || "",
          cslsv: selectedAsset.cslsv || "",
          leaseStatus: selectedAsset.leaseStatus || "",
          leaseStartDate: parseDate(selectedAsset.leaseStartDate),
          leaseEndDate: parseDate(selectedAsset.leaseEndDate),
          operator: selectedAsset.operator || "",
          operationStatus: selectedAsset.operationStatus || "",
          lifeRemaining: selectedAsset.lifeRemaining || 0,
          imageUrl: selectedAsset.imageUrl || "/airplane-in-flight.png",
        })
      }
      setIsEditing(false)
    }
  }

  // 새 옵션 추가 핸들러
  const handleAddNewOption = (type: string) => {
    if (type === "model" && searchTerm) {
      setEditData({ ...editData, model: searchTerm })
      setShowModelDropdown(false)
    } else if (type === "engine" && searchTerm) {
      setEditData({ ...editData, engineDesignation: searchTerm })
      setShowEngineDropdown(false)
    } else if (type === "operator" && searchTerm) {
      setEditData({ ...editData, operator: searchTerm })
      setShowOperatorDropdown(false)
    }
    setSearchTerm("")
  }

  const DatePickerComponent = ({
    date,
    setDate,
    placeholder,
  }: { date: Date | null; setDate: (date: Date | null) => void; placeholder: string }) => {
    
    const isValidDate = (d: Date | null): boolean => {
      return d instanceof Date && !isNaN(d.getTime())
    }

    const formatDate = (d: Date | null): string => {
      if (!d || !isValidDate(d)) return placeholder
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
    }

    return (
      <CustomDatePicker
        date={date}
        setDate={setDate}
        placeholder={placeholder}
      />
    )
  }

  // 데이터 표시를 위한 헬퍼 함수
  const getDisplayValue = (value: string | number | undefined, defaultValue: string, isNoData: boolean = false) => {
    if (isAddingAsset && !value) {
      return isNoData ? "No data" : defaultValue
    }
    return value || defaultValue
  }

  return (
    <div
      className="absolute right-0 top-0 h-full flex bg-white shadow-lg z-20"
      style={{
        width: manageOpen ? "1120px" : "480px",
        boxShadow: "-1px 0px 10px rgba(0, 0, 0, 0.15)",
        borderTopLeftRadius: manageOpen ? "0" : "8px",
        borderBottomLeftRadius: manageOpen ? "0" : "8px",
        borderLeft: "1px #E5E7EB solid",
      }}
      data-manage={manageOpen ? "true" : "false"}
    >
      {/* 전체를 감싸는 컨테이너 */}
      <div className="w-full h-full flex flex-col">
        {/* 공통 헤더 - manage 상태에 따라 너비 조정 */}
        <div 
          className="h-[58px] border-b border-[#E5E7EB] flex items-center justify-between px-5 py-2"
          style={{ 
            width: manageOpen ? "1120px" : "480px",
            maxWidth: manageOpen ? "1201px" : "480px",
            minHeight: "58px"
          }}
        >
          <Button variant="ghost" size="icon" onClick={handleClose} className="rotate-180">
            <ChevronRight className="h-6 w-6 text-[#101828]" />
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className={`h-8 ${manageOpen ? "bg-[#615FFF] text-white border-[#615FFF]" : "bg-[#EEF2FF] text-[#615FFF] border-[#C6D2FF]"}`}
              onClick={handleManageClick}
            >
              <div className="flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <rect x="3.66" y="1.75" width="8.59" height="8.59" rx="0.3" stroke="currentColor" strokeWidth="0.6" />
                  <rect x="1.75" y="2.7" width="5.73" height="9.55" rx="0.475" stroke="currentColor" strokeWidth="0.95" />
                  <rect
                    x="1.75"
                    y="6.52"
                    width="9.55"
                    height="5.73"
                    rx="0.475"
                    stroke="currentColor"
                    strokeWidth="0.95"
                  />
                </svg>
                <span>Manage:</span>
                <span className="font-extrabold">{manageOpen ? "ON" : "OFF"}</span>
              </div>
            </Button>
            {!isAddingAsset && (
              <Button variant="outline" className="h-8 font-semibold">
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={handleClose} className="h-8 font-semibold">
              Close
            </Button>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex overflow-hidden">
          {/* Manage Panel - 조건부 렌더링 */}
          {manageOpen && <ManagePanel isNewAsset={isAddingAsset} />}

          {/* Details Panel 컨텐츠 */}
          <div className={`${manageOpen ? "w-[480px]" : "w-full"} flex flex-col h-full overflow-hidden`}>
            {/* 컨텐츠 */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* 상단 정보 */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#E0E7FF] rounded flex items-center justify-center">
                        <Plane className="h-5 w-5 text-[#615FFF]" />
                      </div>
                      <span className="text-[#615FFF] font-medium">Aircraft</span>
                      <span className="text-[#737373] text-sm">
                        {isAddingAsset 
                          ? `${format(new Date(), "yy.MM.dd HH:mm a")} creating...`
                          : "24.12.17 09:16 AM created"
                        }
                      </span>
                    </div>

                    {/* Serial Number */}
                    <div className="self-stretch h-[53px] pr-2.5 pt-[30px] pb-5 bg-white flex justify-start items-center gap-2 overflow-hidden">
                      <div className="flex flex-col justify-center items-start">
                        <div className="flex flex-col justify-end text-[#101828] text-[36px] font-semibold font-['Inter'] leading-[40px]">
                          {isEditing ? (
                            <Input
                              value={editData.serialNo}
                              onChange={(e) => setEditData({ ...editData, serialNo: e.target.value })}
                              className="text-[36px] font-semibold font-['Inter'] leading-[40px] border-none p-0 h-auto focus-visible:ring-0 bg-transparent text-[#101828] placeholder:text-gray-400"
                              placeholder="Serial Number"
                            />
                          ) : (
                            <span>
                              {getDisplayValue(
                                editData.serialNo || selectedAsset?.serialNo,
                                isAddingAsset ? "New Aircraft" : "41082"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 이미지 업로드 영역 */}
                  <div className="w-[108px] h-[108px] rounded-lg overflow-hidden">
                    {isEditing ? (
                      <div
                        className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer"
                        onClick={() => alert("이미지 업로드 기능은 아직 구현되지 않았습니다.")}
                      >
                        {editData.imageUrl && editData.imageUrl !== "/airplane-in-flight.png" ? (
                          <img src={editData.imageUrl} alt="Aircraft" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Upload className="h-6 w-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-400">Upload Image</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img src={editData.imageUrl || "/airplane-in-flight.png"} alt="Aircraft" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                {/* LIFE REMAINING 섹션 */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-[#101828]">LIFE REMAINING</h2>
                      <span className="text-[#615FFF] font-bold">
                        {editData.lifeRemaining || 0}%
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#101828]" />
                  </div>
                  <Progress
                    value={editData.lifeRemaining || 0}
                    className="h-3 rounded-full bg-[#F3F4F6]"
                    indicatorClassName="bg-[#615FFF]"
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <div className="flex items-center">
                      <span className="text-[#101828] font-medium">
                        {isAddingAsset ? "0.00" : "33,413,349.20"}
                      </span>
                      <span className="text-[#737373] mx-1">/</span>
                      <span className="text-[#99A1AF]">
                        {isAddingAsset ? "0.00" : "61,851,437.68"}
                      </span>
                      <span className="text-[#71717B] ml-1">USD</span>
                    </div>
                    <span className="text-[#71717B] text-sm">(value remaining)</span>
                  </div>
                </div>

                <hr className="border-[#E8E8F1] my-4" />

                {/* 항공기 정보 섹션 */}
                <div className="space-y-1">
                  {/* Aircraft Model */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#45556C] font-medium">Aircraft Model</span>
                    {isEditing ? (
                      <div className="relative">
                        <Badge
                          variant="outline"
                          className="h-7 px-3 border-[#6A7282] bg-white text-[#314158] font-normal flex items-center gap-2 cursor-pointer"
                          onClick={() => setShowModelDropdown(!showModelDropdown)}
                        >
                          <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
                          {editData.model || "Select Model"}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Badge>
                        {showModelDropdown && (
                          <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Search model..."
                                  className="pl-8 h-8 text-sm"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {modelOptions
                                .filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((option) => (
                                  <div
                                    key={option.value}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => {
                                      setEditData({ ...editData, model: option.value })
                                      setShowModelDropdown(false)
                                      setSearchTerm("")
                                    }}
                                  >
                                    {option.label}
                                  </div>
                                ))}
                              {searchTerm &&
                                !modelOptions.some((option) => option.label.toLowerCase() === searchTerm.toLowerCase()) && (
                                  <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center text-blue-600"
                                    onClick={() => handleAddNewOption("model")}
                                  >
                                    <Plus className="h-3 w-3 mr-1" /> Add "{searchTerm}"
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="h-7 px-3 border-[#6A7282] bg-white text-[#314158] font-normal flex items-center gap-2"
                      >
                        <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
                        {getDisplayValue(editData.model, "B777-300ER", isAddingAsset)}
                      </Badge>
                    )}
                  </div>

                  {/* Engine Designation */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#45556C] font-medium">Engine Designation</span>
                    {isEditing ? (
                      <div className="relative">
                        <Badge
                          variant="outline"
                          className="h-7 px-3 border-[#6A7282] bg-white text-[#314158] font-normal flex items-center gap-2 cursor-pointer"
                          onClick={() => setShowEngineDropdown(!showEngineDropdown)}
                        >
                          <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
                          {editData.engineDesignation || "Select Engine"}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Badge>
                        {showEngineDropdown && (
                          <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Search engine..."
                                  className="pl-8 h-8 text-sm"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {engineOptions
                                .filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((option) => (
                                  <div
                                    key={option.value}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => {
                                      setEditData({ ...editData, engineDesignation: option.value })
                                      setShowEngineDropdown(false)
                                      setSearchTerm("")
                                    }}
                                  >
                                    {option.label}
                                  </div>
                                ))}
                              {searchTerm &&
                                !engineOptions.some((option) => option.label.toLowerCase() === searchTerm.toLowerCase()) && (
                                  <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center text-blue-600"
                                    onClick={() => handleAddNewOption("engine")}
                                  >
                                    <Plus className="h-3 w-3 mr-1" /> Add "{searchTerm}"
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="h-7 px-3 border-[#6A7282] bg-white text-[#314158] font-normal flex items-center gap-2"
                      >
                        <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
                        {getDisplayValue(editData.engineDesignation, "CFM56-7B", isAddingAsset)}
                      </Badge>
                    )}
                  </div>

                  {/* Manufacturer */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#45556C] font-medium">Manufacturer</span>
                    {isEditing ? (
                      <Input
                        value={editData.manufacturer}
                        onChange={(e) => setEditData({ ...editData, manufacturer: e.target.value })}
                        className="max-w-[200px] h-7 text-sm"
                        placeholder="Enter manufacturer"
                      />
                    ) : (
                      <span className="text-[#101828]">
                        {getDisplayValue(editData.manufacturer, "Boeing", isAddingAsset)}
                      </span>
                    )}
                  </div>

                  {/* Date of Manufacture */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#45556C] font-medium">Date of Manufacture</span>
                    {isEditing ? (
                      <div className="max-w-[200px]">
                        <DatePickerComponent
                          date={editData.manufactureDate}
                          setDate={(date) => setEditData({ ...editData, manufactureDate: date })}
                          placeholder="Select date"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-[#101828]">
                          {editData.manufactureDate 
                            ? format(editData.manufactureDate, "yyyy/MM/dd")
                            : getDisplayValue("", "2024/03/11", isAddingAsset)
                          }
                        </span>
                        <Calendar className="h-4 w-4 ml-2 text-[#101828]" />
                      </div>
                    )}
                  </div>

                  {/* Registration No. */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#45556C] font-medium">Registration No.</span>
                    {isEditing ? (
                      <Input
                        value={editData.registrationNo}
                        onChange={(e) => setEditData({ ...editData, registrationNo: e.target.value })}
                        className="max-w-[200px] h-7 text-sm"
                        placeholder="Enter registration"
                      />
                    ) : (
                      <span className="text-[#101828]">
                        {getDisplayValue(editData.registrationNo, "A6-ENA", isAddingAsset)}
                      </span>
                    )}
                  </div>

                  {/* TSN / CSN */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#45556C] font-medium">TSN / CSN</span>
                    {isEditing ? (
                      <div className="flex gap-2 max-w-[200px]">
                        <Input
                          value={editData.tsn}
                          onChange={(e) => setEditData({ ...editData, tsn: e.target.value })}
                          className="w-[95px] h-7 text-sm"
                          placeholder="TSN"
                        />
                        <span className="text-[#45556C] self-center">/</span>
                        <Input
                          value={editData.csn}
                          onChange={(e) => setEditData({ ...editData, csn: e.target.value })}
                          className="w-[95px] h-7 text-sm"
                          placeholder="CSN"
                        />
                      </div>
                    ) : (
                      <span className="text-[#101828]">
                        {getDisplayValue(editData.tsn, "23,456", isAddingAsset)} / {getDisplayValue(editData.csn, "12,345", isAddingAsset)}
                      </span>
                    )}
                  </div>

                  {/* TSLSV / CSLSV */}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#45556C] font-medium">TSLSV / CSLSV</span>
                    {isEditing ? (
                      <div className="flex gap-2 max-w-[200px]">
                        <Input
                          value={editData.tslsv}
                          onChange={(e) => setEditData({ ...editData, tslsv: e.target.value })}
                          className="w-[95px] h-7 text-sm"
                          placeholder="TSLSV"
                        />
                        <span className="text-[#45556C] self-center">/</span>
                        <Input
                          value={editData.cslsv}
                          onChange={(e) => setEditData({ ...editData, cslsv: e.target.value })}
                          className="w-[95px] h-7 text-sm"
                          placeholder="CSLSV"
                        />
                      </div>
                    ) : (
                      <span className="text-[#101828]">
                        {getDisplayValue(editData.tslsv, "23,456", isAddingAsset)} / {getDisplayValue(editData.cslsv, "12,345", isAddingAsset)}
                      </span>
                    )}
                  </div>
                </div>

                <hr className="border-[#E8E8F1] my-4" />

                {/* LEASE STATUS 섹션 */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#101828]">LEASE STATUS</h2>
                    <ChevronRight className="h-4 w-4 text-[#101828]" />
                  </div>

                  {/* Lease Status Badge */}
                  {isEditing ? (
                    <div className="relative mb-4">
                      <div className="cursor-pointer" onClick={() => setShowLeaseStatusDropdown(!showLeaseStatusDropdown)}>
                        {editData.leaseStatus === "Leased" ? (
                          <div className="h-8 px-4 py-1.5 bg-[#00D492] rounded-full flex items-center gap-2 text-white w-fit">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <span className="font-semibold">Leased</span>
                          </div>
                        ) : editData.leaseStatus === "Naked" ? (
                          <div className="h-8 px-4 py-1.5 bg-[#9CA3AF] rounded-full flex items-center gap-2 text-white w-fit">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            <span className="font-semibold">Naked</span>
                          </div>
                        ) : (
                          <div className="h-8 px-4 py-1.5 bg-[#F3F4F6] rounded-full flex items-center gap-2 text-[#9CA3AF] w-fit">
                            <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></div>
                            <span className="font-semibold">Select Status</span>
                          </div>
                        )}
                      </div>
                      {showLeaseStatusDropdown && (
                        <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-40">
                          {leaseStatusOptions.map((option) => (
                            <div
                              key={option.value}
                              className="p-1.5 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setEditData({ ...editData, leaseStatus: option.value })
                                setShowLeaseStatusDropdown(false)
                              }}
                            >
                              <div
                                className={`h-8 px-4 py-1.5 rounded-full flex items-center gap-2`}
                                style={{ backgroundColor: option.color, color: "white" }}
                              >
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                <span className="font-semibold text-sm">{option.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Badge
                      className={`${
                        editData.leaseStatus === "Leased"
                          ? "bg-[#00D492]"
                          : editData.leaseStatus === "Naked"
                            ? "bg-[#6B7280]"
                            : "bg-[#F3F4F6] text-[#9CA3AF]"
                      } text-white border-0 rounded-full px-4 py-1 mb-4 flex items-center w-fit`}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                      <span className="font-semibold">
                        {editData.leaseStatus || (isAddingAsset ? "No data" : "Leased")}
                      </span>
                    </Badge>
                  )}

                  <div className="space-y-1">
                    {/* Lease Period */}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#45556C] font-medium">Lease Period</span>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-[80px]">
                            <DatePickerComponent
                              date={editData.leaseStartDate}
                              setDate={(date) => setEditData({ ...editData, leaseStartDate: date })}
                              placeholder="Start"
                            />
                          </div>
                          <span>-</span>
                          <div className="w-[80px]">
                            <DatePickerComponent
                              date={editData.leaseEndDate}
                              setDate={(date) => setEditData({ ...editData, leaseEndDate: date })}
                              placeholder="End"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-[#101828]">
                            {editData.leaseStartDate && editData.leaseEndDate
                              ? `${format(editData.leaseStartDate, "yy/MM/dd")} - ${format(editData.leaseEndDate, "yy/MM/dd")}`
                              : isAddingAsset 
                                ? "No data - No data"
                                : "24/11/07 - 27/11/06"
                            }
                          </span>
                          <Calendar className="h-4 w-4 ml-2 text-[#101828]" />
                        </div>
                      )}
                    </div>

                    {/* Operator */}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#45556C] font-medium">Operator</span>
                      {isEditing ? (
                        <div className="relative">
                          <Badge
                            variant="outline"
                            className="h-7 px-3 border-[#6A7282] bg-white text-[#314158] font-normal flex items-center gap-2 cursor-pointer"
                            onClick={() => setShowOperatorDropdown(!showOperatorDropdown)}
                          >
                            <div className="w-1 h-1 bg-[#4A5565] rounded-full"></div>
                            {editData.operator || "Select Operator"}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Badge>
                          {showOperatorDropdown && (
                            <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                              <div className="p-2 border-b">
                                <div className="relative">
                                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    placeholder="Search operator..."
                                    className="pl-8 h-8 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {operatorOptions
                                  .filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
                                  .map((option) => (
                                    <div
                                      key={option.value}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                      onClick={() => {
                                        setEditData({ ...editData, operator: option.value })
                                        setShowOperatorDropdown(false)
                                        setSearchTerm("")
                                      }}
                                    >
                                      {option.label}
                                    </div>
                                  ))}
                                {searchTerm &&
                                  !operatorOptions.some((option) => option.label.toLowerCase() === searchTerm.toLowerCase()) && (
                                    <div
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center text-blue-600"
                                      onClick={() => handleAddNewOption("operator")}
                                    >
                                     <Plus className="h-3 w-3 mr-1" /> Add "{searchTerm}"
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#101828]">
                          {getDisplayValue(editData.operator, "Korean Air", isAddingAsset)}
                        </span>
                      )}
                    </div>

                    {/* Operation Status */}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#45556C] font-medium">Operation Status</span>
                      {isEditing ? (
                        <div className="relative">
                          <div
                            className="cursor-pointer"
                            onClick={() => setShowOperationStatusDropdown(!showOperationStatusDropdown)}
                          >
                            {editData.operationStatus === "In-Service" ? (
                              <div className="h-8 px-3 py-1 bg-[#F0FDFA] border border-[#00D492] rounded-md flex items-center gap-2 text-[#00D492]">
                                <Ship className="h-4 w-4" />
                                <span className="font-semibold">In-Service</span>
                              </div>
                            ) : editData.operationStatus === "Out-of-Service" ? (
                              <div className="h-8 px-3 py-1 bg-[#FFF1F2] border border-[#F43F5E] rounded-md flex items-center gap-2 text-[#F43F5E]">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-semibold">Out-of-Service</span>
                              </div>
                            ) : (
                              <div className="h-8 px-3 py-1 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md flex items-center gap-2 text-[#9CA3AF]">
                                <span className="font-semibold">Select Status</span>
                              </div>
                            )}
                          </div>
                          {showOperationStatusDropdown && (
                            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-48">
                              {operationStatusOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setEditData({ ...editData, operationStatus: option.value })
                                    setShowOperationStatusDropdown(false)
                                  }}
                                >
                                  <div
                                    className={`h-8 px-3 py-1 rounded-md flex items-center gap-2`}
                                    style={{
                                      backgroundColor: option.bgColor,
                                      color: option.color,
                                      border: `1px solid ${option.borderColor}`,
                                    }}
                                  >
                                    {option.icon}
                                    <span className="font-semibold">{option.label}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {editData.operationStatus ? (
                            <Badge className="bg-[#F0FDFA] text-[#00D492] border-[#00D492] flex items-center gap-2">
                              <Ship className="h-4 w-4" />
                              <span className="font-semibold">{editData.operationStatus}</span>
                            </Badge>
                          ) : (
                            <span className="text-[#101828]">{isAddingAsset ? "No data" : "In-Service"}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 푸터
            {showFooter && (
              <div className="border-t p-4 flex items-center justify-between bg-[#F9FAFB]">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`transition-all duration-300 ${
                      isAutoSaving 
                        ? "bg-[#E0E7FF] text-[#615FFF] border-[#C6D2FF]" 
                        : "bg-[#F3F4F6] text-[#6A7282] border-[#E5E7EB]"
                    } px-2 py-0.5 text-xs`}
                  >
                    Auto-saved
                  </Badge>
                  <span className="text-xs text-[#4A4D55]">
                    {format(lastSavedTime, "yyyy. MM. dd. H:mm a")}
                  </span>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="bg-white hover:bg-gray-50 text-[#101828] border border-[#E5E7EB] font-semibold h-8"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave} 
                        disabled={!isFormValid}
                        className="bg-[#615FFF] hover:bg-[#4F39F6] text-white font-semibold h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAddingAsset ? "Create" : "Save"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="bg-white hover:bg-gray-50 text-[#101828] border border-[#E5E7EB] font-semibold h-8"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* 공통 푸터 - manage 상태에 따라 너비 조정 */}
        {showFooter && (
          <div 
            className="border-t bg-[#F9FAFB] px-7 py-3 flex items-center justify-between"
            style={{ 
              width: manageOpen ? "1120px" : "480px",
              maxWidth: manageOpen ? "1201px" : "480px",
            }}
          >
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`transition-all duration-300 ${
                  isAutoSaving 
                    ? "bg-[#E0E7FF] text-[#615FFF] border-[#C6D2FF]" 
                    : "bg-[#F3F4F6] text-[#6A7282] border-[#E5E7EB]"
                } px-2 py-0.5 text-xs`}
              >
                Auto-saved
              </Badge>
              <span className="text-xs text-[#4A4D55]">
                {format(lastSavedTime, "yyyy. MM. dd. H:mm a")}
              </span>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="bg-white hover:bg-gray-50 text-[#101828] border border-[#E5E7EB] font-semibold h-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={!isFormValid}
                    className="bg-[#615FFF] hover:bg-[#4F39F6] text-white font-semibold h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingAsset ? "Create" : "Save"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-[#101828] border border-[#E5E7EB] font-semibold h-8"
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}