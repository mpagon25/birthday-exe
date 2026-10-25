import type { AppRegistry } from '../desktop/types';
import { MessageBox } from '../desktop/MessageBox';
import { LevelUp } from './LevelUp';
import { Voucher } from './Voucher';
import { WhiskeyTasting } from './WhiskeyTasting';
import { Wizard } from './Wizard';
import { Boulder } from './Boulder';
import { Dice } from './Dice';
import { RabbitDialog, RabbitHole } from './Rabbit';
import { Calendar } from './Calendar';
import { InternetExplorer } from './InternetExplorer';
import { Inventory } from './Inventory';
import { Achievements } from './Achievements';
import { Paint } from './Paint';
import { Radio } from './Radio';
import { About, GameNight, Kaffee, QuestLog, Run, Settings } from './Misc';

export const registry: AppRegistry = {
  msgbox: { title: 'Meldung', icon: 'info', width: 360, height: 10, component: MessageBox, singleton: false, skipTaskbar: true },
  levelup: { title: 'LEVEL 35 UNLOCKED', icon: 'star', width: 520, height: 10, component: LevelUp },
  voucher: { title: 'Gutschein: Whiskeytasting', icon: 'whiskey', width: 560, height: 10, component: Voucher, x: 500, y: 150 },
  whiskeytasting: { title: 'WhiskeyTasting.exe', icon: 'whiskey', width: 440, height: 10, component: WhiskeyTasting, program: true },
  wizard: { title: 'Der Zauberer spricht', icon: 'wizard', width: 560, height: 10, component: Wizard, x: 420, y: 230 },
  boulder: { title: 'Bouldern.exe', icon: 'climb', width: 360, height: 10, component: Boulder, program: true, x: 1040, y: 80 },
  dice: { title: 'W20.exe', icon: 'dice', width: 360, height: 10, component: Dice, program: true },
  rabbit: { title: 'Follow the white rabbit?', icon: 'rabbit', width: 380, height: 10, component: RabbitDialog, x: 330, y: 420 },
  rabbithole: { title: 'rabbit_hole.exe', icon: 'rabbit', width: 500, height: 10, component: RabbitHole },
  calendar: { title: '21.11. – A legendary date', icon: 'calendar', width: 400, height: 10, component: Calendar, x: 980, y: 330 },
  ie: { title: 'Internet Explorer – The Rabbit Hole', icon: 'ie', width: 640, height: 520, component: InternetExplorer, program: true },
  inventory: { title: 'My Computer – Inventory', icon: 'computer', width: 560, height: 10, component: Inventory, program: true },
  achievements: { title: 'Achievements.exe', icon: 'trophy', width: 440, height: 560, component: Achievements, program: true },
  paint: { title: 'Paint.exe', icon: 'paint', width: 580, height: 10, component: Paint, program: true },
  radio: { title: 'Tavern Radio', icon: 'radio', width: 420, height: 10, component: Radio, program: true },
  gamenight: { title: 'GameNight.exe', icon: 'game', width: 520, height: 10, component: GameNight, program: true },
  kaffee: { title: 'Kaffee_irl.exe', icon: 'coffee', width: 380, height: 10, component: Kaffee, program: true },
  questlog: { title: 'QuestLog.exe', icon: 'scroll', width: 420, height: 10, component: QuestLog, program: true },
  about: { title: 'Über Maxi35.exe', icon: 'info', width: 420, height: 10, component: About },
  settings: { title: 'Einstellungen', icon: 'window', width: 420, height: 10, component: Settings },
  run: { title: 'Ausführen', icon: 'window', width: 420, height: 10, component: Run },
};

export const PROGRAM_IDS = Object.entries(registry)
  .filter(([, d]) => d.program)
  .map(([id]) => id);
