import { useEffect, useMemo, useState } from 'react';
import type { AppComponentProps } from '../desktop/types';
import { QUIZ_QUESTIONS, QUIZ_RATING } from '../content/texts';
import { useAchievements } from '../../shared/achievements/AchievementsContext';
import { useGameState } from '../state/GameState';
import { useAudio } from '../../shared/audio/AudioContext';
import { useActions } from '../state/ActionsContext';
import { useInterval } from '../../shared/hooks/useInterval';
import styles from './Apps.module.css';

const ROUND = 10;
const TIME = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PubQuiz({ close }: AppComponentProps) {
  const ach = useAchievements();
  const game = useGameState();
  const audio = useAudio();
  const a = useActions();
  const [questions, setQuestions] = useState(() => shuffle(QUIZ_QUESTIONS).slice(0, ROUND));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(TIME);
  const [state, setState] = useState<'idle' | 'play' | 'done'>('idle');
  const q = questions[index];
  const finishedAll = index >= ROUND;

  useInterval(() => setTime((t) => t - 1), 1000, state === 'play' && picked === null);

  useEffect(() => {
    if (state === 'play' && picked === null && time <= 0) {
      audio.play('error');
      setPicked(-1);
    }
  }, [time, state, picked, audio]);

  const start = () => {
    setQuestions(shuffle(QUIZ_QUESTIONS).slice(0, ROUND));
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setScore(0);
    setTime(TIME);
    setState('play');
    audio.play('arcade');
  };

  const pick = (i: number) => {
    if (picked !== null || state !== 'play') return;
    setPicked(i);
    if (i === q.correct) {
      audio.play('coin');
      setCorrect((c) => c + 1);
      setScore((s) => s + 10 + Math.max(0, time));
    } else audio.play('error');
  };

  const next = () => {
    const ni = index + 1;
    if (ni >= ROUND) {
      setState('done');
      setIndex(ni);
      audio.play(correct >= 8 ? 'fanfare' : 'gameover');
      if (correct > game.data.quizBest) game.set('quizBest', correct);
      if (correct >= 8) {
        ach.unlock('quizmaster');
        game.collect('diploma');
        a.confetti({ count: 80 });
      }
      return;
    }
    setIndex(ni);
    setPicked(null);
    setTime(TIME);
    audio.play('click');
  };

  const stats = useMemo(() => `Frage ${Math.min(index + 1, ROUND)}/${ROUND} · Richtig: ${correct} · Punkte: ${score}`, [index, correct, score]);

  return (
    <div className={styles.pane}>
      <div className={styles.h1}>PubQuiz.exe</div>
      {state === 'idle' && (
        <>
          <div className={styles.muted}>Zehn Fragen, zwölf Sekunden pro Frage, Antworten zwischen fragwürdig und sehr fragwürdig. Bestes Ergebnis: {game.data.quizBest}/10.</div>
          <div className={styles.buttons}>
            <button className="btn primary" onClick={start}>Quiz starten</button>
            <button className="btn" onClick={close}>Schließen</button>
          </div>
        </>
      )}
      {state === 'play' && !finishedAll && (
        <>
          <div className={styles.muted}>{stats}</div>
          <div className={`progress ${styles.quizTimer} ${time <= 4 ? styles.low : ''}`} aria-label={`${time} Sekunden`}>
            <div className="blocks">
              {Array.from({ length: Math.max(0, time) * 3 }).map((_, i) => (
                <span key={i} className="block" />
              ))}
            </div>
          </div>
          <div className={styles.quizQ}>{q.q}</div>
          <div className={styles.quizOpts}>
            {q.options.map((o, i) => (
              <button key={o} className={`btn ${styles.quizOpt} ${picked !== null && i === q.correct ? styles.right : ''} ${picked === i && i !== q.correct ? styles.wrong : ''}`} onClick={() => pick(i)} disabled={picked !== null}>
                {String.fromCharCode(65 + i)}) {o}
              </button>
            ))}
          </div>
          {picked !== null && <div className="field" style={{ fontSize: 12 }}>{picked === -1 ? 'Zeit abgelaufen. ' : picked === q.correct ? 'Richtig! ' : 'Falsch. '}{q.comment}</div>}
          <div className={styles.buttons}>
            <button className="btn primary" onClick={next} disabled={picked === null}>{index + 1 >= ROUND ? 'Auswertung' : 'Weiter'}</button>
            <button className="btn" onClick={close}>Abbrechen</button>
          </div>
        </>
      )}
      {state === 'done' && (
        <>
          <div className={styles.levelUpBanner} style={{ fontSize: 14 }}>{QUIZ_RATING(correct, ROUND)}</div>
          <div className="field" style={{ textAlign: 'center' }}>{correct} von {ROUND} richtig · {score} Punkte{correct >= 8 ? ' · Diplom erhalten!' : ''}</div>
          <div className={styles.buttons}>
            <button className="btn primary" onClick={start}>Nochmal</button>
            <button className="btn" onClick={close}>Schließen</button>
          </div>
        </>
      )}
    </div>
  );
}
