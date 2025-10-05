import { WalletProvider } from "@/contexts/WalletContext";
import React from "react";
import ThemeProvider from "./theme-provider";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <WalletProvider>{children}</WalletProvider>
    </ThemeProvider>
  );
};

export default Providers;
