import { Sheet, SheetContent } from "@/components/ui/sheet";

interface Props {
  open: boolean;
  handleOpen: () => void;
  children: React.ReactNode;
  className?: string;
}

function CustomSheet({ open, handleOpen, children, className }: Props) {
  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent
        className={`md:w-[calc(100%-17rem)] w-full !max-w-full  ${className}`}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default CustomSheet;
