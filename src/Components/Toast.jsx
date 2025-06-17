import { useEffect } from 'react';

const Toast = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-5 right-5 z-50 ${bgColor} text-white px-4 py-3 rounded shadow-lg transition`}>
      {message}
    </div>
  );
};

export default Toast;
