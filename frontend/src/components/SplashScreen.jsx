// import { useState, useContext, useEffect, useRef } from 'react';
// import { MapPin, Compass, ArrowRight, Navigation, Loader2 } from 'lucide-react';
// import { AppContext } from '../context/AppContext';
// import TextReveal from './react-bits/TextReveal';
// import MagneticButton from './react-bits/MagneticButton';
// import BlurFade from './react-bits/BlurFade';

// const POPULAR_CITIES = [
//   "New York", "London", "Paris", "Tokyo", "Rome", "Lahore", "Karachi", 
//   "Islamabad", "Dubai", "Singapore", "Sydney", "Barcelona", "Istanbul", 
//   "Bangkok", "Amsterdam", "Cape Town", "Cairo", "Rio de Janeiro"
// ];

// export default function SplashScreen() {
//   const { currentCity, startNewSession } = useContext(AppContext);
//   const [cityInput, setCityInput] = useState(currentCity || "");
//   const [suggestions, setSuggestions] = useState([]);
//   const [geoLoading, setGeoLoading] = useState(false);
//   const [geoError, setGeoError] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter suggestion list as user types
//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     setCityInput(val);
//     setGeoError("");
//     if (val.trim().length > 0) {
//       const filtered = POPULAR_CITIES.filter(c => 
//         c.toLowerCase().includes(val.toLowerCase())
//       );
//       setSuggestions(filtered);
//       setShowDropdown(true);
//     } else {
//       setSuggestions([]);
//       setShowDropdown(false);
//     }
//   };

//   const handleSelectSuggestion = (city) => {
//     setCityInput(city);
//     setSuggestions([]);
//     setShowDropdown(false);
//     setGeoError("");
//   };

//   /**
//    * Try multiple CORS-friendly IP geolocation APIs in sequence.
//    * Returns the city name string or null if all fail.
//    */
//   const resolveIpCity = async () => {
//     const providers = [
//       {
//         url: "https://ipwho.is/",
//         extract: (d) => d.city,
//       },
//       {
//         url: "https://freeipapi.com/api/json",
//         extract: (d) => d.cityName,
//       },
//     ];

//     for (const provider of providers) {
//       try {
//         const res = await fetch(provider.url);
//         if (!res.ok) continue;
//         const data = await res.json();
//         const city = provider.extract(data);
//         if (city) return city;
//       } catch {
//         // Try next provider
//       }
//     }
//     return null;
//   };

//   // Browser Geolocation with multi-provider IP fallback
//   const handleUseLocation = async () => {
//     setGeoLoading(true);
//     setGeoError("");

//     // Try browser geolocation first with reverse-geocode via IP
//     // (Browser coords alone can't give us a city name without a geocoding API)
//     // So we always fall through to IP-based city resolution
//     try {
//       const city = await resolveIpCity();
//       if (city) {
//         setCityInput(city);
//         console.log(`[Geolocation] IP Geolocation resolved: ${city}`);
//       } else {
//         setGeoError("Could not detect your city. Please type it in below.");
//       }
//     } catch {
//       setGeoError("Location detection failed. Please type your city manually.");
//     } finally {
//       setGeoLoading(false);
//     }
//   };

//   const handleProceed = () => {
//     if (!cityInput.trim()) return;
//     startNewSession(cityInput.trim());
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleProceed();
//     }
//   };

//   return (
//     <BlurFade className="flex-1 w-full min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0B5345] flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
//       {/* Background Animated Accents */}
//       <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent-teal/10 blur-[120px] pointer-events-none" />
//       <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-teal/15 blur-[150px] pointer-events-none" />

//       <div className="max-w-md w-full text-center z-10 flex flex-col items-center">
//         {/* Pulsing Pin / Compass container */}
//         <div className="relative mb-8 w-20 h-20 flex items-center justify-center bg-black/35 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
//           <Compass className="text-accent-gold animate-[spin_20s_linear_infinite]" size={42} />
//           <div className="absolute -bottom-1.5 bg-accent-teal text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-[#0B5345] tracking-widest animate-pulse">
//             GPS LIVE
//           </div>
//         </div>

//         {/* Brand Header */}
//         <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
//           TourMate <span className="text-accent-gold">AI</span>
//         </h1>
        
//         {/* Reveal Intro text */}
//         <p className="text-text-secondary text-sm sm:text-base font-medium mb-12 h-6 overflow-hidden">
//           <TextReveal text="Where to next?" delay={0.2} />
//         </p>

//         {/* Input box */}
//         <div className="w-full relative mb-6" ref={dropdownRef}>
//           <div className="w-full bg-black/40 backdrop-blur-md border border-[#252525] focus-within:border-accent-teal rounded-2xl p-4 flex items-center gap-3 transition-all duration-300">
//             <MapPin className="text-accent-gold shrink-0" size={20} />
//             <input
//               type="text"
//               value={cityInput}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               placeholder="Enter destination (e.g., Kyoto, Rome)..."
//               className="bg-transparent border-0 text-white text-sm sm:text-base focus:outline-none w-full placeholder-text-secondary"
//             />
//             <button
//               onClick={handleUseLocation}
//               disabled={geoLoading}
//               className="p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition duration-200 shrink-0"
//               title="Use current location"
//             >
//               {geoLoading ? (
//                 <Loader2 size={16} className="animate-spin text-accent-teal" />
//               ) : (
//                 <Navigation size={16} />
//               )}
//             </button>
//           </div>

//           {/* Autocomplete Dropdown */}
//           {showDropdown && suggestions.length > 0 && (
//             <div className="absolute top-full left-0 right-0 mt-2 bg-[#161616] border border-[#252525] rounded-xl overflow-hidden shadow-2xl z-20 text-left">
//               {suggestions.map((city, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => handleSelectSuggestion(city)}
//                   className="py-3 px-4 hover:bg-accent-teal/15 hover:text-white text-text-secondary text-sm cursor-pointer transition duration-150 border-b border-white/5 last:border-b-0"
//                 >
//                   📍 <span className="font-semibold text-text-primary ml-1">{city}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Geolocation error inline toast */}
//         {geoError && (
//           <p className="text-red-400 text-xs text-center mb-4 animate-pulse">
//             {geoError}
//           </p>
//         )}

//         {/* Proceed Action Button */}
//         <MagneticButton
//           onClick={handleProceed}
//           disabled={!cityInput.trim()}
//           className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
//             cityInput.trim()
//               ? "bg-accent-teal text-white hover:bg-accent-teal-light shadow-[0_8px_30px_rgb(11,83,69,0.3)]"
//               : "bg-[#1f1f1f] text-text-secondary cursor-not-allowed"
//           }`}
//         >
//           Let's Explore
//           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//         </MagneticButton>
//       </div>
//     </BlurFade>
//   );
// }



import { useState, useContext, useEffect, useRef } from 'react';
import { MapPin, Compass, ArrowRight, Navigation, Loader2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import TextReveal from './react-bits/TextReveal';
import MagneticButton from './react-bits/MagneticButton';
import BlurFade from './react-bits/BlurFade';

const POPULAR_CITIES = [
  "New York", "London", "Paris", "Tokyo", "Rome", "Lahore", "Karachi", 
  "Islamabad", "Dubai", "Singapore", "Sydney", "Barcelona", "Istanbul", 
  "Bangkok", "Amsterdam", "Cape Town", "Cairo", "Rio de Janeiro"
];

export default function SplashScreen() {
  const { currentCity, startNewSession } = useContext(AppContext);
  const [cityInput, setCityInput] = useState(currentCity || "");
  const [suggestions, setSuggestions] = useState([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter suggestion list as user types
  const handleInputChange = (e) => {
    const val = e.target.value;
    setCityInput(val);
    setGeoError("");
    if (val.trim().length > 0) {
      const filtered = POPULAR_CITIES.filter(c => 
        c.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (city) => {
    setCityInput(city);
    setSuggestions([]);
    setShowDropdown(false);
    setGeoError("");
  };

  // // ✅ CORRECTED: Only browser geolocation. No IP fallback.
  // // If denied or unavailable, prompt user to type manually.
  // const handleUseLocation = () => {
  //   setGeoLoading(true);
  //   setGeoError("");

  //   if (!navigator.geolocation) {
  //     setGeoError("Geolocation not supported. Please type your destination city.");
  //     setGeoLoading(false);
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       // We have lat/lng but NO city name (no reverse geocoding API).
  //       // Just show a hint that user should type their city.
  //       setGeoLoading(false);
  //       setGeoError("Location detected! Please confirm your destination city above.");
  //     },
  //     (error) => {
  //       setGeoLoading(false);
  //       if (error.code === 1) {
  //         // Permission denied
  //         setGeoError("Location access denied. Please type your destination city.");
  //       } else {
  //         setGeoError("Could not detect location. Please type your destination city.");
  //       }
  //     },
  //     { timeout: 8000, enableHighAccuracy: false }
  //   );
  // };

  const handleUseLocation = () => {
    setGeoLoading(true);
    setGeoError("");

    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported. Please type your destination city.");
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // ✅ We have lat/lng but no city name (no reverse geocoding API)
        // Just tell user to type — we don't auto-fill anything
        setGeoLoading(false);
        setGeoError("Please type your destination city above.");
      },
      (error) => {
        setGeoLoading(false);
        // ✅ Any error (denied, timeout, unavailable) → same message
        setGeoError("Please type your destination city.");
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };

  const handleProceed = () => {
    if (!cityInput.trim()) return;
    startNewSession(cityInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleProceed();
    }
  };

  return (
    <BlurFade className="flex-1 w-full min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0B5345] flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
      {/* Background Animated Accents */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent-teal/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-teal/15 blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full text-center z-10 flex flex-col items-center">
        {/* Pulsing Pin / Compass container */}
        <div className="relative mb-8 w-20 h-20 flex items-center justify-center bg-black/35 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
          <Compass className="text-accent-gold animate-[spin_20s_linear_infinite]" size={42} />
          <div className="absolute -bottom-1.5 bg-accent-teal text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-[#0B5345] tracking-widest animate-pulse">
            GPS LIVE
          </div>
        </div>

        {/* Brand Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
          TourMate <span className="text-accent-gold">AI</span>
        </h1>
        
        {/* Reveal Intro text */}
        <p className="text-text-secondary text-sm sm:text-base font-medium mb-12 h-6 overflow-hidden">
          <TextReveal text="Where to next?" delay={0.2} />
        </p>

        {/* Input box */}
        <div className="w-full relative mb-6" ref={dropdownRef}>
          <div className="w-full bg-black/40 backdrop-blur-md border border-[#252525] focus-within:border-accent-teal rounded-2xl p-4 flex items-center gap-3 transition-all duration-300">
            <MapPin className="text-accent-gold shrink-0" size={20} />
            <input
              type="text"
              value={cityInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter destination (e.g., Kyoto, Rome)..."
              className="bg-transparent border-0 text-white text-sm sm:text-base focus:outline-none w-full placeholder-text-secondary"
            />
            <button
              onClick={handleUseLocation}
              disabled={geoLoading}
              className="p-2 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition duration-200 shrink-0"
              title="Use current location"
            >
              {geoLoading ? (
                <Loader2 size={16} className="animate-spin text-accent-teal" />
              ) : (
                <Navigation size={16} />
              )}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#161616] border border-[#252525] rounded-xl overflow-hidden shadow-2xl z-20 text-left">
              {suggestions.map((city, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(city)}
                  className="py-3 px-4 hover:bg-accent-teal/15 hover:text-white text-text-secondary text-sm cursor-pointer transition duration-150 border-b border-white/5 last:border-b-0"
                >
                  <span className="mr-2">📍</span>
                  <span className="font-semibold text-text-primary ml-1">{city}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Geolocation error / hint inline */}
        {geoError && (
          <p className="text-accent-gold/80 text-xs text-center mb-4 animate-pulse">
            {geoError}
          </p>
        )}

        {/* Proceed Action Button */}
        <MagneticButton
          onClick={handleProceed}
          disabled={!cityInput.trim()}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            cityInput.trim()
              ? "bg-accent-teal text-white hover:bg-accent-teal-light shadow-[0_8px_30px_rgb(11,83,69,0.3)]"
              : "bg-[#1f1f1f] text-text-secondary cursor-not-allowed"
          }`}
        >
          Let's Explore
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </MagneticButton>
      </div>
    </BlurFade>
  );
}