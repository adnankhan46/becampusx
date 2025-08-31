// "use client"

// import * as React from "react"
// import {
//   HelpCircleIcon,
//   LayoutDashboardIcon,
//   User2,
//   MessageSquare,
//   FileText,
//   Users,
//   Bell
// } from "lucide-react"
 
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
//     name: "Client User",
//     email: "client@example.com",
//     avatar: "/avatars/client.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/Client/Dashboard/a",
//       icon: LayoutDashboardIcon,
//     },
//     {
//       title: "Comments",
//       url: "/Client/Dashboard/b",
//       icon: MessageSquare,
//     },
//     {
//       title: "Posts",
//       url: "/Client/Dashboard/c",
//       icon: FileText,
//     },
//     {
//       title: "Users",
//       url: "/Client/Dashboard/d",
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

// export function ClientSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <a href="/">
//               <span className="text-2xl font-semibold font-outfit">CampusX Client</span>
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