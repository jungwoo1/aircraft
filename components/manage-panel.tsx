"use client"

import { useAppContext } from "./providers"
import { Button } from "./ui/button"
import { Info, PlusCircle, Clock } from "lucide-react"

interface ManagePanelProps {
  isNewAsset?: boolean
}

export function ManagePanel({ isNewAsset = false }: ManagePanelProps) {
  const { activeTab, setActiveTab } = useAppContext()

  return (
    <div className="w-[640px] border-r bg-white flex flex-col h-full overflow-hidden">
      {/* 탭 헤더 */}
      <div className="h-[52px] border-b flex items-center px-5">
        <div className="flex items-center gap-1">
          <Button variant="ghost" className="h-9 px-3 rounded-lg text-[#99A1AF] font-medium">
            Utilization
          </Button>
          <Button variant="ghost" className="h-9 px-3 rounded-lg text-[#99A1AF] font-medium">
            Invoice
          </Button>
          <Button variant="ghost" className="h-9 px-3 rounded-lg text-[#99A1AF] font-medium">
            Document
          </Button>
          <Button variant="ghost" className="h-9 px-3 rounded-lg text-[#99A1AF] font-medium">
            History
          </Button>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto">
        {/* Recent Update 및 UPDATE 버튼 */}
        <div className="flex justify-between items-center mb-10">
          <div className="w-[295px]">
            <div className="h-9 px-5 py-1 bg-white border border-[#E5E7EB] rounded-full flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-[#6A7282]" />
              <span className="text-xs text-[#6A7282]">
                Recent Update :{" "}
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })}{" "}
                {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </span>
            </div>
          </div>
          <div>
            <Button variant="ghost" className="h-9 text-[#71717B] font-semibold flex items-center gap-2">
              UPDATE
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Life Remaining 섹션 */}
          <div className="border border-[#E5E7EB] rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-[#6A7282]">Life Remaining</h2>
              <Info className="h-5 w-5 text-[#99A1AF]" />
            </div>

            <div className="flex justify-center items-center h-16">
              <span className="text-3xl text-[#9F9FA9] font-semibold">NO DATA</span>
            </div>

            <div className="h-6 bg-[#F3F4F6] rounded-full"></div>

            <hr className="border-[#E5E7EB]" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 px-2 py-1 bg-[#F4F4F5] border border-[#D1D5DC] rounded text-[#9F9FA9]">
                  Current-Life Value (---%)
                </div>
                <span className="text-[#9F9FA9]">--- USD</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-2 py-1 bg-[#F4F4F5] border border-[#D1D5DC] rounded text-[#9F9FA9]">
                  Full-Life Value (100%)
                </div>
                <span className="text-[#9F9FA9]">--- USD</span>
              </div>
            </div>
          </div>

          {/* Status 섹션 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <h2 className="text-base font-semibold text-[#101828]">Status</h2>
              <svg
                width="14"
                height="14"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#90A1B9]"
              >
                <path
                  d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-4 border border-[#E5E7EB] rounded-lg">
                <div className="font-semibold text-[#45556C] text-sm mb-2">TSN</div>
                <div className="flex justify-between">
                  <span className="text-[#9F9FA9]">-</span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[#394EDE]">−1,202</span>
                    <span className="text-[#666666]">(6,000)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-[#E5E7EB] rounded-lg">
                <div className="font-semibold text-[#45556C] text-sm mb-2">CSN</div>
                <div className="flex justify-between">
                  <span className="text-[#9F9FA9]">-</span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[#394EDE]">−1,202</span>
                    <span className="text-[#666666]">(6,000)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-[#E5E7EB] rounded-lg">
                <div className="font-semibold text-[#45556C] text-sm mb-2">TSLSV</div>
                <div className="flex justify-between">
                  <span className="text-[#9F9FA9]">-</span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[#394EDE]">−1,202</span>
                    <span className="text-[#666666]">(6,000)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-[#E5E7EB] rounded-lg">
                <div className="font-semibold text-[#45556C] text-sm mb-2">CSLSV</div>
                <div className="flex justify-between">
                  <span className="text-[#9F9FA9]">-</span>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[#394EDE]">−1,202</span>
                    <span className="text-[#666666]">(6,000)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Components 섹션 */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-[#101828]">Components</h2>

            <div className="border border-[#E5E7EB] rounded-lg">
              <div className="bg-[#F3F4F6] px-4 py-2 flex text-[#4A5565] text-sm font-medium">
                <div className="w-[132px]">ITEM</div>
                <div className="w-[144px]">MODEL</div>
                <div className="flex-1">CONDITION</div>
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                {/* AIRFRAME */}
                <div>
                  <div className="px-4 py-2 flex items-center">
                    <div className="w-[175px] flex items-center gap-2.5">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.625" y="5.28125" width="18.75" height="9.375" fill="#1E2939" stroke="#101828" />
                      </svg>
                      <span className="font-bold text-[#1E2939]">AIRFRAME</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 flex items-center gap-1 text-[#9F9FA9]">
                    <div className="w-1 h-1 bg-[#9F9FA9] rounded-full"></div>
                    <span>No data yet</span>
                  </div>
                </div>

                {/* ENGINE */}
                <div>
                  <div className="px-4 py-2 flex items-center">
                    <div className="w-[175px] flex items-center gap-2.5">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 2.5L17.5 17.5" stroke="#1E2939" strokeWidth="2" />
                      </svg>
                      <span className="font-semibold text-[#1E2939]">ENGINE</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 flex items-center gap-1 text-[#9F9FA9]">
                    <div className="w-1 h-1 bg-[#9F9FA9] rounded-full"></div>
                    <span>No data yet</span>
                  </div>
                </div>

                {/* APU */}
                <div>
                  <div className="px-4 py-2 flex items-center">
                    <div className="w-[175px] flex items-center gap-2.5">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-[17.5px] h-[12.5px] bg-[#1E2939]"></div>
                      </div>
                      <span className="font-semibold text-[#1E2939]">APU</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 flex items-center gap-1 text-[#9F9FA9]">
                    <div className="w-1 h-1 bg-[#9F9FA9] rounded-full"></div>
                    <span>No data yet</span>
                  </div>
                </div>

                {/* LANDING GEAR */}
                <div>
                  <div className="px-4 py-2 flex items-center">
                    <div className="w-[175px] flex items-center gap-2.5">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="7.5" fill="#1E2939" />
                      </svg>
                      <span className="font-semibold text-[#1E2939]">LANDING GEAR</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 flex items-center gap-1 text-[#9F9FA9]">
                    <div className="w-1 h-1 bg-[#9F9FA9] rounded-full"></div>
                    <span>No data yet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
