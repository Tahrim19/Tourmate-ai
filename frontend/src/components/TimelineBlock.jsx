
export default function TimelineBlock({ block, isLast }) {
  const { time, emoji, details, activities } = block;

  return (
    <div className="relative pl-8 pb-6 group">
      {/* Timeline Indicator Connector */}
      {!isLast && <div className="absolute left-[15px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-accent-teal/50 to-[#252525]" />}
      
      {/* Timeline Node Icon */}
      <div className="absolute left-1.5 top-1.5 w-6 h-6 rounded-full bg-[#1a1a1a] border border-accent-teal flex items-center justify-center text-xs group-hover:scale-110 transition duration-300">
        <span>{emoji}</span>
      </div>

      {/* TimeBlock Content Card */}
      <div className="bg-bg-card/50 border border-[#252525] rounded-xl p-4 hover:border-accent-teal/30 transition duration-200">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
          <h4 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-1.5">
            {time}
          </h4>
          {details && (
            <span className="text-[11px] font-semibold text-accent-gold/90 bg-accent-gold/5 px-2 py-0.5 rounded-lg border border-accent-gold/10">
              {details}
            </span>
          )}
        </div>

        {/* Activities List */}
        {activities && activities.length > 0 ? (
          <ul className="space-y-1.5">
            {activities.map((act, index) => (
              <li key={index} className="text-xs sm:text-sm text-text-secondary flex items-start gap-2">
                <span className="text-accent-teal mt-1.5 shrink-0 select-none">•</span>
                <span className="leading-relaxed">{act}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-text-secondary italic">No planned activities for this period.</p>
        )}
      </div>
    </div>
  );
}
