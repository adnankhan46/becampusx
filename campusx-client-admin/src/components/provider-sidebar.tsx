// "use client"

// import * as React from "react"
// import {
//   HelpCircleIcon,
//   LayoutDashboardIcon,
//   User2,
//   Briefcase,
//   CreditCard,
//   Users,
//   Bell
// } from "lucide-react"

// import { NavMain } from "@/components/nav-main"
// import { NavSecondary } from "@/components/nav-secondary"
// import { NavUser } from "@/components/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const data = {
//   user: {
//     name: "Provider User",
//     email: "provider@example.com",
//     avatar: "/avatars/provider.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/Provider/Dashboard/a",
//       icon: LayoutDashboardIcon,
//     },
//     {
//       title: "Opportunities",
//       url: "/Provider/Dashboard/b",
//       icon: Briefcase,
//     },
//     {
//       title: "Payments",
//       url: "/Provider/Dashboard/c",
//       icon: CreditCard,
//     },
//     {
//       title: "Applicants",
//       url: "/Provider/Dashboard/d",
//       icon: Users,
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Your Account",
//       url: "/profile",
//       icon: User2,
//     },
//     {
//       title: "Get Help",
//       url: "#",
//       icon: HelpCircleIcon,
//     },
//   ],
// }

// export function ProviderSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <a href="/">
//               <span className="text-2xl font-semibold font-outfit">CampusX Provider</span>
//             </a>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//         <NavSecondary items={data.navSecondary} className="mt-auto" />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//     </Sidebar>
//   )
// }