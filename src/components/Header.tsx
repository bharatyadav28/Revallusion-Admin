import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";

function Header() {
  const { pageName } = useSelector((state: RootState) => state.general);

  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center h-[3rem] my-2 w-full">
      <div className="text-[1.2rem] uppercase flex gap-4">
        {isMobile && (
          <div>
            {" "}
            <SidebarTrigger />{" "}
          </div>
        )}
        <div>{pageName} </div>
      </div>
      <div></div>
    </div>
  );
}

export default Header;
