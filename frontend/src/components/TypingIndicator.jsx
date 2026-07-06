export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-bg-card border border-[#252525] w-fit shadow-md select-none">
      <span className="text-xs text-text-secondary mr-1 font-medium">TourMate is thinking</span>
      <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce-delay" />
      <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce-delay delay-100" />
      <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce-delay delay-200" />
    </div>
  );
}
