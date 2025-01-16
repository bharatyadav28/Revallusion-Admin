import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface Props {
  open: boolean;
  handleOpen: () => void;
  children: React.ReactNode;
  className?: string;
}

function CustomDrawer({ open, handleOpen, children, className }: Props) {
  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerContent
        className={`md:w-[calc(100%-16.5rem) md:ml-[16.5rem] ${className}`}
      >
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export default CustomDrawer;