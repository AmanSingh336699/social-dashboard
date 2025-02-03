import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdClose } from "react-icons/md";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md"
      ariaHideApp={false}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg relative border-2 border-red-500"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
            >
              <MdClose size={22} />
            </button>

            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex justify-center"
            >
              <FaExclamationTriangle className="text-red-500 text-4xl sm:text-5xl" />
            </motion.div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-center text-gray-900 dark:text-gray-100 mt-3">
              Delete Repository?
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-center mt-2 text-sm sm:text-base">
              This action <span className="font-semibold text-red-500">cannot</span> be undo. Are you sure you want to delete this repository?
            </p>

            <div className="flex justify-center mt-5 space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition sm:px-5 sm:py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition sm:px-5 sm:py-2.5"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default ConfirmModal;
