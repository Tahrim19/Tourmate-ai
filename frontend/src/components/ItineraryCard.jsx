import { useState } from 'react';
import { GripVertical, Share2, Car, Lightbulb, Check } from 'lucide-react';
import TimelineBlock from './TimelineBlock';
import SpotlightCard from './react-bits/SpotlightCard';

export default function ItineraryCard({ block }) {
  const { day, theme, timeBlocks, transport, budget, tips } = block;
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    let copyText = `🗓️ Day ${day} — ${theme}\n\n`;
    
    timeBlocks.forEach(tb => {
      copyText += `${tb.emoji} ${tb.time} ${tb.details ? `(${tb.details})` : ''}\n`;
      tb.activities.forEach(act => {
        copyText += `- ${act}\n`;
      });
      copyText += `\n`;
    });
    
    if (transport) copyText += `🚗 Getting Around: ${transport}\n`;
    if (budget) copyText += `💰 Budget Estimate: ${budget}\n`;
    if (tips && tips.length > 0) {
      copyText += `💡 Tips:\n`;
      tips.forEach(t => {
        copyText += `- ${t}\n`;
      });
    }
    
    navigator.clipboard.writeText(copyText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Clipboard copy failed:", err);
      });
  };

  return (
    <SpotlightCard className="w-full max-w-xl mx-auto border border-[#252525] bg-bg-card p-6 rounded-2xl relative select-none">
      {/* Top Controls: Drag Grip & Share Trigger */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#303030] text-text-secondary hover:text-white transition duration-200"
          title="Copy day itinerary text"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
        </button>
        <div 
          className="p-2 rounded-xl bg-[#1a1a1a] border border-[#303030] text-text-secondary cursor-grab active:cursor-grabbing hover:bg-[#252525] transition"
          title="Drag to reorder (visual only)"
        >
          <GripVertical size={14} />
        </div>
      </div>

      {/* Day Header */}
      <div className="mb-6">
        <span className="text-xs font-bold text-accent-teal uppercase tracking-widest bg-accent-teal/10 px-2.5 py-1 rounded-full">
          Day {day}
        </span>
        <h3 className="text-lg sm:text-xl font-extrabold text-text-primary mt-2">
          {theme || "Explorer Itinerary"}
        </h3>
      </div>

      {/* Vertical Timeline Blocks */}
      <div className="space-y-1 pl-1">
        {timeBlocks && timeBlocks.map((tb, idx) => (
          <TimelineBlock 
            key={idx} 
            block={tb} 
            isLast={idx === timeBlocks.length - 1} 
          />
        ))}
      </div>

      {/* Transport & Budget Footer Badges */}
      {(transport || budget) && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#252525]">
          {transport && (
            <div className="flex items-start gap-2 bg-[#1a1a1a]/55 border border-[#252525] p-3 rounded-xl">
              <Car size={16} className="text-accent-teal mt-0.5 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Getting Around</h5>
                <p className="text-xs text-text-primary mt-0.5 leading-relaxed">{transport}</p>
              </div>
            </div>
          )}

          {budget && (
            <div className="flex items-start gap-2 bg-[#1a1a1a]/55 border border-[#252525] p-3 rounded-xl">
              <span className="text-accent-gold mt-0.5 font-bold shrink-0 text-sm">$$</span>
              <div>
                <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Budget Estimate</h5>
                <p className="text-xs text-text-primary mt-0.5 leading-relaxed">{budget}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Daily Practical Tips */}
      {tips && tips.length > 0 && (
        <div className="mt-3 bg-accent-teal/5 border border-accent-teal/10 rounded-xl p-3.5 flex items-start gap-2.5">
          <Lightbulb size={16} className="text-accent-gold mt-0.5 shrink-0" />
          <div className="flex-1">
            <h5 className="text-[11px] font-bold text-accent-gold uppercase tracking-wider">Visitor Tips</h5>
            <ul className="list-disc pl-3 text-xs text-text-secondary space-y-1 mt-1 leading-relaxed">
              {tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
