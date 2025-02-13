import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { hover } from "motion/react";

interface Props {
  children: React.ReactNode;
  hoverContent: string;
}
const CustomTooltip = ({ children, hoverContent }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>{hoverContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
