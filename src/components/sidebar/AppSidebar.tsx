import { useLocation } from "react-router-dom";
// import { FaChartPie as PrimaryDashboardIcon } from "react-icons/fa";
import { FaEdit as PrimaryDashboardIcon } from "react-icons/fa";

import { ChevronDown } from "lucide-react";
import {
  MdDashboard as DashboardIcon,
  MdDescription as PageIcon,
} from "react-icons/md";
import { RiEditBoxLine as ContentIcon } from "react-icons/ri";
import { FaList as ListIcon } from "react-icons/fa";
import { AiOutlineQuestionCircle as QueryIcon } from "react-icons/ai";
import { HiLibrary as LibraryIcon } from "react-icons/hi";
import { GiBookshelf as CourseIcon } from "react-icons/gi";

// import { FaCommentDots as CommentIcon } from "react-icons/fa6";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SidebarItem from "./SidebarItem";
import { complexSidebarLinkType } from "@/lib/interfaces-types";

function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    {
      name: "Dashboard",
      Icon: DashboardIcon,
      path: "/",
    },
    {
      name: "Content Management",
      Icon: ContentIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Hero Section",
          Icon: ListIcon,
          path: "/hero-section",
        },
        {
          name: "Carousals",
          Icon: ListIcon,
          path: "/carousals",
        },
        {
          name: "Latest Tutorials",
          Icon: ListIcon,
          path: "/latest-tutorials",
        },
        {
          name: "Plans",
          Icon: ListIcon,
          path: "/plans",
        },
        {
          name: "Mentor",
          Icon: ListIcon,
          path: "/mentor",
        },
        {
          name: "Curriculum",
          Icon: ListIcon,
          path: "/curriculum",
        },
        {
          name: "Modules",
          Icon: ListIcon,
          path: "/modules",
        },
        {
          name: "Certificate",
          Icon: ListIcon,
          path: "/certificate",
        },
        {
          name: "Faqs",
          Icon: ListIcon,
          path: "/faq",
        },
      ],
    },

    {
      name: "Pages",
      Icon: PageIcon,
      hasSubMenu: true,
      subMenuItems: [
        {
          name: "Pages",
          Icon: ListIcon,
          path: "/static-pages",
        },
      ],
    },
    {
      name: "Primary Dashboard",
      Icon: PrimaryDashboardIcon,
      path: "/primary-dashboard",
    },
    {
      name: "Library Management",
      Icon: LibraryIcon,
      path: "/library-management",
    },
    {
      name: "Course Management",
      Icon: CourseIcon,
      path: "/course-management",
    },
    // {
    //   name: "User Comments",
    //   Icon: CommentIcon,
    //   path: "/comment",
    // },
    {
      name: "Queries",
      Icon: QueryIcon,
      path: "/queries",
    },
  ];

  // Function to check if a sub-menu item is to open by default
  const isOpenByDefault = (items: complexSidebarLinkType) => {
    const subItems = items?.subMenuItems;
    if (!subItems) return false;
    return subItems.some(
      (item) => item.path === pathname || pathname.startsWith(item.path)
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-lg text-center font-bold h-[3rem] flex items-center justify-center">
          Ravallusion
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            return !item.hasSubMenu ? (
              <SidebarItem
                pathname={item.path || "#"}
                Icon={item.Icon}
                name={item.name}
                key={item.name}
              />
            ) : (
              <Collapsible
                className=" group/collapsible "
                defaultOpen={isOpenByDefault(item)}
                key={item.name}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="ps-4 pr-2">
                      <item.Icon />
                      <span> {item.name} </span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item?.subMenuItems?.map((subItem) => (
                        <SidebarItem
                          pathname={subItem.path || "#"}
                          Icon={subItem.Icon}
                          name={subItem.name}
                          isSubItem={true}
                          key={subItem.name}
                        />
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
