import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import MagneticButton from './react-bits/MagneticButton';

export default function ChatInput({ onSend, placeholder = "Ask about places, food, or details...", disabled = false }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2 pl-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-text-primary text-xs sm:text-sm focus:outline-none placeholder-text-secondary"
      />
      <MagneticButton
        type="submit"
        disabled={!value.trim() || disabled}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
          value.trim() && !disabled
            ? "bg-accent-teal hover:bg-accent-teal-light text-white shadow-md shadow-accent-teal/10"
            : "bg-[#202020] text-text-secondary cursor-not-allowed"
        }`}
      >
        <SendHorizonal size={14} />
      </MagneticButton>
    </form>
  );
}
