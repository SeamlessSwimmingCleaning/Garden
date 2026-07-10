import React, { useState } from 'react';
import { getAllPlants } from '@/lib/plantData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock } from 'lucide-react';

function formatGrowthTime(hours) {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  if (hours < 168) return `${Math.round(hours / 24)}d`;
  return `${Math.round(hours / 168)}w`;
}

export default function PlantPicker({ open, onClose, coins, onSelect }) {
  const [search, setSearch] = useState('');
  const plants = getAllPlants()
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.cost - b.cost);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🌱 Choose a Seed
            <span className="text-sm font-normal text-amber-600 ml-auto">{coins}🪙</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="overflow-y-auto flex-1 space-y-1.5 pr-1">
          {plants.map(plant => (
            <button
              key={plant.name}
              disabled={coins < plant.cost}
              onClick={() => { onSelect(plant.name); onClose(false); }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-xl">{plant.phases[plant.phases.length - 1]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{plant.name}</p>
                <div className="flex gap-2 text-[10px] text-stone-400">
                  <span><Clock className="w-2.5 h-2.5 inline" /> {formatGrowthTime(plant.growthHours)}</span>
                  <span className="text-emerald-600">+{plant.reward}🪙</span>
                </div>
              </div>
              <span className="text-xs font-bold text-stone-600">{plant.cost}🪙</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
