"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"

interface SimpleDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function SimpleDatePicker({
  date,
  setDate,
  placeholder = "Select date",
  className = "",
}: SimpleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDaySelect = (day: Date | undefined) => {
    setDate(day)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className="flex items-center justify-between border border-gray-300 rounded px-3 py-1 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${!date ? "text-gray-500" : "text-gray-900"}`}>
          {date ? format(date, "yyyy/MM/dd") : placeholder}
        </span>
        <Calendar className="h-4 w-4 text-gray-500" />
      </div>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
          style={{
            position: "fixed",
            transform: "translateY(10px)",
            maxWidth: "320px",
          }}
        >
          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            className="p-2"
            classNames={{
              day_selected: "bg-[#615FFF] text-white rounded",
              day_today: "text-[#615FFF] font-bold",
            }}
          />
        </div>
      )}
    </div>
  )
}
