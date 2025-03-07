'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UserCircle2, Settings, Coins } from 'lucide-react'
import TopNavigation from './components/TopNavigation'

export default function Home() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <TopNavigation />

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
