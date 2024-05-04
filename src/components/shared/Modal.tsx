import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Modal({
  title,
  open,
  setOpen,
  children,
}: {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="max-h-[700px] overflow-auto">
        <DialogHeader className="px-5 pt-5 text-center">
          <DialogTitle className="text-center mb-5 text-2xl">{title ?? "Modal"}</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
