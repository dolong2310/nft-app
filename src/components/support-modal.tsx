import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportModal = ({ isOpen, onOpenChange }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full md:min-w-[80vh] bg-secondary-background border-4 rounded-base shadow-none p-0 overflow-hidden"
        noCloseButton
      >
        <DialogTitle className="sr-only">Demo NFT App</DialogTitle>
        <video src="/videos/demo-nft-app.mp4" controls autoPlay muted loop>
          Trình duyệt của bạn không hỗ trợ video tag.
        </video>
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal;
