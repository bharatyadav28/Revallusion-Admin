import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { replacePageName } from "@/store/features/generalSlice";

interface Props {
  pathname: string;
  Icon: React.ElementType;
  name: string;
  isSubItem?: boolean;
}

function SidebarItem({ pathname, Icon, name, isSubItem = false }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentPath = location.pathname;

  const handleClick = () => {
    navigate(pathname);
    dispatch(replacePageName(name));
  };

  return (
    <>
      {!isSubItem && (
        <SidebarMenuItem>
          {" "}
          <SidebarMenuButton
            isActive={currentPath === pathname}
            className="py-5 data-[active=true]:bg-[var(--lightpurple)]"
            onClick={handleClick}
          >
            <Icon /> <span> {name} </span>
          </SidebarMenuButton>{" "}
        </SidebarMenuItem>
      )}

      {isSubItem && (
        <SidebarMenuSubItem>
          <SidebarMenuButton
            isActive={currentPath === pathname}
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
