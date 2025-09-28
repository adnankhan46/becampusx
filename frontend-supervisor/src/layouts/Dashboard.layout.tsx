import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/Navbar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet, useLocation } from "react-router"

function DashboardLayout() {
  const location = useLocation();
  return (
    <div>
      {/* <Navbar/> */}
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
{/*           
           <SectionCards/> */}
              <Outlet/>
          
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  )
}

export default DashboardLayout
