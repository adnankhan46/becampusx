"use client"

import * as React from "react"
import {
  HelpCircleIcon,
  LayoutDashboardIcon,
  User2,
  GalleryVerticalEnd,
  UsersRound,
  CreditCard,
  Bell
} from "lucide-react"

// import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "CampusX",
    email: "cx@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
   
  
    {
      title: "SUPERVISOR",
      url: "/Dashboard/selectedApplicants",
      icon: UsersRound,
    } 
  
  ],
  navSecondary: [
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            
              <a href="http://localhost:5173/">
                <span className="text-2xl font-semibold font-outfit">CampusX</span>
              </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
