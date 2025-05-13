'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Gem, Home, LucideFileVideo, Search, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust based on your path

const sidebarItems = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: Home
  },
  {
    title: 'Create New Video',
    url: '/create-new-video',
    icon: LucideFileVideo
  },
  {
    title: 'Explore',
    url: '/explore',
    icon: Search
  },
  {
    title: 'Billing',
    url: '/billing',
    icon: WalletCards
  },
];

const AppSidebar = () => {
  const path = usePathname();
  const { user } = useUser();

  const dbUser = useQuery(api.users.getUserByClerkId, {
    clerkUserId: user?.id || ""
  });

  if (!user || dbUser === undefined) {
    return null; // Avoid hydration mismatch
  }

  return (
    <Sidebar className="w-[250px] min-w-[250px] max-w-[250px] overflow-y-auto overflow-x-hidden">
      <SidebarHeader>
        <div className="flex items-center gap-3 justify-center mt-3 px-4">
          <Image 
            src="/logo.svg" 
            alt="Company Logo" 
            width={40} 
            height={40} 
            priority 
          />
          <h2 className="font-bold text-2xl whitespace-nowrap text-ellipsis overflow-hidden">Flick AI</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupContent>
          <div className="px-5 mt-5">
            <Link href="/create-new-video">
              <Button className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                Create New Video
              </Button>
            </Link>
          </div>

          <SidebarMenu className="mt-5 px-5">
            {sidebarItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton isActive={path === item.url}>
                  <Link href={item.url} className='flex items-center gap-2 p-2 w-full text-sm text-gray-500 hover:bg-gray-100 rounded-md overflow-hidden'>
                    <item.icon className="text-gray-500 shrink-0" size={20} />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter className="px-5 py-3">
        <div className="p-5 border rounded-lg mb-6 text-gray-400 bg-gray-800">
          <div className="flex items-center justify-between">
            <Gem />
            <h2>{dbUser?.credits ?? 0} Credits Left</h2>
          </div>
          <Button className='w-full mt-5'>
            Buy More Credits
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
