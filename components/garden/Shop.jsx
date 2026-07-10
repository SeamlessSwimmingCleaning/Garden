import React, { useState } from 'react';
import { getAllPlants, getLandCost } from '@/lib/plantData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Store, Clock, Coins, TreePine, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatGrowthTime(hours) {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  if (hours < 168) return `${Math.round(hours / 24)}d`;
  return `${Math.round(hours / 168)}w`;
}

export default function Shop({ open, onClose, coins, totalPlots, onBuySeed, onBuyLand }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('seeds');
  const plants = getAllPlants();
  const landCost = getLandCost(totalPlots);

  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.cost - b.cost);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        <SheetHeader className="p-5 pb-3 border-b bg-gradient-to-r from-emerald-50 to-amber-50">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Store className="w-5 h-5 text-emerald-600" />
            Garden Shop
          </SheetTitle>
          <div className="flex items-center gap-1.5 text-amber-700 font-bold text-sm">
            <Coins className="w-4 h-4" /> {coins} coins
          </div>
        </SheetHeader>

        <div className="p-4">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={tab === 'seeds' ? 'default' : 'outline'}
              onClick={() => setTab('seeds')}
              className="text-xs"
            >
              🌱 Seeds
            </Button>
            <Button
              size="sm"
              variant={tab === 'land' ? 'default' : 'outline'}
              onClick={() => setTab('land')}
              className="text-xs"
            >
              🟫 Land
            </Button>
          </div>

          {tab === 'seeds' && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  placeholder="Search plants..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {filtered.map((plant, i) => (
                    <motion.div
                      key={plant.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
                    >
                      <div className="text-2xl">{plant.phases[plant.phases.length - 1]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-stone-800">{plant.name}</p>
                        <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {formatGrowthTime(plant.growthHours)}
                          </span>
                          <span>💧 every {formatGrowthTime(plant.waterInterval)}</span>
                          <span className="text-emerald-600 font-medium">+{plant.reward}🪙</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={coins < plant.cost}
                        onClick={() => onBuySeed(plant.name)}
                        className="text-xs shrink-0"
                      >
                        {plant.cost}🪙
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {tab === 'land' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center">
                <div className="text-5xl mb-3">🏗️</div>
                <p className="font-bold text-stone-700">Buy New Plot</p>
                <p className="text-sm text-stone-500 mt-1">
                  You currently have {totalPlots} plots
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Each new plot costs more than the last
                </p>
                <Button
                  className="mt-4"
                  disabled={coins < landCost}
                  onClick={onBuyLand}
                >
                  <TreePine className="w-4 h-4 mr-1" />
                  Buy for {landCost}🪙
                </Button>
              </div>

              <div className="text-xs text-stone-400 text-center">
                Next plot after this will cost {getLandCost(totalPlots + 1)}🪙
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
