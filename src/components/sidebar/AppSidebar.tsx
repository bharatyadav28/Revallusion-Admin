import { ChevronDown } from "lucide-react";
import {
  MdOutlineDashboardCustomize as DashboardIcon,
  MdContentPaste as ContentIcon,
} from "react-icons/md";
import { FaList as ListIcon } from "react-icons/fa";
import { useLocation } from "react-router-dom";

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
      ],
    },
  ];

  // Function to check if a sub-menu item is to open by default
  const isOpenByDefault = (items: complexSidebarLinkType) => {
    const subItems = items?.subMenuItems;
    if (!subItems) return false;
    return subItems.some((item) => item.path === pathname);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-lg text-center font-bold h-[3rem] flex items-center justify-center">
          Revallusion
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
              />
            ) : (
              <Collapsible
                className=" group/collapsible "
                defaultOpen={isOpenByDefault(item)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="py-6">
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
