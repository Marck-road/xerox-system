'use client'

import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function AdminDashboard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin() {
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }
    window.location.href = '/admin/dashboard'
  }

  const isValid = email.trim().length > 0 && password.length > 0

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center px-4">

      <Image
        src="/CoverPicture.png"
        alt="Connections Copier"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="border border-white/10 shadow-2xl bg-white">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">

            <div className="flex flex-col gap-1">
              <h2 className="text-zinc-900 text-2xl font-bold tracking-tight">Welcome back</h2>
              <p className="text-zinc-500 text-sm">Sign in to your admin account to continue.</p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Username <span className="text-orange-500">*</span>
                </Label>
                <Input
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Juan dela Cruz"
                  className="border-zinc-200 focus-visible:ring-orange-400 h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Password <span className="text-orange-500">*</span>
                </Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="border-zinc-200 focus-visible:ring-orange-400 h-11"
                />
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-12 text-sm font-semibold tracking-wide cursor-pointer bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white shadow-md shadow-orange-200 disabled:opacity-40 transition-colors mt-1"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="text-center text-xs text-zinc-400">
              Having trouble? Contact your administrator.
            </p>
            {error && <p className="text-center text-xs text-red-500">{error}</p>}

          </CardContent>
        </Card>
      </div>

    </div>
  )
}