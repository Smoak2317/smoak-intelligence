
import React, { useState } from 'react';
import { SearchParams, DiamondType, BuyerType, MarketTier } from '../types';
import { SearchIcon, GlobeIcon, DiamondIcon, StoreIcon, GridIcon } from './Icons'; // Re-using GridIcon as a generic icon for scale

interface SearchFiltersProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const TARGET_MARKETS = [
  "Worldwide", "Dubai, UAE", "New York, USA", "Surat, India", "Mumbai, India",
  "Antwerp, Belgium", "Hong Kong", "Tel Aviv, Israel", "London, UK", "Shanghai, China",
  "Tokyo, Japan", "Bangkok, Thailand", "Los Angeles, USA", "Toronto, Canada", "Geneva, Switzerland"
];

const COMMON_REQUIREMENTS = [
  "VVS Clarity", "VS Clarity", "SI Clarity", "I Clarity (Salt & Pepper)", "Melee / Small Diamonds",
  "Pointers (0.30 - 0.90 ct)", "1 Carat+ Solitaires", "5 Carat+ High Value", "Fancy Color Diamonds",
  "GIA/IGI Certified", "Non-Certified / Loose", "Rough Diamonds", "Lab-Grown CVD", "Lab-Grown HPHT",
  "Tennis Bracelet Layouts", "Oval / Pear / Emerald Shapes"
];

const QUICK_SEARCHES = [
  { label: "Dubai Wholesalers", params: { location: "Dubai, UAE", buyerType: BuyerType.WHOLESALER, diamondType: DiamondType.NATURAL, marketTier: MarketTier.COMMERCIAL, keywords: "Certified Lots" } },
  { label: "NYC Retailers", params: { location: "New York, USA", buyerType: BuyerType.RETAILER, diamondType: DiamondType.BOTH, marketTier: MarketTier.LUXURY, keywords: "Fine Jewelry" } },
  { label: "Surat Mfrs", params: { location: "Surat, India", buyerType: BuyerType.MANUFACTURER, diamondType: DiamondType.NATURAL, marketTier: MarketTier.ANY, keywords: "Rough & Polished" } },
  { label: "LGD Traders", params: { location: "Worldwide", buyerType: BuyerType.WHOLESALER, diamondType: DiamondType.LAB_GROWN, marketTier: MarketTier.ANY, keywords: "CVD/HPHT" } },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState('');
  const [diamondType, setDiamondType] = useState<DiamondType>(DiamondType.BOTH);
  const [buyerType, setBuyerType] = useState<BuyerType>(BuyerType.ALL);
  const [marketTier, setMarketTier] = useState<MarketTier>(MarketTier.ANY);
  const [keywords, setKeywords] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location: location || "Worldwide", diamondType, buyerType, marketTier, keywords });
  };

  const handleQuickSearch = (qs: typeof QUICK_SEARCHES[0]) => {
    setLocation(qs.params.location);
    setDiamondType(qs.params.diamondType);
    setBuyerType(qs.params.buyerType);
    setMarketTier(qs.params.marketTier);
    setKeywords(qs.params.keywords);
    onSearch(qs.params);
  };

  return (
    <div className="glass rounded-[2rem] p-8 -mt-24 relative z-30 animate-fade-in-up">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Diamond Type */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Type</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
              <DiamondIcon className="h-5 w-5" />
            </div>
            <select
              value={diamondType}
              onChange={(e) => setDiamondType(e.target.value as DiamondType)}
              className="block w-full pl-12 pr-4 py-4 bg-white/50 hover:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-sm font-medium text-slate-700 transition-all appearance-none cursor-pointer outline-none"
            >
              {Object.values(DiamondType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buyer Type */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
              <StoreIcon className="h-5 w-5" />
            </div>
            <select
              value={buyerType}
              onChange={(e) => setBuyerType(e.target.value as BuyerType)}
              className="block w-full pl-12 pr-4 py-4 bg-white/50 hover:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-sm font-medium text-slate-700 transition-all appearance-none cursor-pointer outline-none"
            >
              {Object.values(BuyerType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Market Tier - NEW FEATURE */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Scale</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
              <GridIcon className="h-5 w-5" />
            </div>
            <select
              value={marketTier}
              onChange={(e) => setMarketTier(e.target.value as MarketTier)}
              className="block w-full pl-12 pr-4 py-4 bg-white/50 hover:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-sm font-medium text-slate-700 transition-all appearance-none cursor-pointer outline-none"
            >
              {Object.values(MarketTier).map((tier) => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Market</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
              <GlobeIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              list="market-suggestions"
              placeholder="City or Region"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-white/50 hover:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-sm font-medium text-slate-700 transition-all placeholder:text-slate-400 outline-none"
            />
            <datalist id="market-suggestions">
              {TARGET_MARKETS.map((market) => <option key={market} value={market} />)}
            </datalist>
          </div>
        </div>

        {/* Keywords */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Specs</label>
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              list="requirement-suggestions"
              placeholder="e.g. VVS"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-white/50 hover:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl text-sm font-medium text-slate-700 transition-all placeholder:text-slate-400 outline-none"
            />
            <datalist id="requirement-suggestions">
              {COMMON_REQUIREMENTS.map((req) => <option key={req} value={req} />)}
            </datalist>
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-12 flex items-center justify-center mt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto min-w-[300px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="text-lg">Find Partners</span>
            )}
          </button>
        </div>
      </form>

      {/* Quick Chips */}
      <div className="mt-8 flex flex-wrap gap-3 items-center justify-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Quick:</span>
        {QUICK_SEARCHES.map((qs, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickSearch(qs)}
            disabled={isLoading}
            className="text-xs font-semibold px-4 py-2 rounded-full bg-white/60 border border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            {qs.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilters;
