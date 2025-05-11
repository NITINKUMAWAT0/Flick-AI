import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" alt="Logo" width={35} height={35} priority />

        <h2 className="text-2xl font-bold pt-1.5">FlickAI</h2>
      </div>

      <div>
        <Button>
            Get Started
        </Button>
      </div>
    </div>
  );
};

export default Header;
