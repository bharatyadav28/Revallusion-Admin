import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/use-redux";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { replacePageName } from "@/store/features/generalSlice";
import { useEffect } from "react";
import { setSelectedPlan } from "@/store/features/selectedPlanSlice";

interface Props {
  pathname: string;
  Icon: React.ElementType;
  name: string;
  isSubItem?: boolean;
}

function SidebarItem({ pathname, Icon, name, isSubItem = false }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentPath = location.pathname;

  const handleClick = () => {
    if (pathname === "/users") {
      dispatch(setSelectedPlan(""));
    }
    navigate(pathname);
  };

  useEffect(() => {
    if (currentPath === pathname) {
      dispatch(replacePageName(name));
    }
  }, [currentPath, pathname, dispatch]);

  const isActive =
    currentPath === pathname ||
    (pathname !== "/" && currentPath.startsWith(pathname));

  return (
    <>
      {!isSubItem && (
        <SidebarMenuItem>
          {" "}
          <SidebarMenuButton
            isActive={isActive}
            className="py-4 ps-4 pr-2 data-[active=true]:bg-[var(--lightpurple)]"
            onClick={handleClick}
          >
            <Icon /> <span> {name} </span>
          </SidebarMenuButton>{" "}
        </SidebarMenuItem>
      )}

      {isSubItem && (
        <SidebarMenuSubItem>
          <SidebarMenuButton
            isActive={isActive}
            className="py-2 data-[active=true]:bg-[var(--lightpurple)]"
            onClick={handleClick}
          >
            <Icon /> <span> {name} </span>
          </SidebarMenuButton>
        </SidebarMenuSubItem>
      )}
    </>
  );
}

export default SidebarItem;
