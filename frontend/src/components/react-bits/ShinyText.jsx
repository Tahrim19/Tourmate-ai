export default function ShinyText({ text, className = "", disabled = false, speed = "3s" }) {
  const animatedStyle = disabled ? {} : {
    backgroundImage: 'linear-gradient(120deg, #f5f5f5 35%, #F4D03F 50%, #f5f5f5 65%)',
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `shimmer ${speed} linear infinite`,
  };

  return (
    <span
      style={animatedStyle}
      className={`inline-block ${className}`}
    >
      {text}
    </span>
  );
}
