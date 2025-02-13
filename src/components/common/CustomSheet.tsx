import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Props {
  open: boolean;
  handleOpen: () => void;
  children: React.ReactNode;
  className?: string;
}

function CustomSheet({ open, handleOpen, children, className }: Props) {
  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetHeader>
        <SheetTitle className="hidden"></SheetTitle>
        <SheetDescription className="hidden"></SheetDescription>
      </SheetHeader>
      <SheetContent
        className={`md:w-[calc(100%-17rem)] w-full !max-w-full  ${className} overflow-y-auto`}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default CustomSheet;
