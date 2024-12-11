import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function CustomSlider({ isOpen, toggleSheet }) {
  return (
    <Sheet open={isOpen} onOpenChange={toggleSheet}>
      <SheetTrigger asChild>
        {/* <Button variant="outline">Open</Button> */}
        <button>click</button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <div>pawan</div>
        <SheetFooter>
          <SheetClose asChild>{/* <Button type="submit">Save changes</Button> */}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
