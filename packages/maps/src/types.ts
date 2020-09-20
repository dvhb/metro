export interface LineItem {
  id: string;
  // lineColor: string;
  // stationColor: string;
  // enabledStationColor: string;
}
export interface GroupItem {
  id: string;
  title: string;
  show: boolean;
}
export interface StationItem {
  id: string;
  title: string;
  show: boolean;
  color: string;
}

export type StationItemInit = Partial<StationItem>;

export interface MetroConfiguration {
  mapEl: HTMLElement;
  url: string;
  initConfig?: StationItemInit[];
}
