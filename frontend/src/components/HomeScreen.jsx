import { useContext } from 'react';
import { Compass, ChefHat, Trees, CalendarDays, MapPin } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import useChat from '../hooks/useChat';
import CategoryCard from './CategoryCard';
import ChatInput from './ChatInput';
import ShinyText from './react-bits/ShinyText';
import Dock from './react-bits/Dock';
import BlurFade from './react-bits/BlurFade';

const HERO_IMAGES = {
  tokyo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&auto=format&fit=crop&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&auto=format&fit=crop&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&auto=format&fit=crop&q=80",
  newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&auto=format&fit=crop&q=80",
  lahore: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=1600&auto=format&fit=crop&q=80",
  karachi: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80",
  islamabad: "https://images.unsplash.com/photo-1595058788484-859871789ab6?w=1600&auto=format&fit=crop&q=80",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&auto=format&fit=crop&q=80",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&auto=format&fit=crop&q=80",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&auto=format&fit=crop&q=80"
};

export default function HomeScreen() {
  const { currentCity, setCurrentScreen, startNewSession } = useContext(AppContext);
  const { sendMessage, sendQuickRecommend } = useChat();

  const formattedCityKey = currentCity ? currentCity.toLowerCase().replace(/\s+/g, '') : "default";
  const heroImage = HERO_IMAGES[formattedCityKey] || HERO_IMAGES.default;

  const categories = [
    {
      title: "Discover Attractions",
      category: "attractions",
      description: "Explore famous historical spots, landmarks, and hidden local treasures.",
      icon: Compass,
      gradient: "from-teal-900 to-transparent",
      spotlightColor: "rgba(17, 122, 101, 0.18)"
    },
    {
      title: "Local Cuisine",
      category: "food",
      description: "Find signature regional dishes, food streets, and top rated restaurants.",
      icon: ChefHat,
      gradient: "from-amber-950 to-transparent",
      spotlightColor: "rgba(244, 208, 63, 0.18)"
    },
    {
      title: "Nature & Parks",
      category: "parks",
      description: "Find peaceful gardens, public beaches, hikes, and outdoor activities.",
      icon: Trees,
      gradient: "from-emerald-950 to-transparent",
      spotlightColor: "rgba(46, 204, 113, 0.18)"
    },
    {
      title: "Plan Itinerary",
      category: "itinerary",
      description: "Generate a fully optimized 1-day travel timeline with custom timeblocks.",
      icon: CalendarDays,
      gradient: "from-indigo-950 to-transparent",
      spotlightColor: "rgba(155, 89, 182, 0.18)"
    }
  ];

  const handleCustomInputSend = async (text) => {
    setCurrentScreen("chat");
    await sendMessage(text);
  };

  return (
    <BlurFade className="flex-1 flex flex-col min-h-screen relative pb-28 select-none">
      {/* 1. Hero Cover Image */}
      <div className="h-[40svh] sm:h-[45svh] w-full relative overflow-hidden">
        <img 
          src={heroImage} 
          alt={currentCity} 
          className="w-full h-full object-cover select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
        
        {/* Floating City Title in Hero */}
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-[10px] sm:text-xs font-bold text-accent-teal uppercase tracking-widest bg-accent-teal/10 border border-accent-teal/20 px-2 py-0.5 rounded-full select-none">
            Exploring Destination
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            <ShinyText text={currentCity || "Unknown City"} speed="4s" />
          </h2>
        </div>
      </div>

      {/* 2. Categories Scroll */}
      <div className="px-6 mt-6 flex-1 max-w-5xl mx-auto w-full">
        <h4 className="text-xs sm:text-sm font-bold text-text-secondary uppercase tracking-widest mb-4">
          Select recommendation category
        </h4>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 scroll-smooth select-none w-full">
          {categories.map((cat, idx) => (
            <div key={idx} className="min-w-[240px] sm:min-w-[280px] flex-1">
              <CategoryCard
                title={cat.title}
                description={cat.description}
                icon={cat.icon}
                gradient={cat.gradient}
                spotlightColor={cat.spotlightColor}
                onClick={() => sendQuickRecommend(cat.category)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Floating Bottom Actions */}
      <Dock>
        <button
          onClick={() => startNewSession()}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-accent-teal hover:text-accent-teal-light transition duration-200 shrink-0"
          title="Change location"
        >
          <MapPin size={15} />
        </button>
        <div className="w-px h-6 bg-[#252525]" />
        <ChatInput 
          onSend={handleCustomInputSend} 
          placeholder={`Ask about ${currentCity}...`}
        />
      </Dock>
    </BlurFade>
  );
}
