// src/pages/Client/ClientLayout.tsx
import React from "react"
import { Outlet } from "react-router"
import {
  User2,
  MessageSquare,
  FileText,
  Users,
  HelpCircleIcon,
  Home
} from "lucide-react"

 
const ClientSidebar = () => {
  const navItems = [
    {
      title: "Dashboard",
      url: "/Client/Dashboard/a",
      icon: Home,
    },
    {
      title: "Comments",
      url: "/Client/Dashboard/b",
      icon: MessageSquare,
    },
    {
      title: "Posts",
      url: "/Client/Dashboard/c",
      icon: FileText,
    },
    {
      title: "Users",
      url: "/Client/Dashboard/d",
      icon: Users,
    },
  ]

  const secondaryItems = [
    {
      title: "Your Account",
      url: "/profile",
      icon: User2,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-semibold">CampusX</h1>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </a>
          ))}
        </nav>
        
        {/* Secondary Navigation */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <nav className="space-y-2">
            {secondaryItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User2 className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium">Client User</p>
            <p className="text-sm text-gray-400">client@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple Header Component
const ClientHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Client Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <User2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

function ClientLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ClientLayout