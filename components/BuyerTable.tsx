import React from 'react';
import { Buyer } from '../types';
import { ExternalLinkIcon, PhoneIcon, WhatsAppIcon, GlobeIcon } from './Icons';

interface BuyerTableProps {
  buyers: Buyer[];
}

const BuyerTable: React.FC<BuyerTableProps> = ({ buyers }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
              <th scope="col" className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
              <th scope="col" className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
              <th scope="col" className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
              <th scope="col" className="px-6 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {buyers.map((buyer, index) => {
              const isPhoneNumber = (str: string) => /[\d\+\-\(\)\s]{7,}/.test(str);
              const cleanPhone = buyer.contactInfo.replace(/[^\d+]/g, '');
              const waLink = isPhoneNumber(buyer.contactInfo) 
                ? `https://wa.me/${cleanPhone}` 
                : null;

              return (
                <tr key={index} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-slate-800">{buyer.name}</span>
                      {buyer.website && (
                         <a href={buyer.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-600 hover:underline transition-colors mt-0.5 inline-flex items-center">
                           {buyer.website.replace('https://', '').replace('http://', '').split('/')[0]}
                         </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <GlobeIcon className="w-4 h-4 mr-2 text-indigo-400" />
                      {buyer.location}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {buyer.contactInfo ? (
                       <a href={`tel:${buyer.contactInfo}`} className="flex items-center text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all">
                         <PhoneIcon className="w-4 h-4 mr-2 text-slate-300" />
                         {buyer.contactInfo}
                       </a>
                    ) : (
                      <span className="text-sm text-slate-300 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {buyer.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                     {waLink && (
                      <a 
                        href={waLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-500 hover:text-white transition-all border border-green-100"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyerTable;