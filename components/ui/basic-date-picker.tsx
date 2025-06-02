"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"

interface BasicDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function BasicDatePicker({ date, setDate, placeholder = "Select date", className = "" }: BasicDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

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

  const toggleCalendar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex items-center cursor-pointer" onClick={toggleCalendar} ref={buttonRef}>
        <CalendarIcon className="h-4 w-4 text-[#101828]" />
      </div>

      {isOpen && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg"
          style={{
            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 10 : 0,
            left: buttonRef.current ? buttonRef.current.getBoundingClientRect().left - 280 : 0,
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
