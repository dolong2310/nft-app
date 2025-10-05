import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, size = "md" }: Props) => {
  const sizeClasses = {
    sm: "w-12 h-6 text-xl",
    md: "w-14 h-8 text-xl",
    lg: "w-16 h-10 text-2xl",
  };

  return (
    <Link href="/" className={cn("flex items-center justify-center", className)}>
      <span
        className={cn(
          poppins.className,
          "rounded-base flex bg-main text-main-foreground border-2 border-black items-center justify-center font-heading",
          sizeClasses[size]
        )}
      >
        NFT
      </span>
    </Link>
  );
};

export default Logo;
