import React from 'react';
import { Coins, Store, Leaf, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function Header({ coins, plantsHarvested, onOpenShop }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌻</span>
          <h1 className="font-heading font-bold text-lg text-stone-800 tracking-tight">My Garden</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-sm">
            <motion.div
              key={coins}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold text-amber-700">{coins}</span>
            </motion.div>

            <div className="hidden sm:flex items-center gap-1 text-stone-400 text-xs">
              <Leaf className="w-3 h-3" />
              <span>{plantsHarvested} harvested</span>
            </div>
          </div>

          <Button size="sm" onClick={onOpenShop} className="gap-1.5">
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Shop</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => base44.auth.logout('/')}
            className="text-stone-400 hover:text-stone-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
