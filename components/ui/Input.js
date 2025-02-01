const Input = ({ className = '', ...props }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <input
        className="bg-black text-white p-2 border border-gray-500 rounded-none focus:border-white outline-none"
        {...props}
      />
    </div>
  );
};

export default Input;
