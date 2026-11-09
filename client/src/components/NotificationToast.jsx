import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export function NotificationToast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={20} color="var(--color-success)" />}
          {toast.type === 'error' && <AlertCircle size={20} color="var(--color-danger)" />}
          {toast.type === 'info' && <Info size={20} color="var(--color-fire-glow)" />}

          <div style={{ flexGrow: 1, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
            {toast.message}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            style={{ background: 'none', color: 'var(--color-text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

