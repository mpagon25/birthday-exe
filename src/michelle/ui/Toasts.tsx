import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useReducedMotion } from '../../shared/hooks/useReducedMotion';
import { Sprite } from '../sprites/Sprite';
import styles from './UI.module.css';

function Toast({ k, title, desc, icon, xp, onDone }: { k: number; title: string; desc: string; icon: string; xp: number; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 6500);
    return () => window.clearTimeout(t);
  }, [onDone, k]);
  return (
    <div className={`pxbox ${styles.toast}`} onClick={onDone} role="status">
      <div className={styles.toastIcon}>
        <Sprite name={icon} scale={5} />
      </div>
      <div>
        <div className={styles.toastHead}>🏆 ACHIEVEMENT UNLOCKED!</div>
        <div className={styles.toastTitle}>{title}</div>
        <div className={styles.toastDesc}>{desc}</div>
        <div className={styles.toastXp}>+{xp} XP</div>
      </div>
    </div>
  );
}

export function Toasts() {
  const ach = useAchievements();
  const reduced = useReducedMotion();
  return (
    <div className={`${styles.toasts} no-print`}>
      <AnimatePresence>
        {ach.toasts.slice(0, 3).map((t) => (
          <motion.div key={t.key} initial={reduced ? false : { x: -400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -400, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 20 }}>
            <Toast k={t.key} title={t.def.title} desc={t.def.description} icon={t.def.icon} xp={t.def.xp ?? 0} onDone={() => ach.dismissToast(t.key)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
