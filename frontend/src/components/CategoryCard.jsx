import TiltCard from './react-bits/TiltCard';
import SpotlightCard from './react-bits/SpotlightCard';

export default function CategoryCard({ title, description, icon: Icon, gradient, spotlightColor, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer h-full select-none">
      <TiltCard maxTilt={8} className="h-full">
        <SpotlightCard 
          spotlightColor={spotlightColor} 
          className="h-full flex flex-col items-start gap-4 p-5 sm:p-6 border border-[#252525] rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-[#353535]"
        >
          {/* Decorative Backing Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none`} />
          
          {/* Icon Container */}
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-primary shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Icon size={20} />
          </div>

          {/* Heading Description */}
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1 group-hover:text-text-primary/90">
              {title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {description}
            </p>
          </div>
        </SpotlightCard>
      </TiltCard>
    </div>
  );
}
