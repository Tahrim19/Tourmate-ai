import PlaceCard from './PlaceCard';
import ItineraryCard from './ItineraryCard';

export default function AIBubble({ message }) {
  const { parsedCards } = message;

  // Render markdown bold styling in text blocks safely
  const renderFormattedText = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-text-primary">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-6 select-text text-left max-w-full">
      {parsedCards && parsedCards.map((block, idx) => {
        // Standard text narrative
        if (block.type === 'text') {
          return (
            <div 
              key={idx} 
              className="text-text-secondary text-xs sm:text-sm leading-relaxed max-w-[90%] whitespace-pre-line"
            >
              {renderFormattedText(block.content)}
            </div>
          );
        }

        // Place categories card list (Discover, Eat, cafes, etc.)
        if (block.type === 'section') {
          return (
            <div key={idx} className="w-full space-y-4 my-2">
              <div className="flex items-center gap-2 pb-1 border-b border-[#252525] w-full">
                <span className="text-xs sm:text-sm font-bold text-accent-teal-light uppercase tracking-widest">
                  {block.title}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {block.items.map((item, itemIdx) => (
                  <PlaceCard 
                    key={itemIdx} 
                    item={item} 
                    category={block.category} 
                  />
                ))}
              </div>
            </div>
          );
        }

        // Detailed Timeline Itinerary Day
        if (block.type === 'itinerary_day') {
          return (
            <div key={idx} className="w-full my-3">
              <ItineraryCard block={block} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
