"use client";

import Logo from "@/components/logo";
import ThemeButton from "@/components/theme-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WalletConnect } from "./wallet/wallet-connect";

interface Props {
  fixed?: boolean;
}

const navbarItems = [
  { href: "/", children: "Gallery" },
  { href: "/create-nft", children: "Create NFT" },
  { href: "/collection", children: "Collection" },
];

const Navbar = ({ fixed }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <nav
      className={cn(
        "h-18 flex border-b-4 items-center justify-between font-medium bg-secondary-background px-4 lg:px-8",
        fixed && "fixed top-0 left-0 right-0 z-20"
      )}
    >
      <div className="flex items-center gap-10">
        <Logo size="lg" />

        <div className="items-center gap-10 hidden lg:flex">
          {navbarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.children}
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <WalletConnect />
        <ThemeButton />
        {/* <LogoutButton /> */}
      </div>

      {/* <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      /> */}

      <div className="flex lg:hidden items-center justify-center gap-4">
        <ThemeButton />
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
