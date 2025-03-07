'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Sword,
  Crown,
  Trophy,
  Users,
  Palette,
  UserCircle2,
  Settings,
  Plus,
  Coins,
  Gem,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <nav className="border-b border-blue-900/30 bg-blue-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <span className="font-pixel">Guest2748</span>
                <div className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded">
                  10/50
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>Leaders</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>XP Goals</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 bg-blue-600 text-white"
                >
                  <Sword className="w-4 h-4" />
                  <span>Battle</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Palette className="w-4 h-4" />
                  <span>Skins</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Friends</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-yellow-900/50 rounded-full px-3 py-1">
                  <Coins className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-pixel text-yellow-500">500</span>
                  <Button variant="ghost" className="h-6 w-6 p-0 ml-1">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center bg-blue-900/50 rounded-full px-3 py-1">
                  <Gem className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="font-pixel text-blue-400">50</span>
                  <Button variant="ghost" className="h-6 w-6 p-0 ml-1">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Season Progress */}
        <div className="max-w-4xl mx-auto mt-8 px-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-pixel mb-2">SEASON 39</h1>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <span>07d</span>
              <span>13h</span>
              <span>21m</span>
              <span>44s</span>
            </div>
          </div>

          <Progress value={33} className="h-4 bg-blue-900/50" />

          <div className="mt-4 bg-blue-900/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="font-pixel text-xl text-yellow-500">
                  SEASON PASS
                </div>
                <div className="flex space-x-4">
                  {[100, 300, 500, 700].map((points, i) => (
                    <div key={i} className="text-center">
                      <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-1">
                        <Coins className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="text-sm">{points}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Modes */}
        <div className="max-w-4xl mx-auto mt-8 px-4 grid grid-cols-4 gap-4">
          {[
            { title: 'PLAY SOLO', color: 'bg-blue-600', desc: 'BATTLE ROYALE' },
            {
              title: 'RANKED ROYALE',
              color: 'bg-yellow-600',
              desc: 'TROPHIES LEADERBOARD',
            },
            {
              title: 'SQUAD DEATHMATCH',
              color: 'bg-green-600',
              desc: '(6 Teams of 4)',
            },
            {
              title: 'CUSTOM MATCH',
              color: 'bg-purple-600',
              desc: 'PRIVATE LOBBY',
            },
          ].map((mode, i) => (
            <Button
              key={i}
              className={`${mode.color} h-40 flex flex-col items-center justify-center space-y-2 rounded-lg hover:brightness-110 transition-all`}
            >
              <div className="font-pixel text-lg">{mode.title}</div>
              <div className="text-sm opacity-80">{mode.desc}</div>
            </Button>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="fixed bottom-4 left-4">
          <Button
            variant="outline"
            className="bg-blue-900/50 border-blue-400/30"
          >
            <Settings className="w-4 h-4 mr-2" />
            SETTINGS
          </Button>
        </div>

        <div className="fixed bottom-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            className="bg-purple-900/50 border-purple-400/30"
          >
            <UserCircle2 className="w-4 h-4 mr-2" />
            LOG IN
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">SIGN UP</Button>
        </div>
      </div>
    </div>
  )
}
