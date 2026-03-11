import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({
  open,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--color-border-bright)] bg-[var(--color-bg-surface)] p-6 shadow-xl"
          >
            <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
            <p className="mb-6 text-sm text-[var(--color-text-secondary)]">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="rounded-lg border border-[var(--color-border-bright)] bg-transparent px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                  danger
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[var(--color-accent-cyan)] hover:opacity-90'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
