import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader() {
  return (
    <div className='flex p-3 justify-between items-center'>
        <SidebarTrigger/>
        <UserButton/>
    </div>
  )
}

export default AppHeader
