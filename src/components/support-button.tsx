"use client";

import { useEffect, useState } from "react";
import SupportModal from "./support-modal";
import { Button } from "./ui/button";
import { useGlobalStore } from "@/stores/useGlobalStore";

const SupportButton = () => {
  const { isFirstTime, setIsFirstTime, _hasHydrated } = useGlobalStore();

  const [isOpen, setIsOpen] = useState(_hasHydrated && isFirstTime);

  const handleOpenSupportModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if (_hasHydrated && isFirstTime) {
      setIsOpen(true);
      setIsFirstTime(false);
    }
  }, [_hasHydrated, isFirstTime]);

  return (
    <>
      <Button
        variant="default"
        className="fixed bottom-4 right-4"
        onClick={handleOpenSupportModal}
      >
        {/* <CircleQuestionMark /> */}
        <span>Help</span>
      </Button>

      <SupportModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default SupportButton;
