
import React, { useState } from 'react';
import { Buyer } from '../types';
import { ExternalLinkIcon, PhoneIcon, WhatsAppIcon, GlobeIcon, HeartIcon, SendIcon, CopyIcon, CloseIcon } from './Icons';

interface BuyerCardProps {
  buyer: Buyer;
  isSaved: boolean;
  onToggleSave: (buyer: Buyer) => void;
}

const BuyerCard: React.FC<BuyerCardProps> = ({ buyer, isSaved, onToggleSave }) => {
  const [showPitch, setShowPitch] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPhoneNumber = (str: string) => /[\d\+\-\(\)\s]{7,}/.test(str);
  const cleanPhone = buyer.contactInfo.replace(/[^\d+]/g, '');
  const waLink = isPhoneNumber(buyer.contactInfo) 
    ? `https://wa.me/${cleanPhone}` 
    : null;

  // Smart Pitch Generation Logic
  const generatePitch = () => {
    const greeting = `Hi ${buyer.name} Team,`;
    const core = `I came across your profile and noticed your focus on ${buyer.specialty || buyer.type}.`;
    const valueProp = `We specialize in sourcing high-quality diamonds that match these exact specifications.`;
    const cta = `Would you be open to viewing our current collection?`;
    
    return `${greeting}\n\n${core} ${valueProp} ${cta}`;
  };

  const pitchText = generatePitch();

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-3xl p-6 h-full flex flex-col justify-between border border-slate-100 hover-lift overflow-hidden transition-all">
      
      {/* Decorative gradient blur on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100 duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header: Type Badge & Save Button */}
        <div className="flex justify-between items-start mb-5">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold uppercase tracking-wider">
            {buyer.type}
          </span>
          <div className="flex gap-2">
            {buyer.website && (
              <a 
                href={buyer.website.startsWith('http') ? buyer.website : `https://${buyer.website}`}
                target="_blank" 
                rel="noreferrer"
                className="text-slate-300 hover:text-indigo-600 transition-colors p-1"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            )}
            <button 
              onClick={() => onToggleSave(buyer)}
              className={`p-1 transition-all ${isSaved ? 'text-pink-500 scale-110' : 'text-slate-300 hover:text-pink-400'}`}
            >
              <HeartIcon className="w-5 h-5" filled={isSaved} />
            </button>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 tracking-tight group-hover:text-indigo-900 transition-colors">
          {buyer.name}
        </h3>
        
        <div className="flex items-center text-slate-500 text-sm mb-4 font-medium">
          <GlobeIcon className="w-4 h-4 mr-2 text-indigo-400" />
          {buyer.location}
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-6 font-normal leading-relaxed">
          {buyer.description}
        </p>
      </div>

      {/* Smart Pitch Modal Overlay (Inside Card) */}
      {showPitch && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-6 flex flex-col animate-fade-in-up">
           <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Smart Draft</span>
              <button onClick={() => setShowPitch(false)} className="text-slate-400 hover:text-slate-600">
                <CloseIcon className="w-5 h-5" />
              </button>
           </div>
           <textarea 
             readOnly
             className="flex-grow w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-600 resize-none focus:outline-none mb-4"
             value={pitchText}
           />
           <button 
             onClick={handleCopy}
             className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
           >
             {copied ? (
               <>Copied!</>
             ) : (
               <><CopyIcon className="w-4 h-4" /> Copy Draft</>
             )}
           </button>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 relative z-10 mt-auto">
        <div className="flex gap-2">
           <button
             onClick={() => setShowPitch(true)}
             className="flex-1 bg-slate-900 text-white px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
           >
             <SendIcon className="w-3 h-3" />
             Draft Intro
           </button>
        </div>

        {buyer.contactInfo && (
          <div className="flex gap-2 pt-2 border-t border-slate-50">
            <a 
              href={`tel:${buyer.contactInfo}`}
              className="flex-1 flex items-center justify-center text-slate-500 hover:text-indigo-600 py-2 rounded-xl text-xs font-medium transition-all"
            >
              <PhoneIcon className="w-3.5 h-3.5 mr-2" />
              <span className="truncate max-w-[100px]">{buyer.contactInfo}</span>
            </a>
            
            {waLink && (
              <a 
                href={waLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerCard;
