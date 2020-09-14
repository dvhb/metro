// import * as svgMap from ('./metro-moscow.svg');

export class Metro {
  private mapEl: HTMLElement;
  private mapUrl: string;

  constructor(mapEl: HTMLElement, url: string) {
    this.mapEl = mapEl;
    this.mapUrl = url;
    console.log(mapEl, url); //tslint:disable-line
  }
  test() {
    return {
      one: this.mapUrl,
      two: this.mapEl
    };
  }
}
