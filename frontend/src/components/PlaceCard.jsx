import { Star, MapPin, Compass } from 'lucide-react';
import SpotlightCard from './react-bits/SpotlightCard';
import TiltCard from './react-bits/TiltCard';

const CATEGORY_IMAGES = {
  attractions: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80",
  parks: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
  malls: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
  gems: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&auto=format&fit=crop&q=80",
  dishes: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
  restaurants: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
  street_food: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
  cafes: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
  tips: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80",
};

export default function PlaceCard({ item, category }) {
  const { name, rating, description, address } = item;
  
  // Choose beautiful fallback image based on section category
  const imageSrc = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.attractions;

  return (
    <TiltCard maxTilt={6} className="w-full">
      <SpotlightCard className="h-full flex flex-col p-0 overflow-hidden select-none">
        {/* Cover Photo */}
        <div className="h-44 w-full relative overflow-hidden">
          <img 
            src={imageSrc} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/30 to-transparent" />
          
          {/* Compass Icon Float */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 text-accent-gold">
            <Compass size={16} />
          </div>
        </div>

        {/* Contents */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-text-primary text-base sm:text-lg group-hover:text-accent-gold transition-colors duration-300">
                {name}
              </h3>

              {/* Rating representation - handles missing rating gracefully */}
              {rating && rating !== "⭐" && (
                <div className="flex items-center gap-1 bg-accent-gold/10 text-accent-gold text-xs font-semibold px-2 py-0.5 rounded-lg border border-accent-gold/20 shrink-0">
                  <Star size={11} className="fill-accent-gold text-accent-gold" />
                  <span>{rating}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">
              {description}
            </p>
          </div>

          {/* Address footer */}
          {address && (
            <div className="flex items-start gap-1.5 pt-3 border-t border-[#252525] text-text-secondary">
              <MapPin size={13} className="text-accent-teal shrink-0 mt-0.5" />
              <span className="text-[11px] sm:text-xs truncate" title={address}>
                {address}
              </span>
            </div>
          )}
        </div>
      </SpotlightCard>
    </TiltCard>
  );
}
