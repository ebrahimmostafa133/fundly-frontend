/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading,
  title,
  message,
  confirmText = 'yes',
  cancelText = 'no',
  isDanger = false
}: any) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 ${isDanger ? 'bg-error-500 hover:bg-error-600' : 'bg-primary-500 hover:bg-primary-600'}`}
          >
            {loading ? 'waiting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
