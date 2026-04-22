"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function DateTimePicker({ value, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [time, setTime] = React.useState(
    value ? format(value, 'HH:mm') : ''
  )

  function handleDaySelect(day: Date | undefined) {
    setDate(day)
    if (!day) { onChange?.(undefined); return }
    if (!time) return
    const [hours, minutes] = time.split(':').map(Number)
    const combined = new Date(day)
    combined.setHours(hours)
    combined.setMinutes(minutes)
    onChange?.(combined)
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTime = e.target.value
    setTime(newTime)
    if (!date || !newTime) return
    const [hours, minutes] = newTime.split(':').map(Number)
    const combined = new Date(date)
    combined.setHours(hours)
    combined.setMinutes(minutes)
    onChange?.(combined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 w-full justify-start text-left font-normal rounded-3xl",
            "border border-zinc-200 bg-input/50 px-3 text-sm",
            "hover:bg-input/50 hover:border-zinc-200",
            "focus-visible:ring-3 focus-visible:ring-orange-300 focus-visible:border-orange-400",
            !value && "text-muted-foreground",
            value && "text-zinc-800",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
          <span className="flex-1">
            {value ? format(value, "PPP p") : "Pick date & time"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3 rounded-2xl bg-white shadow-lg border border-zinc-200">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDaySelect}
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          classNames={{
            day_selected: "bg-orange-500 text-white hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white",
            day_today: "border border-orange-300 text-orange-500",
          }}
        />
        <div className="mt-2 pt-3 border-t border-zinc-100">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 block">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-full rounded-xl border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700
                       focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}