import { useEffect, useRef, type ReactNode } from 'react';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './UI.module.css';

export function PxButton({
  children,
  onClick,
  variant = '',
  className = '',
  disabled,
  title,
  autoFocus,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: '' | 'gold' | 'ghost';
  className?: string;
  disabled?: boolean;
  title?: string;
  autoFocus?: boolean;
  type?: 'button' | 'submit';
}) {
  const audio = useAudio();
  return (
    <button
      type={type}
      className={`pxbtn ${variant} ${className}`}
      disabled={disabled}
      title={title}
      autoFocus={autoFocus}
      onMouseEnter={() => audio.play('hover')}
      onClick={() => {
        audio.play('click');
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

export function Modal({ title, onClose, children, width = 720, noClose }: { title: string; onClose: () => void; children: ReactNode; width?: number; noClose?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !noClose) {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    ref.current?.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, noClose]);
  return (
    <div className={styles.modalBackdrop} onPointerDown={(e) => e.target === e.currentTarget && !noClose && onClose()}>
      <div ref={ref} className={`pxbox ${styles.modal}`} style={{ ['--mw' as string]: `${width}px` }} role="dialog" aria-label={title} tabIndex={-1}>
        <div className={styles.modalHead}>
          <span className="pxtitle">{title}</span>
          {!noClose && (
            <PxButton className={`${styles.modalClose} no-print`} variant="ghost" onClick={onClose} title="Schließen (Esc)">
              ✕
            </PxButton>
          )}
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

export function PxBar({ value, max, variant = '' }: { value: number; max: number; variant?: '' | 'gold' | 'green' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`pxbar ${variant}`} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}
