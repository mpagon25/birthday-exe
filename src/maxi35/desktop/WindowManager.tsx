import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { SCENE_BOTTOM, SCENE_TOP, ICONBAR_W, STAGE_W } from '../../shared/stage/constants';
import type { AppRegistry, MsgOptions, OpenOptions, WindowState } from './types';

type Action =
  | { type: 'open'; win: WindowState }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'restore'; id: string }
  | { type: 'move'; id: string; x: number; y: number }
  | { type: 'retitle'; id: string; title: string };

interface State {
  windows: WindowState[];
  nextZ: number;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return { windows: [...state.windows, { ...action.win, z: state.nextZ }], nextZ: state.nextZ + 1 };
    case 'close':
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) };
    case 'focus': {
      const target = state.windows.find((w) => w.id === action.id);
      if (!target) return state;
      if (target.z === state.nextZ - 1 && !target.minimized) return state;
      return {
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, z: state.nextZ, minimized: false } : w)),
        nextZ: state.nextZ + 1,
      };
    }
    case 'minimize':
      return { ...state, windows: state.windows.map((w) => (w.id === action.id ? { ...w, minimized: true } : w)) };
    case 'restore':
      return {
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, minimized: false, z: state.nextZ } : w)),
        nextZ: state.nextZ + 1,
      };
    case 'move':
      return { ...state, windows: state.windows.map((w) => (w.id === action.id ? { ...w, x: action.x, y: action.y } : w)) };
    case 'retitle':
      return { ...state, windows: state.windows.map((w) => (w.id === action.id ? { ...w, title: action.title } : w)) };
    default:
      return state;
  }
}

export interface WindowManagerApi {
  windows: WindowState[];
  activeId: string | null;
  registry: AppRegistry;
  open: (appId: string, options?: OpenOptions) => string;
  close: (id: string) => void;
  closeApp: (appId: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggle: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  retitle: (id: string, title: string) => void;
  isOpen: (appId: string) => boolean;
  message: (options: MsgOptions) => string;
  onOpenApp?: (appId: string) => void;
}

const Ctx = createContext<WindowManagerApi | null>(null);

let counter = 0;

export function WindowManagerProvider({
  registry,
  children,
  onOpenApp,
  onMessage,
}: {
  registry: AppRegistry;
  children: ReactNode;
  onOpenApp?: (appId: string) => void;
  onMessage?: (options: MsgOptions) => void;
}) {
  const [state, dispatch] = useReducer(reducer, { windows: [], nextZ: 10 });
  const stateRef = useRef(state);
  stateRef.current = state;
  const cascade = useRef(0);

  const focus = useCallback((id: string) => dispatch({ type: 'focus', id }), []);

  const open = useCallback(
    (appId: string, options: OpenOptions = {}): string => {
      const def = registry[appId];
      if (!def) {
        console.warn(`Unknown app: ${appId}`);
        return '';
      }
      const singleton = def.singleton !== false;
      if (singleton) {
        const existing = stateRef.current.windows.find((w) => w.appId === appId);
        if (existing) {
          dispatch({ type: 'focus', id: existing.id });
          return existing.id;
        }
      }
      const w = options.width ?? def.width;
      const h = options.height ?? def.height;
      let x = options.x ?? def.x;
      let y = options.y ?? def.y;
      if (x === undefined || y === undefined) {
        const step = (cascade.current % 6) * 24;
        cascade.current += 1;
        const cx = ICONBAR_W + (STAGE_W - ICONBAR_W - w) / 2 + step - 60;
        const cy = SCENE_TOP + (SCENE_BOTTOM - SCENE_TOP - h) / 2 + step - 60;
        x = x ?? cx;
        y = y ?? cy;
      }
      x = Math.max(ICONBAR_W - 10, Math.min(x, STAGE_W - w - 4));
      y = Math.max(SCENE_TOP, Math.min(y, SCENE_BOTTOM - h));
      counter += 1;
      const id = `${appId}-${counter}`;
      dispatch({
        type: 'open',
        win: {
          id,
          appId,
          title: options.title ?? def.title,
          icon: def.icon,
          x,
          y,
          w,
          h,
          z: 0,
          minimized: false,
          skipTaskbar: def.skipTaskbar ?? false,
          props: options.props ?? {},
        },
      });
      onOpenApp?.(appId);
      return id;
    },
    [registry, onOpenApp],
  );

  const close = useCallback((id: string) => dispatch({ type: 'close', id }), []);
  const closeApp = useCallback((appId: string) => {
    stateRef.current.windows.filter((w) => w.appId === appId).forEach((w) => dispatch({ type: 'close', id: w.id }));
  }, []);
  const minimize = useCallback((id: string) => dispatch({ type: 'minimize', id }), []);
  const move = useCallback((id: string, x: number, y: number) => dispatch({ type: 'move', id, x, y }), []);
  const retitle = useCallback((id: string, title: string) => dispatch({ type: 'retitle', id, title }), []);

  const activeId = useMemo(() => {
    const visible = state.windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((a, b) => (a.z > b.z ? a : b)).id;
  }, [state.windows]);

  const toggle = useCallback(
    (id: string) => {
      const w = stateRef.current.windows.find((x) => x.id === id);
      if (!w) return;
      const visible = stateRef.current.windows.filter((x) => !x.minimized);
      const topId = visible.length ? visible.reduce((a, b) => (a.z > b.z ? a : b)).id : null;
      if (w.minimized) dispatch({ type: 'restore', id });
      else if (topId === id) dispatch({ type: 'minimize', id });
      else dispatch({ type: 'focus', id });
    },
    [],
  );

  const isOpen = useCallback((appId: string) => stateRef.current.windows.some((w) => w.appId === appId), []);

  const message = useCallback(
    (options: MsgOptions): string => {
      onMessage?.(options);
      return open('msgbox', {
        title: options.title,
        props: { ...options },
        width: options.width ?? 360,
        height: 10,
        x: options.x,
        y: options.y,
      });
    },
    [open, onMessage],
  );

  const api = useMemo<WindowManagerApi>(
    () => ({ windows: state.windows, activeId, registry, open, close, closeApp, focus, minimize, toggle, move, retitle, isOpen, message }),
    [state.windows, activeId, registry, open, close, closeApp, focus, minimize, toggle, move, retitle, isOpen, message],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useWindowManager(): WindowManagerApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWindowManager outside provider');
  return ctx;
}
