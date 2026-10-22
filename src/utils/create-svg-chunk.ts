type SVGChunkOptions = {
  classes?: string[],
}

export function createSvgChunk(
  name: string,
  options: SVGChunkOptions = {},
): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (options.classes) {
    svg.classList.add(...options?.classes);
  }

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    `#${name}`,
  );
  svg.append(use);

  return svg;
}
