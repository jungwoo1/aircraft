"use client"

import { Sidebar } from "./sidebar"
import { MainContent } from "./main-content"
import { useAppContext } from "./providers"
import { Header } from "./header"

export function Dashboard() {
  const { detailsOpen } = useAppContext()

  return (
    <div className="w-screen h-screen bg-white overflow-hidden border border-black flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <MainContent />
      </div>
    </div>
  )
}