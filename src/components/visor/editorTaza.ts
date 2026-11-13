import type { CanvasTexture } from "three";

export const LIENZO_W = 2048;
export const LIENZO_H = 757;

// Zona imprimible: 80% del ancho, centrada (el 10% de cada lado es la zona del asa)
export const REGION = {
  x: LIENZO_W * 0.1,
  y: 0,
  w: LIENZO_W * 0.8,
  h: LIENZO_H,
};

export const ANCHO_IMPRESION_CM = 20.5; // aprox. para taza de 11 oz
const LADO_MAX = 3000;

export type Modo = "cubrir" | "ajustar" | "extender";

export type Ajuste = {
  modo: Modo;
  zoom: number;
  dx: number; // desplazamiento horizontal en px del lienzo
  dy: number;
  rotacion: number; // grados
  fondo: string;
};

export const AJUSTE_INICIAL: Ajuste = {
  modo: "cubrir",
  zoom: 1,
  dx: 0,
  dy: 0,
  rotacion: 0,
  fondo: "#ffffff",
};

export type Fuente = HTMLImageElement | HTMLCanvasElement;

export type Imagen = {
  fuente: Fuente; // lo que se dibuja (puede tener el fondo quitado)
  original: Fuente; // sin modificar
  ancho: number;
  alto: number;
  anchoOriginal: number; // antes de reducir
};

export const limitar = (z: number) => Math.min(5, Math.max(0.1, z));

export function cargarImagen(archivo: File): Promise<Imagen> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const anchoOriginal = img.naturalWidth;
      const altoOriginal = img.naturalHeight;
      const factor = Math.min(1, LADO_MAX / Math.max(anchoOriginal, altoOriginal));

      if (factor === 1) {
        resolve({
          fuente: img,
          original: img,
          ancho: anchoOriginal,
          alto: altoOriginal,
          anchoOriginal,
        });
        return;
      }

      // Imagen enorme: se reduce para trabajar con fluidez
      const c = document.createElement("canvas");
      c.width = Math.round(anchoOriginal * factor);
      c.height = Math.round(altoOriginal * factor);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      resolve({
        fuente: c,
        original: c,
        ancho: c.width,
        alto: c.height,
        anchoOriginal,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };

    img.src = url;
  });
}

function escalaBase(img: Imagen, modo: Modo) {
  const ex = REGION.w / img.ancho;
  const ey = REGION.h / img.alto;
  return modo === "cubrir" ? Math.max(ex, ey) : Math.min(ex, ey);
}

// Si la imagen se parece a la zona, empieza en "cubrir"; si no, en "ajustar" para no recortar nada
export function elegirModoInicial(img: Imagen): Modo {
  const proporcion = img.ancho / img.alto / (REGION.w / REGION.h);
  return proporcion > 0.7 && proporcion < 1.4 ? "cubrir" : "ajustar";
}

// Estira los píxeles del borde de la imagen hacia afuera para rellenar el fondo
function extenderBordes(ctx: CanvasRenderingContext2D, img: Imagen, s: number) {
  const { fuente: f, ancho: w, alto: h } = img;
  const E = ((LIENZO_W + LIENZO_H) * 2) / s; // extensión suficiente para cubrir la zona
  const x0 = -w / 2;
  const y0 = -h / 2;

  // Lados: se repite la última columna o fila de píxeles (con 1 px de solape)
  ctx.drawImage(f, 0, 0, 1, h, x0 - E, y0, E + 1, h); // izquierda
  ctx.drawImage(f, w - 1, 0, 1, h, x0 + w - 1, y0, E + 1, h); // derecha
  ctx.drawImage(f, 0, 0, w, 1, x0, y0 - E, w, E + 1); // arriba
  ctx.drawImage(f, 0, h - 1, w, 1, x0, y0 + h - 1, w, E + 1); // abajo

  // Esquinas: el píxel de cada esquina
  ctx.drawImage(f, 0, 0, 1, 1, x0 - E, y0 - E, E + 1, E + 1);
  ctx.drawImage(f, w - 1, 0, 1, 1, x0 + w - 1, y0 - E, E + 1, E + 1);
  ctx.drawImage(f, 0, h - 1, 1, 1, x0 - E, y0 + h - 1, E + 1, E + 1);
  ctx.drawImage(f, w - 1, h - 1, 1, 1, x0 + w - 1, y0 + h - 1, E + 1, E + 1);
}

// Dibuja SOLO el diseño (esto es lo que se aplica al 3D)
export function dibujarDiseno(
  ctx: CanvasRenderingContext2D,
  img: Imagen | null,
  ajuste: Ajuste
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, LIENZO_W, LIENZO_H);
  if (!img) return;

  ctx.fillStyle = ajuste.fondo;
  ctx.fillRect(REGION.x, REGION.y, REGION.w, REGION.h);

  ctx.save();
  ctx.beginPath();
  ctx.rect(REGION.x, REGION.y, REGION.w, REGION.h);
  ctx.clip();
  ctx.translate(REGION.x + REGION.w / 2 + ajuste.dx, REGION.y + REGION.h / 2 + ajuste.dy);
  ctx.rotate((ajuste.rotacion * Math.PI) / 180);
  const s = escalaBase(img, ajuste.modo) * ajuste.zoom;
  ctx.scale(s, s);
  if (ajuste.modo === "extender") extenderBordes(ctx, img, s);
  ctx.drawImage(img.fuente, -img.ancho / 2, -img.alto / 2, img.ancho, img.alto);
  ctx.restore();
}

// Guías visuales (solo en la vista del editor, nunca en el 3D)
export function dibujarGuias(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, REGION.x, LIENZO_H);
  ctx.fillRect(REGION.x + REGION.w, 0, LIENZO_W - REGION.x - REGION.w, LIENZO_H);

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 4;
  ctx.setLineDash([24, 16]);
  ctx.strokeRect(REGION.x, REGION.y + 2, REGION.w, REGION.h - 4);

  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ASA", REGION.x / 2, LIENZO_H / 2);
  ctx.fillText("ASA", LIENZO_W - REGION.x / 2, LIENZO_H / 2);
  ctx.restore();
}

// Puntos por pulgada reales sobre la zona de impresión
export function calcularDpi(img: Imagen, ajuste: Ajuste) {
  const s = escalaBase(img, ajuste.modo) * ajuste.zoom;
  const pxLienzoPorCm = REGION.w / ANCHO_IMPRESION_CM;
  const ratio = img.anchoOriginal / img.ancho;
  return (pxLienzoPorCm / s) * ratio * 2.54;
}

export function evaluarCalidad(dpi: number) {
  if (dpi >= 200) return { nivel: "buena" as const, texto: "Calidad buena para imprimir" };
  if (dpi >= 120)
    return { nivel: "media" as const, texto: "Calidad media: podría verse algo suave" };
  return { nivel: "baja" as const, texto: "Calidad baja: se verá pixelada al imprimir" };
}

export type Recursos = { lienzo: HTMLCanvasElement; textura: CanvasTexture };

// Redibuja el diseño, avisa al 3D que la textura cambió y actualiza la vista del editor
export function redibujar(
  recursos: Recursos,
  img: Imagen | null,
  ajuste: Ajuste,
  vista: HTMLCanvasElement | null
) {
  const ctx = recursos.lienzo.getContext("2d");
  if (!ctx) return;

  dibujarDiseno(ctx, img, ajuste);
  recursos.textura.needsUpdate = true;

  const ctxVista = vista?.getContext("2d");
  if (ctxVista) {
    ctxVista.drawImage(recursos.lienzo, 0, 0);
    dibujarGuias(ctxVista);
  }
}

// Convierte un punto del lienzo (donde tocó la persona) a coordenadas de la imagen.
// Devuelve null si el punto cae fuera de la imagen.
export function lienzoAImagen(img: Imagen, ajuste: Ajuste, cx: number, cy: number) {
  const s = escalaBase(img, ajuste.modo) * ajuste.zoom;
  const vx = cx - (REGION.x + REGION.w / 2 + ajuste.dx);
  const vy = cy - (REGION.y + REGION.h / 2 + ajuste.dy);
  const a = (-ajuste.rotacion * Math.PI) / 180;
  const rx = vx * Math.cos(a) - vy * Math.sin(a);
  const ry = vx * Math.sin(a) + vy * Math.cos(a);
  const x = rx / s + img.ancho / 2;
  const y = ry / s + img.alto / 2;
  if (x < 0 || y < 0 || x >= img.ancho || y >= img.alto) return null;
  return { x, y };
}

// Quita el fondo: borra la zona CONECTADA al punto tocado cuyo color se parezca
// (distancia de color <= tolerancia). Siempre parte de la imagen original.
export function quitarFondoPorColor(
  origen: Fuente,
  sx: number,
  sy: number,
  tolerancia: number
): HTMLCanvasElement {
  const w = origen instanceof HTMLImageElement ? origen.naturalWidth : origen.width;
  const h = origen instanceof HTMLImageElement ? origen.naturalHeight : origen.height;

  const lienzo = document.createElement("canvas");
  lienzo.width = w;
  lienzo.height = h;
  const ctx = lienzo.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(origen, 0, 0);

  const datos = ctx.getImageData(0, 0, w, h);
  const px = datos.data;
  const total = w * h;

  const x0 = Math.min(w - 1, Math.max(0, Math.round(sx)));
  const y0 = Math.min(h - 1, Math.max(0, Math.round(sy)));
  const i0 = (y0 * w + x0) * 4;
  const r0 = px[i0];
  const g0 = px[i0 + 1];
  const b0 = px[i0 + 2];
  const tol2 = tolerancia * tolerancia;

  const dist2 = (p: number) => {
    const i = p * 4;
    const dr = px[i] - r0;
    const dg = px[i + 1] - g0;
    const db = px[i + 2] - b0;
    return dr * dr + dg * dg + db * db;
  };
  // Los píxeles ya transparentes también cuentan como fondo
  const esFondo = (p: number) => px[p * 4 + 3] < 10 || dist2(p) <= tol2;

  // Relleno por inundación desde el punto tocado
  const marca = new Uint8Array(total); // 1 = fondo
  const pila = new Int32Array(total);
  let tope = 0;
  const p0 = y0 * w + x0;
  marca[p0] = 1;
  pila[tope++] = p0;

  while (tope > 0) {
    const p = pila[--tope];
    const x = p % w;
    if (x > 0 && !marca[p - 1] && esFondo(p - 1)) {
      marca[p - 1] = 1;
      pila[tope++] = p - 1;
    }
    if (x < w - 1 && !marca[p + 1] && esFondo(p + 1)) {
      marca[p + 1] = 1;
      pila[tope++] = p + 1;
    }
    if (p >= w && !marca[p - w] && esFondo(p - w)) {
      marca[p - w] = 1;
      pila[tope++] = p - w;
    }
    if (p < total - w && !marca[p + w] && esFondo(p + w)) {
      marca[p + w] = 1;
      pila[tope++] = p + w;
    }
  }

  // El fondo pasa a transparente; los píxeles del borde se suavizan un poco
  const SUAVE = 30;
  for (let p = 0; p < total; p++) {
    const ia = p * 4 + 3;
    if (marca[p]) {
      px[ia] = 0;
      continue;
    }
    const x = p % w;
    const tocaFondo =
      (x > 0 && marca[p - 1]) ||
      (x < w - 1 && marca[p + 1]) ||
      (p >= w && marca[p - w]) ||
      (p < total - w && marca[p + w]);
    if (tocaFondo) {
      const a = Math.min(1, Math.max(0, (Math.sqrt(dist2(p)) - tolerancia) / SUAVE));
      px[ia] = Math.round(px[ia] * a);
    }
  }

  ctx.putImageData(datos, 0, 0);
  return lienzo;
}