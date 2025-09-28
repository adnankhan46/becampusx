"use client"

import { PlusCircleIcon, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {

  const location = useLocation();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <Link to="/Dashboard/createOpportunity">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="cursor-pointer min-w-8 h-12 w-full bg-primary text-white duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90"
              >
              <PlusCircleIcon />
              <span>Create Opportunity</span>
            </SidebarMenuButton>
              </Link>
          <SidebarMenuItem className="flex items-center gap-2">
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            
                <Link to={`${item.url}`}>
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} className={`cursor-pointer ${location.pathname === item.url ? 'bg-primary/10 text-primary' : ''}`}>
                {item.icon && <item.icon />}
                <span className="cursor-pointer">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
                </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
