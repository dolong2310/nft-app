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
        <div className="relative pb-[50%] h-0 overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            width="1840"
            height="1152"
            src="https://www.youtube.com/embed/8o9uftjyhcY"
            title="Demo NFT App - Deploy contract with Remix IDE"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal;
