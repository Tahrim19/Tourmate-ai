export default function UserBubble({ message }) {
  return (
    <div className="flex justify-end mb-4 select-text">
      <div className="max-w-[85%] sm:max-w-[70%] bg-user-bubble text-white py-3 px-4 rounded-2xl rounded-tr-none shadow-md text-xs sm:text-sm leading-relaxed">
        {message.content}
      </div>
    </div>
  );
}
