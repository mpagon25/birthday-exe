import { navigate } from './Router';
import styles from './Landing.module.css';

export function Landing() {
  return (
    <main className={styles.page}>
      <a className={styles.btn} href="/maxi35" onClick={(e) => navigate(e, '/maxi35')}>
        zu "maxi35"
      </a>
      <a className={styles.btn} href="/michelle33" onClick={(e) => navigate(e, '/michelle33')}>
        zu "michelle33"
      </a>
    </main>
  );
}
