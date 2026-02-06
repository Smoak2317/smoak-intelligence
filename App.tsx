
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { findBuyers } from './services/geminiService';
import { Buyer, SearchParams, ViewMode } from './types';
import SearchFilters from './components/SearchFilters';
import BuyerCard from './components/BuyerCard';
import BuyerTable from './components/BuyerTable';
import { BrandLogo, GridIcon, TableIcon, DownloadIcon, HeartIcon, DiamondIcon } from './components/Icons';

function App() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [savedBuyers, setSavedBuyers] = useState<Buyer[]>([]);
  const [marketInsight, setMarketInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [lastParams, setLastParams] = useState<SearchParams | null>(null);

  const loaderRef = useRef<HTMLDivElement>(null);

  // Load Saved Data
  useEffect(() => {
    const saved = localStorage.getItem('smoak_saved_partners');
    if (saved) {
      try {
        setSavedBuyers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved buyers", e);
      }
    }
  }, []);

  // Persist Data
  useEffect(() => {
    localStorage.setItem('smoak_saved_partners', JSON.stringify(savedBuyers));
  }, [savedBuyers]);

  const toggleSaveBuyer = (buyer: Buyer) => {
    setSavedBuyers(prev => {
      const exists = prev.find(b => b.name === buyer.name);
      if (exists) {
        return prev.filter(b => b.name !== buyer.name);
      } else {
        return [...prev, buyer];
      }
    });
  };

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    if (viewMode === 'saved') setViewMode('grid');
    
    setBuyers([]);
    setMarketInsight('');
    setLastParams(params);

    try {
      const result = await findBuyers(params);
      setBuyers(result.buyers);
      setMarketInsight(result.marketInsight);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching buyers.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!lastParams || loadingMore || loading || viewMode === 'saved') return;
    
    setLoadingMore(true);
    setError(null);

    try {
      const existingNames = buyers.map(b => b.name);
      const result = await findBuyers(lastParams, existingNames);
      const newBuyers = result.buyers.filter(newB => !existingNames.includes(newB.name));
      setBuyers(prev => [...prev, ...newBuyers]);
    } catch (err: any) {
      setError(err.message || 'Failed to load more buyers.');
    } finally {
      setLoadingMore(false);
    }
  }, [buyers, lastParams, loadingMore, loading, viewMode]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasSearched && !loading && !loadingMore && !error) {
        handleLoadMore();
      }
    }, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleLoadMore, hasSearched, loading, loadingMore, error]);

  const handleExport = () => {
    const dataToExport = viewMode === 'saved' ? savedBuyers : buyers;
    if (dataToExport.length === 0) return;
    
    const headers = ['Name', 'Location', 'Type', 'Contact Info', 'Website', 'Description', 'Specialty'];
    const rows = dataToExport.map(buyer => [
      `"${buyer.name.replace(/"/g, '""')}"`,
      `"${buyer.location.replace(/"/g, '""')}"`,
      `"${buyer.type.replace(/"/g, '""')}"`,
      `"${buyer.contactInfo.replace(/"/g, '""')}"`,
      `"${buyer.website.replace(/"/g, '""')}"`,
      `"${buyer.description.replace(/"/g, '""')}"`,
      `"${buyer.specialty.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'smoak_intelligence_partners.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeList = viewMode === 'saved' ? savedBuyers : buyers;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Clear Fixed Header / Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-4 sm:px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <BrandLogo className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none text-slate-900">Smoak</span>
            <span className="font-light text-xs tracking-[0.2em] uppercase text-indigo-600">Intelligence</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <span className="text-slate-900 cursor-pointer">Market Data</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Insights</span>
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Enterprise</span>
        </div>
        <div className="md:hidden">
          {/* Mobile menu placeholder */}
          <div className="w-8 h-8 rounded-full bg-slate-100"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-48 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[-10%] right-[10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-[20%] left-[40%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        {/* Hero Content Removed as requested */}
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        
        <SearchFilters onSearch={handleSearch} isLoading={loading} />

        <div className="max-w-7xl mx-auto py-20">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6 animate-fade-in-up">
            
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-slate-800 tracking-tight">
                {activeList.length}
              </span>
              <span className="text-slate-500 font-medium">
                {viewMode === 'saved' ? 'Saved Leads' : 'Partners Found'}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
                <button
                onClick={handleExport}
                disabled={activeList.length === 0}
                className="flex items-center px-6 py-2.5 bg-white text-slate-700 rounded-full text-sm font-semibold hover:bg-slate-50 hover:text-indigo-600 border border-slate-200 shadow-sm transition-all disabled:opacity-50"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export
              </button>

              <div className="bg-white p-1 rounded-full flex border border-slate-200 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Grid View"
                >
                  <GridIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Table View"
                >
                  <TableIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('saved')}
                  className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'saved' ? 'bg-pink-50 text-pink-500' : 'text-slate-400 hover:text-pink-400'}`}
                  title="Saved Partners"
                >
                  <HeartIcon className="w-5 h-5" filled={viewMode === 'saved'} />
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-6 mb-8 rounded-2xl animate-fade-in-up flex items-center gap-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Market Insight */}
          {marketInsight && !loading && viewMode !== 'saved' && buyers.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-8 mb-16 shadow-lg shadow-indigo-100/50 animate-fade-in-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                Market Intelligence
              </h3>
              <p className="text-slate-700 text-xl leading-relaxed font-serif italic relative z-10">"{marketInsight}"</p>
            </div>
          )}

          {/* Results Grid/Table */}
          {!loading && activeList.length > 0 && (
            <>
              {(viewMode === 'grid' || viewMode === 'saved') ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeList.map((buyer, index) => (
                    <div key={buyer.id || index} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <BuyerCard 
                        buyer={buyer} 
                        isSaved={savedBuyers.some(b => b.name === buyer.name)}
                        onToggleSave={toggleSaveBuyer}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  <BuyerTable buyers={activeList} />
                </div>
              )}
            </>
          )}

          {/* Loader */}
          {hasSearched && viewMode !== 'saved' && !error && (
            <div ref={loaderRef} className="py-24 flex flex-col items-center justify-center min-h-[150px]">
              {(loading || loadingMore) ? (
                 <div className="flex flex-col items-center gap-4">
                   <div className="relative w-12 h-12">
                     <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                     <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                   </div>
                   <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                     {loading ? "Analyzing Markets..." : "Loading More..."}
                   </p>
                 </div>
              ) : (
                <div className="h-1 w-24 bg-slate-100 rounded-full"></div>
              )}
            </div>
          )}

          {/* Empty States */}
          {!hasSearched && viewMode !== 'saved' && !loading && (
            <div className="text-center py-24 opacity-60 animate-fade-in-up">
              <div className="mx-auto h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <BrandLogo className="w-12 h-12 opacity-50" />
              </div>
              <h2 className="text-2xl font-light text-slate-400">Initialize search parameters.</h2>
            </div>
          )}

           {viewMode === 'saved' && savedBuyers.length === 0 && (
             <div className="text-center py-24 animate-fade-in-up">
               <div className="mx-auto h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                 <HeartIcon className="w-10 h-10 text-slate-300" />
               </div>
               <h2 className="text-2xl font-light text-slate-400">No saved leads yet.</h2>
               <p className="text-slate-400 mt-2">Click the heart icon on cards to save them here.</p>
             </div>
           )}

          {hasSearched && !loading && !error && buyers.length === 0 && viewMode !== 'saved' && (
            <div className="text-center py-24 animate-fade-in-up">
              <p className="text-slate-500 text-xl">No matching partners found in this market sector.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4 opacity-70">
             <BrandLogo className="w-6 h-6" />
             <div className="flex flex-col items-start">
               <span className="font-bold text-slate-900 text-xs tracking-wider">SMOAK</span>
               <span className="text-[10px] text-indigo-500 tracking-widest uppercase">Intelligence</span>
             </div>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Smoak Intelligence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
