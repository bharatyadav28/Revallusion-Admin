import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

function Header() {
  const { pageName } = useSelector((state: RootState) => state.general);

  return (
    <div className="flex justify-between items-center h-[3rem] my-2 w-full">
      <div className="text-[1.2rem] uppercase">{pageName}</div>
      <div></div>
    </div>
  );
}

export default Header;
