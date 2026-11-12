import * as THREE from "three";

export function crearTextura(img: HTMLImageElement): THREE.CanvasTexture {
  // Proporción aproximada del desplegado de una taza de 11 oz
  const W = 2048;
  const H = 757;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Zona de impresión: 80% del ancho, centrada
  const rx = W * 0.1;
  const rw = W * 0.8;
  const ry = 0;
  const rh = H;

  // Ajuste tipo "cover": la imagen llena la zona y se recorta lo que sobra
  const escala = Math.max(rw / img.width, rh / img.height);
  const w = img.width * escala;
  const h = img.height * escala;

  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();
  ctx.drawImage(img, rx + (rw - w) / 2, ry + (rh - h) / 2, w, h);
  ctx.restore();

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 8;
  return textura;
}