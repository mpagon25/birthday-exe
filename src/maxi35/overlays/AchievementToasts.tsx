import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { Icon } from '../desktop/icons';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import styles from './Overlays.module.css';

function Toast({ k, title, desc, icon, onDone }: { k: number; title: string; desc: string; icon: string; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 6000);
    return () => window.clearTimeout(t);
  }, [onDone, k]);
  return (
    <div className={`bevel-out ${styles.toast} ${styles.toastGlow}`} onClick={onDone} role="status">
      <div className="win-title">
        <Icon name="trophy" size={16} />
        <span className="title-text">Achievement unlocked!</span>
      </div>
      <div className={styles.toastBody}>
        <span className={styles.toastIcon} aria-hidden>{icon}</span>
        <div>
          <div className={styles.toastTitle}>★ ACHIEVEMENT ★</div>
          <div className={styles.toastName}>{title}</div>
          <div className={styles.toastDesc}>{desc}</div>
        </div>
      </div>
    </div>
  );
}

export function AchievementToasts() {
  const ach = useAchievements();
  const reduced = useReducedMotion();
  return (
    <div className={styles.toasts}>
      <AnimatePresence>
        {ach.toasts.slice(0, 3).map((t) => (
          <motion.div
            key={t.key}
            initial={reduced ? false : { x: 400, rotate: 8, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <Toast k={t.key} title={t.def.title} desc={t.def.description} icon={t.def.icon} onDone={() => ach.dismissToast(t.key)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
