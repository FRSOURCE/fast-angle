import type { ValueOf } from 'type-fest';

function triggerDownload(imgURI: string, filename: string) {
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true,
  });

  const a = document.createElement('a');
  a.setAttribute('download', filename);
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
}

async function svgToCanvas(svg: SVGElement, ctx: CanvasRenderingContext2D) {
  const data = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  const img = new Image();
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve();
    };

    img.onabort = img.onerror = () => reject();
    img.src = url;
  });
}

export const SVG_DOWNLOAD_FILETYPE = {
  JPG: 1,
  PNG: 2,
} as const;

const FILETYPES = {
  [SVG_DOWNLOAD_FILETYPE.JPG]: {
    encoding: 'image/jpeg',
    extension: 'jpg',
  },
  [SVG_DOWNLOAD_FILETYPE.PNG]: {
    encoding: 'image/png',
    extension: 'png',
  },
};

function prepareSvg(originalSvg: SVGElement) {
  const svg = originalSvg.cloneNode(true) as SVGElement;
  const svgStyle = window.getComputedStyle(originalSvg);
  svg.querySelector('circle')?.remove();
  svg.style.setProperty(
    '--background-color-transparent',
    svgStyle.getPropertyValue('--background-color-transparent'),
  );
  svg.style.color = svg.style.fill = svgStyle.getPropertyValue('--color');
  svg.style.stroke = '#fff';
  svg.style.fontFamily = 'Arial';
  svg.style.fontSize = '20px';
  return svg;
}

export const useBoardSvgDownload = createSharedComposable(() => {
  const canvas = import.meta.env.SSR
    ? undefined
    : document.createElement('canvas');
  const ctx = canvas?.getContext('2d');

  const svgRef = useBoardSvgRef();
  const isSupported = computed(() => svgRef.value && ctx);
  const download = async ({
    filename,
    filetype,
    quality,
    width,
    height,
  }: {
    filename: string;
    filetype: ValueOf<typeof SVG_DOWNLOAD_FILETYPE>;
    quality: number;
    width: number;
    height: number;
  }) => {
    if (!isSupported.value || !canvas || !svgRef.value || !ctx) {
      /* eslint-disable-next-line  no-console */
      return console.error(
        'Cannot download due to required api missing:',
        isSupported.value,
        canvas,
        svgRef.value,
        ctx,
      );
    }

    canvas.width = width;
    canvas.height = height;
    await svgToCanvas(prepareSvg(svgRef.value), ctx);
    const { encoding, extension } = FILETYPES[filetype];
    const svgDownloadUrl = canvas.toDataURL(encoding, quality);
    triggerDownload(svgDownloadUrl, `${filename}.${extension}`);
  };

  return { triggerDownload: download, isSupported };
});
