export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <button onClick={onClose} className="float-right text-gray-500 hover:text-black">×</button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
