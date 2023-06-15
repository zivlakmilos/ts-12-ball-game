export const WIDTH = 1200;
export const HEIGHT = 800;

export enum Colors {
  a = 0x8080ff,
  b = 0x5a70b3,
  c = 0xdfe7ff,
  d = 0xc0cfff,

  white = 0xffffff,
  black = 0x000000,
}

export namespace Colors {
  export const toString = (color: Colors): string => {
    return '#' + color.toString(16);
  }
}
