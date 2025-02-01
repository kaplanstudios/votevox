// components/ui/Textarea.js
const Textarea = ({ value, onChange, placeholder, className }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-[2px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default Textarea;
