export enum TimerId {
  TOP = 0,
  BOTTOM = 1,
};

export type TimeControl = 1 | 3 | 5 | 10;

export interface SettingsState {
  timeControl: TimeControl
}
