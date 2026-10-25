import type { ComponentType } from 'react';

export type WindowProps = Record<string, unknown>;

export interface AppComponentProps {
  windowId: string;
  close: () => void;
  props: WindowProps;
}

export interface AppDef {
  title: string;
  icon: string;
  width: number;
  height: number;
  component: ComponentType<AppComponentProps>;
  /** Only one instance at a time (default true). */
  singleton?: boolean;
  /** Hide from taskbar (dialogs). */
  skipTaskbar?: boolean;
  /** Fixed initial position; otherwise cascaded around the centre. */
  x?: number;
  y?: number;
  /** Counts towards "Curiosity Killed the Tab". */
  program?: boolean;
}

export type AppRegistry = Record<string, AppDef>;

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  skipTaskbar: boolean;
  props: WindowProps;
}

export interface OpenOptions {
  title?: string;
  props?: WindowProps;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export type MsgIcon = 'info' | 'warn' | 'error' | 'ok' | 'question' | 'trophy' | 'beer' | 'whiskey' | 'none';

export interface MsgButton {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

export interface MsgOptions {
  title: string;
  text: string | string[];
  icon?: MsgIcon;
  buttons?: MsgButton[];
  width?: number;
  x?: number;
  y?: number;
  sound?: 'info' | 'error' | 'warn' | 'none';
}
