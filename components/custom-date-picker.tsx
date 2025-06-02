"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface CustomDatePickerProps {
  date: Date | null
  setDate: (date: Date | null) => void
  placeholder: string
}

export function CustomDatePicker({ date, setDate, placeholder }: CustomDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(date ? date.getMonth() : new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(date ? date.getFullYear() : new Date().getFullYear())
  const [viewMode, setViewMode] = useState<'date' | 'month' | 'year'>('date')

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (d: Date | null): string => {
    if (!d) return placeholder
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setDate(newDate)
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1)
  }

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1)
  }

  const handleMonthClick = (monthIndex: number) => {
    setCurrentMonth(monthIndex)
    setViewMode('date')
  }

  const renderDateView = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const prevMonthDays = getDaysInMonth(prevMonth, prevYear)
      days.push(
        <button
          key={`prev-${prevMonthDays - i}`}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full"
          onClick={() => {
            setCurrentMonth(prevMonth)
            setCurrentYear(prevYear)
          }}
        >
          {prevMonthDays - i}
        </button>
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = date && 
        date.getDate() === day && 
        date.getMonth() === currentMonth && 
        date.getFullYear() === currentYear
      
      days.push(
        <button
          key={day}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-medium ${
            isSelected 
              ? 'bg-[#4353FF] text-white font-semibold' 
              : 'text-black hover:bg-gray-100'
          }`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </button>
      )
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const remainingCells = totalCells - (firstDay + daysInMonth)
    
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
      
      days.push(
        <button
          key={`next-${day}`}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full"
          onClick={() => {
            setCurrentMonth(nextMonth)
            setCurrentYear(nextYear)
          }}
        >
          {day}
        </button>
      )
    }

    return (
      <div className="w-[358px] bg-white shadow-lg rounded border border-gray-200 p-1">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('month')}
            className="font-semibold text-lg hover:bg-gray-100 px-3 py-1 rounded"
          >
            {currentYear} {monthNames[currentMonth]}
          </button>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 px-4 py-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-gray-500 font-semibold text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 px-4 pb-5">
          {days}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    return (
      <div className="w-[300px] bg-white shadow-lg rounded border border-gray-200 p-1">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4">
          <button onClick={handlePrevYear} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-semibold text-lg">
            {currentYear}
          </div>
          <button onClick={handleNextYear} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Months grid */}
        <div className="grid grid-cols-4 gap-2 px-7 pb-5">
          {months.map((month, index) => {
            const isSelected = currentMonth === index
            return (
              <button
                key={month}
                onClick={() => handleMonthClick(index)}
                className={`py-2 px-6 rounded text-sm font-medium ${
                  isSelected 
                    ? 'bg-[#4353FF] text-white font-semibold' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                {month}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal h-7 text-sm">
          <Calendar className="mr-2 h-4 w-4" />
          {formatDate(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {viewMode === 'date' && renderDateView()}
        {viewMode === 'month' && renderMonthView()}
      </PopoverContent>
    </Popover>
  )
}