import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass } from '@fortawesome/free-solid-svg-icons';

const GlobalSpinner = ({ isLoading }) => {
  if (!isLoading) return null; // Don't render the spinner if it's not loading

  return (
    <div className="fixed bottom-4 right-4 flex justify-center items-center p-4 bg-gray-800 bg-opacity-75 rounded-full">
      <FontAwesomeIcon icon={faHourglass} spin size="2x" className="text-white" />
    </div>
  );
};

export default GlobalSpinner;
