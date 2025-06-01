import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({isOpen,onClose,onConfirm,}) => {
  if (!isOpen) return null;
  return (
<div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">


      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
        <p className="text-sm text-gray-600 mt-2">Are you sure you want to delete this article? This action cannot be undone.</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-black transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
