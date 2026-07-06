const DEFAULT_CHIPS = [
  { label: "🏛️ Top attractions", query: "Show me the top attractions" },
  { label: "🍜 Best local food", query: "What is the best local food here?" },
  { label: "🗓️ Plan my day", query: "Create a 1-day itinerary for me" },
  { label: "🌳 Nature & Parks", query: "Where are the best nature spots?" },
  { label: "💎 Hidden gems", query: "Are there any hidden gems to visit?" },
];

export default function SuggestionChips({ onChipClick }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 w-full select-none shrink-0">
      {DEFAULT_CHIPS.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onChipClick(chip.query)}
          className="whitespace-nowrap bg-[#1a1a1a]/80 hover:bg-[#252525] border border-[#2e2e2e] hover:border-accent-teal/40 text-text-secondary hover:text-text-primary text-xs py-2 px-3.5 rounded-full transition duration-200 shrink-0"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
