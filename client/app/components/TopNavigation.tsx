'use client'

import { Button } from '@/components/ui/button'
import {
  Sword,
  Crown,
  Trophy,
  Users,
  Palette,
  Plus,
  Coins,
  Gem,
  LucideIcon,
  Shield,
  User,
} from 'lucide-react'

// Define navigation items with their properties
type NavItem = {
  name: string
  icon: LucideIcon
  active?: boolean
}

interface TopNavigationProps {
  activeTab: string
  onTabChange: (tabName: string) => void
}

export default function TopNavigation({
  activeTab,
  onTabChange,
}: TopNavigationProps) {
  // Navigation items array
  const navItems: NavItem[] = [
    { name: 'Leaders', icon: Crown, active: activeTab === 'Leaders' },
    { name: 'Equipment', icon: Sword, active: activeTab === 'Equipment' },
    { name: 'Character', icon: User, active: activeTab === 'Character' },
    { name: 'Skins', icon: Palette, active: activeTab === 'Skins' },
    { name: 'Guilds', icon: Users, active: activeTab === 'Guilds' },
  ]

  return (
    <nav className="border-b border-blue-900/50 bg-slate-900/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Left side - Level and XP */}
        <div className="flex items-center">
          {/* Level Badge */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-yellow-500 flex items-center justify-center text-2xl font-bold shadow-lg z-20 transform translate-y-4">
              <span className="font-pixel text-white">1</span>
            </div>
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse translate-y-4"></div>
          </div>

          {/* Player Name and XP Bar */}
          <div className="ml-2 transform translate-y-4">
            <span className="font-pixel text-xl text-yellow-300 block mb-1">
              Guest
            </span>
            <div className="relative w-48 h-5">
              <div className="absolute top-0 left-0 w-full h-full bg-slate-800 border-2 border-slate-700 rounded-md"></div>
              <div className="absolute top-0 left-0 h-full w-1/5 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-l-sm"></div>
              <span className="absolute top-0 left-2 text-xs font-pixel text-white h-full flex items-center">
                0/0
              </span>
              <div className="absolute -right-6 -top-1 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center transform rotate-12 border-2 border-yellow-600">
                <span className="font-pixel text-xs text-slate-900">XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Navigation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          {navItems.map((item, index) => {
            const Icon = item.icon

            if (item.active) {
              return (
                <div key={index} className="relative mx-1">
                  <div className="nav-tab-active">
                    <Icon className="w-5 h-5 text-white mb-1" />
                    <span className="font-pixel text-sm text-white">
                      {item.name}
                    </span>
                  </div>
                </div>
              )
            }

            return (
              <Button
                key={index}
                variant="ghost"
                className="font-pixel text-sm text-gray-300 hover:text-white hover:bg-transparent"
                onClick={() => onTabChange(item.name)}
              >
                <Icon className="w-4 h-4 mr-1" />
                <span>{item.name}</span>
              </Button>
            )
          })}
        </div>

        {/* Right side - Currency */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-yellow-900/30 rounded-full px-3 py-1 border border-yellow-600">
            <Coins className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="font-pixel text-yellow-500">0</span>
            <Button
              variant="ghost"
              className="h-6 w-6 p-0 ml-1 text-yellow-400 hover:text-yellow-300"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
