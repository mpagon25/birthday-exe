import { useEffect, useRef } from 'react';
import type { AppComponentProps, MsgButton, MsgIcon } from './types';
import { Icon } from './icons';
import { useAudio } from '../../shared/audio/AudioContext';
import styles from './MessageBox.module.css';

export function MessageBox({ close, props }: AppComponentProps) {
  const audio = useAudio();
  const text = props.text as string | string[];
  const icon = (props.icon as MsgIcon | undefined) ?? 'info';
  const buttons = (props.buttons as MsgButton[] | undefined) ?? [{ label: 'OK', primary: true }];
  const lines = Array.isArray(text) ? text : [text];
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    first.current?.focus();
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.content}>
        {icon !== 'none' && (
          <div className={styles.icon}>
            <Icon name={icon} size={32} />
          </div>
        )}
        <div className={styles.text}>
          {lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      </div>
      <div className={styles.buttons}>
        {buttons.map((b, i) => (
          <button
            key={i}
            ref={i === 0 ? first : undefined}
            className={`btn ${b.primary || i === 0 ? 'primary' : ''}`}
            onClick={() => {
              audio.play('click');
              close();
              b.onClick?.();
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
