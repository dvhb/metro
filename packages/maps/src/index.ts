import rgbHex from 'rgb-hex';

import {GroupItem, LineItem, MetroConfiguration, StationItem, StationItemInit} from "./types";

export class Metro {
  private readonly mapWrapperEl: HTMLElement;
  private readonly mapUrl: string;
  private mapEl: SVGSVGElement;
  private linesConfig: LineItem[];
  private groupsConfig: GroupItem[];
  private stationsConfig: StationItem[];

  constructor({mapEl, url, initConfig}: MetroConfiguration) {
    this.mapWrapperEl = mapEl;
    this.mapUrl = url;

    this.init(initConfig).then((response) => {
      console.info(response);
    }).catch((e) => {
      console.error(e);
    });
  }

  private async init(initConfig?: StationItemInit[]) {
    try {
      const svgBlob = await fetchSVG(this.mapUrl);
      const svgContent = await getSVGContent(svgBlob);
      this.mapWrapperEl.insertAdjacentHTML('afterbegin', svgContent);
      this.mapEl = this.mapWrapperEl.getElementsByTagName('svg')[0];
      this.linesConfig = getLinesConfig(this.mapEl);
      this.groupsConfig = getGroupsConfig(this.mapEl);
      this.stationsConfig = getStationsConfig(this.mapEl, initConfig);
      applyGroupsConfig(this.mapEl, this.groupsConfig);
      applyStationsConfig(this.mapEl, this.stationsConfig);
      addInlineStyles();
      console.log(this.linesConfig, this.groupsConfig, this.stationsConfig);
      return Promise.resolve('map initialized');
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

const fetchSVG = async (url: string): Promise<Blob> => {
  try {
    const response = await fetch(url);
    if (response.headers.get('Content-Type') !== 'image/svg+xml') {
      return Promise.reject('accept only svg images');
    }
    return Promise.resolve(response.blob());
  } catch (err) {
    return Promise.reject(err)
  }
}

const getSVGContent = async (svg: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject("blank svg");
      }
      return resolve(event.target?.result as string);
    }
    reader.onerror = (e) => {
      reject(e);
    }
    reader.readAsText(svg);
  })
}

const getLinesConfig = (svgEl: SVGSVGElement): LineItem[] => {
  const lines = svgEl.querySelectorAll('[id^="l"]');
  const linesArray: LineItem[] = [];
  lines.forEach(line => {
    linesArray.push({
      id: line.id,
    });
  });
  return linesArray;
}
const getGroupsConfig = (svgEl: SVGSVGElement): GroupItem[] => {
  const groups = svgEl.querySelectorAll('[id^="g"]');
  const groupsArray: GroupItem[] = [];
  groups.forEach(group => {
    groupsArray.push({
      id: group.id,
      title: buildTitle(group),
      show: false,
    });
  });
  return groupsArray;
}
const getStationsConfig = (svgEl: SVGSVGElement, initConfig?: StationItemInit[]): StationItem[] => {
  const stations = svgEl.querySelectorAll('[id^="s"]');
  const initConfigNames = initConfig?.map(item => item.title);
  const stationsArray: StationItem[] = [];
  stations.forEach(station => {
    const circleEl = station.lastElementChild;
    const circleColor = circleEl ? window.getComputedStyle(circleEl, null).fill : '';
    const title = buildTitle(station);
    stationsArray.push({
      title,
      id: station.id,
      show: initConfigNames?.indexOf(title) !== -1,
      color: `#${rgbHex(circleColor)}`
    });
  });
  return stationsArray;
}

const buildTitle = (el: Element): string => {
  const titles = Array
    .from(el.children)
    .filter(child => child.nodeName === 'text')
    .map(child => child.textContent || '');

  return titles.length > 0 ? titles[titles.length - 1] : '';
}

const applyGroupsConfig = (el: Element, config: GroupItem[]): void => {
  config.forEach(item => {
    const currentStation = el.querySelector(`#${item.id}`);
    const currentStationClassNames = ['metro-station'];

    if (!item.show) {
      currentStationClassNames.push('disabled');
    }
    currentStation?.classList.add(...currentStationClassNames);
  });
}

const applyStationsConfig = (el: Element, config: StationItem[]): void => {
  config.forEach(item => {
    const currentStation = el.querySelector(`#${item.id}`);
    const circles = currentStation?.getElementsByTagName('circle');
    const currentStationClassNames = ['metro-station'];

    if (!item.show) {
      currentStationClassNames.push('disabled');
    }
    currentStation?.classList.add(...currentStationClassNames);

    if (circles) {
      circles[circles.length - 1].classList.add('metro-point');
    }
  });
}

const addInlineStyles = () => {
  const svgCSS =
    "@import url('//fonts.googleapis.com/css?family=PT+Sans&subset=cyrillic');" +
    "metro:after{content:\"\";display:block;padding-bottom:120%}metro svg{position:absolute;left:0;top:0;width:100%}" +
    "g.metro-station{cursor:pointer}g.metro-station.disabled{cursor:initial}g.metro-station.selected text,g.metro-station.selected tspan{font-weight:700!important}g.metro-station.disabled text,g.metro-station.disabled tspan{fill:gray;cursor:initial}g.metro-station text.style1{font-family:'PT Sans','sans-serif';font-weight:400;font-style:normal;font-stretch:normal;font-variant:normal;font-size:20px}g.metro-station.disabled .metro-point{display:none}";
  const style = document.createElement('style');
  style.id = 'dvhb_metro_style_inline';
  style.insertAdjacentHTML('afterbegin', svgCSS);
  document.getElementsByTagName('head')[0].appendChild(style);
}
