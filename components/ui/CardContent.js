// components/ui/CardContent.js
const CardContent = ({ children, className }) => {
  return (
    <div className={`text-white p-4 ${className}`}>
      {children}
    </div>
  );
};

export default CardContent;
