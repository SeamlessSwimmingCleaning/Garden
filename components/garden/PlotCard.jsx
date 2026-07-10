import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Sprout, Skull, Scissors, Sparkles } from 'lucide-react';
import { getGrowthProgress, getWaterStatus, getPlantData, formatTimeRemaining } from '@/lib/plantData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function PlotCard({ plot, onWater, onHarvest, onClear, onPlant, tick }) {
  const isEmpty = !plot.plant_type;
  const isDead = plot.is_dead;

  if (isEmpty) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition-colors hover:bg-amber-100"
        onClick={onPlant}
      >
        <div className="text-4xl mb-2">🟫</div>
        <p className="text-amber-700 font-medium text-sm">Empty Plot</p>
        <p className="text-amber-500 text-xs mt-1">Tap to plant</p>
      </motion.div>
    );
  }

  if (isDead) {
    return (
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative bg-stone-100 border-2 border-stone-300 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[200px]"
      >
        <div className="text-4xl mb-1 grayscale opacity-60">🥀</div>
        <p className="text-stone-500 font-medium text-sm">{plot.plant_type}</p>
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <Skull className="w-3 h-3" /> Died — not watered
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-3 text-xs"
          onClick={onClear}
        >
          <Scissors className="w-3 h-3 mr-1" /> Clear Plot
        </Button>
      </motion.div>
    );
  }

  const plant = getPlantData(plot.plant_type);
  const { phaseIndex, progress, isReady, currentEmoji } = getGrowthProgress(plot.plant_type, plot.planted_at);
  const { needsWater, waterLevel } = getWaterStatus(plot.plant_type, plot.last_watered_at);
  const timeLeft = formatTimeRemaining(plot.plant_type, plot.planted_at);

  return (
    <motion.div
      layout
      className={`relative border-2 rounded-2xl p-4 flex flex-col items-center min-h-[200px] transition-all ${
        isReady
          ? 'bg-emerald-50 border-emerald-400 shadow-lg shadow-emerald-100'
          : needsWater
          ? 'bg-orange-50 border-orange-300'
          : 'bg-green-50 border-green-200'
      }`}
    >
      {/* Water warning */}
      {needsWater && !isReady && (
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs px-2 py-0.5 rounded-full font-bold"
        >
          💧 Thirsty!
        </motion.div>
      )}

      {isReady && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold"
        >
          <Sparkles className="w-3 h-3 inline mr-0.5" /> Ready!
        </motion.div>
      )}

      {/* Plant emoji */}
      <motion.div
        key={phaseIndex}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-5xl mb-2"
      >
        {currentEmoji}
      </motion.div>

      <p className="font-semibold text-sm text-stone-700">{plot.plant_type}</p>

      {/* Phase dots */}
      <div className="flex gap-1 my-2">
        {plant.phases.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i <= phaseIndex ? 'bg-emerald-500' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>

      {/* Growth progress */}
      <div className="w-full mb-2">
        <Progress value={progress * 100} className="h-1.5" />
        <p className="text-[10px] text-stone-400 mt-1 text-center">{timeLeft}</p>
      </div>

      {/* Water level */}
      {!isReady && (
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
          <Droplets className={`w-3 h-3 ${needsWater ? 'text-orange-400' : 'text-blue-400'}`} />
          <div className="w-16 h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${needsWater ? 'bg-orange-400' : 'bg-blue-400'}`}
              style={{ width: `${waterLevel * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {isReady ? (
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            onClick={onHarvest}
          >
            <Sparkles className="w-3 h-3 mr-1" /> Harvest +{plant.reward}🪙
          </Button>
        ) : (
          <Button
            size="sm"
            variant={needsWater ? "default" : "outline"}
            className={`text-xs ${needsWater ? 'bg-blue-500 hover:bg-blue-600 text-white animate-pulse' : ''}`}
            onClick={onWater}
          >
            <Droplets className="w-3 h-3 mr-1" /> Water
          </Button>
        )}
      </div>
    </motion.div>
  );
}
