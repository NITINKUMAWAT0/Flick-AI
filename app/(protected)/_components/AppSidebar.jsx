import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Home, LucideFileVideo, Search, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Items = [
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
    url: '/explore',  // Added missing slash
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
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 w-full justify-center mt-3">
          <Image 
            src="/logo.svg" 
            alt="Company Logo" 
            width={40} 
            height={40} 
            priority 
          />
          <h2 className="font-bold text-2xl">Flick AI</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupContent>
          <div className="mx-5 mt-5">
            <Button className="w-full">
              Create New Video
            </Button>
          </div>
          
          <SidebarMenu className="mt-5 mx-5">
            {Items.map((item, index) => (
              <SidebarMenuItem isActive={true} key={index}> 
                <Link href={item.url} className='flex items-center gap-2 p-2'>
                  <item.icon className="text-gray-500" size={20} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      
      <SidebarFooter>
        {/* Add footer content here if needed */}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;