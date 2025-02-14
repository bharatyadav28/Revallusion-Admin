import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import { useLogoutQueryMutation } from "@/store/apis/auth.apis";
import { showError } from "@/lib/reusable-funs";
import { setUser, userInitalState } from "@/store/features/generalSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageLoadingSpinner } from "./common/LoadingSpinner";

function Header() {
  const { pageName } = useAppSelector((state) => state.general);
  const [logoutQuery, { isLoading, error, data, isSuccess }] =
    useLogoutQueryMutation();

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Logout handler
  const handleLogout = () => {
    if (isLoading) return;
    logoutQuery();
  };

  // Handle logout error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Show success message on logout
  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message);
      dispatch(setUser(userInitalState));
      navigate("/signin", { replace: true });
    }
  }, [isSuccess]);

  return (
    <div className="flex justify-between items-center h-[3rem] my-2 w-full">
      <div className="text-[1.25rem] uppercase flex gap-4">
        {isMobile && (
          <div>
            {" "}
            <SidebarTrigger />{" "}
          </div>
        )}
        <div>{pageName} </div>
      </div>
      <div className="hover:cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ProfileIcon size={25} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading && <PageLoadingSpinner />}
    </div>
  );
}

export default Header;
