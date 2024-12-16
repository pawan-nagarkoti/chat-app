import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function CustomSlider({ isOpen, toggleSheet, children }) {
  return (
    <Sheet open={isOpen} onOpenChange={toggleSheet}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Group Information</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="overflow-auto h-screen">{children}</div>
        <SheetFooter>
          <SheetClose asChild>{/* <Button type="submit">Save changes</Button> */}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
