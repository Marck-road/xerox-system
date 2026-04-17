"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown  } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
            variant="outline"
            className={cn(
                "h-9 w-full justify-start text-left font-normal rounded-3xl border border-transparent bg-input/50 px-3 text-sm transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 hover:bg-input/50",
                !value && "text-muted-foreground"
            )}
        >
            <CalendarIcon className="h-4 w-4" />
            <span className="flex-1">{value ? format(value, "PPP") : "Pick a date"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} disabled={{ before: new Date() }}/>
      </PopoverContent>
    </Popover>
  )
}