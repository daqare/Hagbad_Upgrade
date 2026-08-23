import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Globe, Languages, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui';

export default function RegionSelectorModal({ onClose }) {
  const { state, dispatch, toast } = useApp();
  
  // Initialize with current state or defaults
  const [selectedRegion, setSelectedRegion] = useState(state.region || 'somalia');
  const [selectedLang, setSelectedLang] = useState(state.language || 'english');

  const regions = [
    { id: 'somalia', name: 'Somalia', flag: '🇴', currency: 'USD', symbol: '$' },
    { id: 'kenya', name: 'Kenya', flag: '🇰🇪', currency: 'KES', symbol: 'KSh' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
    { id: 'global', name: 'USA / Europe', flag: '🌍', currency: 'USD', symbol: '$' },
  ];

  const languages = [
    { id: 'english', name: 'English', flag: '🇧' },
    { id: 'somali', name: 'Soomaali', flag: '🇸🇴' },
  ];

  const handleSave = () => {
    const regionData = regions.find(r => r.id === selectedRegion);
    
    dispatch({ 
      type: 'SET_REGION_PREFERENCES', 
      payload: { 
        region: selectedRegion, 
        currency: regionData.currency,
        language: selectedLang 
      } 
    });
    
    toast('Preferences Saved!', `Region set to ${regionData.name} (${regionData.currency})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md bg-white dark:bg-forest-950 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-900 to-teal-900 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center">
              <Globe className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Region & Currency</h2>
              <p className="text-xs text-white/70">Customize your experience</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Region Selection */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-forest-900 dark:text-sand-50 flex items-center gap-2">
              <Globe className="h-4 w-4 text-gold-500" /> Select Your Region
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`p-3 rounded-xl border-2 text-center transition flex flex-col items-center gap-1 ${
                    selectedRegion === region.id 
                      ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' 
                      : 'border-forest-100 dark:border-white/10 hover:border-gold-300'
                  }`}
                >
                  <span className="text-2xl">{region.flag}</span>
                  <span className="text-xs font-bold text-forest-900 dark:text-sand-50">{region.name}</span>
                  <span className="text-[10px] text-forest-700/60 dark:text-sand-100/50">{region.currency}</span>
                  {selectedRegion === region.id && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-gold-500 grid place-items-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-forest-900 dark:text-sand-50 flex items-center gap-2">
              <Languages className="h-4 w-4 text-gold-500" /> Language
            </h3>
            <div className="flex gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`flex-1 p-3 rounded-xl border-2 text-center transition flex items-center justify-center gap-2 ${
                    selectedLang === lang.id 
                      ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' 
                      : 'border-forest-100 dark:border-white/10 hover:border-gold-300'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-bold text-forest-900 dark:text-sand-50">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Button variant="gold" size="lg" className="w-full" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
