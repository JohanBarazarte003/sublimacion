"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import TazaViewer from "./TazaViewer";
import {
  AJUSTE_INICIAL,
  LIENZO_H,
  LIENZO_W,
  calcularDpi,
  cargarImagen,
  elegirModoInicial,
  evaluarCalidad,
  lienzoAImagen,
  limitar,
  quitarFondoPorColor,
  redibujar,
  type Ajuste,
  type Imagen,
  type Modo,
} from "./editorTaza";

// Lienzo en memoria + textura que usa el 3D. Se crean una sola vez.
function crearRecursos() {
  if (typeof document === "undefined") return null;
  const lienzo = document.createElement("canvas");
  lienzo.width = LIENZO_W;
  lienzo.height = LIENZO_H;
  const ctx = lienzo.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, LIENZO_W, LIENZO_H);

  const textura = new THREE.CanvasTexture(lienzo);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = 8;
  return { lienzo, textura };
}

type Punto = { x: number; y: number };
const distancia = (a: Punto, b: Punto) => Math.hypot(a.x - b.x, a.y - b.y);

type Quitar = { x: number; y: number; tolerancia: number };
type Pestana = "ajustar" | "fondo";

const MODOS: { id: Modo; titulo: string; detalle: string }[] = [
  { id: "cubrir", titulo: "Cubrir", detalle: "Llena todo" },
  { id: "ajustar", titulo: "Ajustar", detalle: "Se ve completa" },
  { id: "extender", titulo: "Extender", detalle: "Prolonga el fondo" },
];

const COLORES_FONDO = ["#ffffff", "#000000", "#f3f4f6", "#fde68a", "#bfdbfe"];

const PUNTO_CALIDAD = {
  buena: "bg-green-500",
  media: "bg-amber-500",
  baja: "bg-red-500",
};
const TEXTO_CALIDAD = {
  buena: "text-green-700",
  media: "text-amber-700",
  baja: "text-red-700",
};

const tarjeta = "rounded-3xl border border-black/5 bg-white shadow-xl shadow-violet-500/5";
const botonSec =
  "min-h-[44px] rounded-full border border-neutral-300 bg-white px-4 text-sm font-medium transition hover:bg-neutral-100 active:scale-95";
const botonRedondo =
  "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-neutral-300 bg-white text-lg font-medium transition hover:bg-neutral-100 active:scale-95";
const botonPrimario =
  "inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(90deg,#7c3aed,#c026d3)] px-8 text-base font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:opacity-95 active:scale-95";

export default function VisorTaza() {
  const [recursos] = useState(crearRecursos);
  const [imagen, setImagen] = useState<Imagen | null>(null);
  const [ajuste, setAjuste] = useState<Ajuste>(AJUSTE_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const [quitar, setQuitar] = useState<Quitar | null>(null);
  const [eligiendoFondo, setEligiendoFondo] = useState(false);
  const [pestana, setPestana] = useState<Pestana>("ajustar");

  const vistaRef = useRef<HTMLCanvasElement>(null);
  const punteros = useRef(new Map<number, Punto>());
  const inicio = useRef<{ ajuste: Ajuste; puntos: Punto[] } | null>(null);

  const original = imagen?.original;

  // Libera la textura al salir de la página
  useEffect(() => {
    return () => recursos?.textura.dispose();
  }, [recursos]);

  // Cada cambio: redibuja el diseño, actualiza el 3D y la vista del editor
  useEffect(() => {
    if (!recursos) return;
    redibujar(recursos, imagen, ajuste, vistaRef.current);
  }, [recursos, imagen, ajuste]);

  // Zoom con la rueda del ratón (solo cuando hay imagen)
  useEffect(() => {
    const el = vistaRef.current;
    if (!el || !imagen) return;
    const alRodar = (e: WheelEvent) => {
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      setAjuste((a) => ({ ...a, zoom: limitar(a.zoom * f) }));
    };
    el.addEventListener("wheel", alRodar, { passive: false });
    return () => el.removeEventListener("wheel", alRodar);
  }, [imagen]);

  // Quitar fondo: recalcula (con una breve espera) al elegir punto o mover la tolerancia
  useEffect(() => {
    if (!original || !quitar) return;
    const t = setTimeout(() => {
      const procesada = quitarFondoPorColor(
        original,
        quitar.x,
        quitar.y,
        quitar.tolerancia
      );
      setImagen((prev) => (prev ? { ...prev, fuente: procesada } : prev));
    }, 150);
    return () => clearTimeout(t);
  }, [original, quitar]);

  // --- Carga de archivos (selector o arrastrar y soltar) ---
  async function procesarArchivo(archivo: File) {
    if (!archivo.type.startsWith("image/")) {
      setError("Elige un archivo de imagen (PNG, JPG o WEBP).");
      return;
    }
    if (archivo.size > 25 * 1024 * 1024) {
      setError("La imagen pesa más de 25 MB. Prueba con una más liviana.");
      return;
    }

    try {
      const img = await cargarImagen(archivo);
      setImagen(img);
      setAjuste({ ...AJUSTE_INICIAL, modo: elegirModoInicial(img) });
      setQuitar(null);
      setEligiendoFondo(false);
      setPestana("ajustar");
      setError(null);
    } catch {
      setError("No se pudo leer la imagen. Prueba con otra.");
    }
  }

  function alElegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (archivo) void procesarArchivo(archivo);
  }

  function alDejarCaerArchivo(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const archivo = e.dataTransfer.files?.[0];
    if (archivo) void procesarArchivo(archivo);
  }

  // --- Elegir el fondo a quitar (toque sobre el lienzo plano) ---
  function elegirFondo(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!imagen) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = ((e.clientX - r.left) / r.width) * LIENZO_W;
    const cy = ((e.clientY - r.top) / r.height) * LIENZO_H;
    const p = lienzoAImagen(imagen, ajuste, cx, cy);
    if (!p) {
      setError("Toca sobre la imagen, no fuera de ella.");
      return;
    }
    setError(null);
    setQuitar({ x: p.x, y: p.y, tolerancia: quitar?.tolerancia ?? 30 });
    setEligiendoFondo(false);
  }

  function restaurarFondo() {
    setQuitar(null);
    setEligiendoFondo(false);
    setImagen((prev) => (prev ? { ...prev, fuente: prev.original } : prev));
  }

  // --- Arrastrar (1 dedo/ratón) y pellizcar (2 dedos) sobre el lienzo ---
  function tomarInstantanea() {
    inicio.current = { ajuste, puntos: Array.from(punteros.current.values()) };
  }

  function alPresionar(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!imagen) return;
    if (eligiendoFondo) {
      elegirFondo(e);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    tomarInstantanea();
  }

  function alMover(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!imagen || !inicio.current || !punteros.current.has(e.pointerId)) return;
    punteros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const ini = inicio.current;
    const actuales = Array.from(punteros.current.values());
    const factor = LIENZO_W / e.currentTarget.getBoundingClientRect().width;

    if (actuales.length === 1 && ini.puntos.length === 1) {
      setAjuste({
        ...ini.ajuste,
        dx: ini.ajuste.dx + (actuales[0].x - ini.puntos[0].x) * factor,
        dy: ini.ajuste.dy + (actuales[0].y - ini.puntos[0].y) * factor,
      });
    } else if (actuales.length >= 2 && ini.puntos.length >= 2) {
      const d0 = distancia(ini.puntos[0], ini.puntos[1]);
      const d1 = distancia(actuales[0], actuales[1]);
      if (d0 > 0) {
        setAjuste({ ...ini.ajuste, zoom: limitar((ini.ajuste.zoom * d1) / d0) });
      }
    }
  }

  function alSoltar(e: React.PointerEvent<HTMLCanvasElement>) {
    punteros.current.delete(e.pointerId);
    tomarInstantanea();
  }

  // --- Acciones de los controles ---
  function cambiarModo(modo: Modo) {
    setAjuste({ ...AJUSTE_INICIAL, modo, fondo: ajuste.fondo });
  }

  function restablecer() {
    if (!imagen) return;
    setAjuste({ ...AJUSTE_INICIAL, modo: elegirModoInicial(imagen), fondo: ajuste.fondo });
  }

  function rotar(grados: number) {
    setAjuste({ ...ajuste, rotacion: ((ajuste.rotacion + grados + 540) % 360) - 180 });
  }

  function quitarDiseno() {
    setImagen(null);
    setAjuste(AJUSTE_INICIAL);
    setQuitar(null);
    setEligiendoFondo(false);
  }

  const calidad = imagen ? evaluarCalidad(calcularDpi(imagen, ajuste)) : null;

  return (
    <div className="mt-4 grid gap-4 lg:mt-8 lg:grid-cols-2 lg:gap-6">
      {/* En móvil, estas dos vistas quedan fijas arriba mientras se usan los controles */}
      <div className="sticky top-16 z-30 -mx-4 flex flex-col gap-2 bg-white/80 px-4 pb-2 pt-2 backdrop-blur lg:contents">
        {/* 1. Lienzo plano 2D */}
        <div className="relative lg:col-start-2 lg:row-start-1">
          {!imagen && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={alDejarCaerArchivo}
              className={`${tarjeta} flex flex-col items-center gap-3 border-2 border-dashed border-violet-200 px-6 py-7 text-center`}
            >
              <p className="text-lg font-semibold">Sube tu diseño</p>
              <p className="max-w-xs text-sm text-neutral-500">
                Una imagen PNG o JPG. Podrás moverla, ajustarla y verla en 3D al
                instante.
              </p>
              <label className={botonPrimario}>
                Elegir imagen
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={alElegirArchivo}
                  className="hidden"
                />
              </label>
              <p className="hidden text-xs text-neutral-400 lg:block">
                o arrástrala hasta aquí
              </p>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}

          <div className={`${tarjeta} relative p-2 ${imagen ? "block" : "hidden"}`}>
            <canvas
              ref={vistaRef}
              width={LIENZO_W}
              height={LIENZO_H}
              className={`w-full rounded-2xl bg-neutral-100 ${
                imagen
                  ? `${eligiendoFondo ? "cursor-crosshair" : "cursor-grab"} touch-none`
                  : ""
              }`}
              onPointerDown={alPresionar}
              onPointerMove={alMover}
              onPointerUp={alSoltar}
              onPointerCancel={alSoltar}
            />
            {eligiendoFondo && (
              <div className="pointer-events-none absolute inset-x-4 top-4 rounded-full bg-violet-600 px-3 py-1.5 text-center text-xs font-semibold text-white shadow-lg">
                Toca el fondo que quieres quitar
              </div>
            )}
            <p className="mt-2 hidden px-1 text-xs text-neutral-500 lg:block">
              Se imprime lo que queda dentro del recuadro rojo. Arrastra la imagen
              para moverla; usa la rueda o pellizca para acercar.
            </p>
          </div>
        </div>

        {/* 2. Taza 3D */}
        <div
          className={`${tarjeta} h-[32dvh] min-h-[200px] overflow-hidden bg-[linear-gradient(135deg,#fafafa,#ede9fe)] lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-[560px] lg:self-start`}
        >
          <TazaViewer textura={recursos?.textura ?? null} autoGirar={!imagen} />
        </div>
      </div>

      {/* 3. Controles */}
      {imagen && calidad && (
        <div className={`${tarjeta} flex flex-col gap-4 p-4 lg:col-start-2 lg:row-start-2`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={`flex items-center gap-2 text-sm font-semibold ${TEXTO_CALIDAD[calidad.nivel]}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${PUNTO_CALIDAD[calidad.nivel]}`} />
              {calidad.texto}
            </p>
            <div className="flex gap-2">
              <label className={`${botonSec} grid cursor-pointer place-items-center`}>
                Cambiar
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={alElegirArchivo}
                  className="hidden"
                />
              </label>
              <button onClick={quitarDiseno} className={botonSec}>
                Quitar
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Pestañas */}
          <div className="grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1">
            {(["ajustar", "fondo"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPestana(p)}
                className={`min-h-[44px] rounded-full text-sm font-semibold transition ${
                  pestana === p
                    ? "bg-white text-neutral-900 shadow"
                    : "text-neutral-500"
                }`}
              >
                {p === "ajustar" ? "Ajustar" : "Fondo"}
              </button>
            ))}
          </div>

          {pestana === "ajustar" && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-2">
                {MODOS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => cambiarModo(m.id)}
                    className={`flex min-h-[64px] flex-col items-center justify-center rounded-2xl border px-2 py-2 text-center transition active:scale-95 ${
                      ajuste.modo === m.id
                        ? "border-violet-600 bg-violet-50 text-violet-700 ring-1 ring-violet-600"
                        : "border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="text-sm font-semibold">{m.titulo}</span>
                    <span className="text-[11px] text-neutral-500">{m.detalle}</span>
                  </button>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Tamaño</span>
                  <span className="text-neutral-500">{Math.round(ajuste.zoom * 100)}%</span>
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <button
                    aria-label="Reducir tamaño"
                    onClick={() => setAjuste({ ...ajuste, zoom: limitar(ajuste.zoom / 1.1) })}
                    className={botonRedondo}
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min={0.1}
                    max={5}
                    step={0.01}
                    value={ajuste.zoom}
                    onChange={(e) => setAjuste({ ...ajuste, zoom: Number(e.target.value) })}
                    className="h-2 flex-1 accent-violet-600"
                  />
                  <button
                    aria-label="Aumentar tamaño"
                    onClick={() => setAjuste({ ...ajuste, zoom: limitar(ajuste.zoom * 1.1) })}
                    className={botonRedondo}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Rotación</span>
                  <span className="text-neutral-500">{Math.round(ajuste.rotacion)}°</span>
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <button
                    aria-label="Girar a la izquierda"
                    onClick={() => rotar(-15)}
                    className={botonRedondo}
                  >
                    ↺
                  </button>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={ajuste.rotacion}
                    onChange={(e) => setAjuste({ ...ajuste, rotacion: Number(e.target.value) })}
                    className="h-2 flex-1 accent-violet-600"
                  />
                  <button
                    aria-label="Girar a la derecha"
                    onClick={() => rotar(15)}
                    className={botonRedondo}
                  >
                    ↻
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => rotar(90)} className={botonSec}>
                  Girar 90°
                </button>
                <button onClick={() => setAjuste({ ...ajuste, dx: 0, dy: 0 })} className={botonSec}>
                  Centrar
                </button>
                <button onClick={restablecer} className={botonSec}>
                  Restablecer
                </button>
              </div>

              <p className="text-xs text-neutral-500">
                Tip: arrastra la imagen con un dedo para moverla y pellizca con dos
                para acercar.
              </p>
            </div>
          )}

          {pestana === "fondo" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold">Quitar fondo por color</p>

                {eligiendoFondo ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-sm text-violet-700">
                      Toca o haz clic sobre el fondo, en el lienzo plano de arriba.
                    </p>
                    <button onClick={() => setEligiendoFondo(false)} className={botonSec}>
                      Cancelar
                    </button>
                  </div>
                ) : quitar ? (
                  <div className="mt-2 flex flex-col gap-3">
                    <div>
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Tolerancia</span>
                        <span className="text-neutral-500">{quitar.tolerancia}</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={120}
                        step={1}
                        value={quitar.tolerancia}
                        onChange={(e) =>
                          setQuitar({ ...quitar, tolerancia: Number(e.target.value) })
                        }
                        className="mt-1 h-2 w-full accent-violet-600"
                      />
                    </div>
                    <p className="text-xs text-neutral-500">
                      Más tolerancia quita más fondo, pero puede comerse partes del
                      personaje.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setEligiendoFondo(true)} className={botonSec}>
                        Elegir otro punto
                      </button>
                      <button onClick={restaurarFondo} className={botonSec}>
                        Restaurar fondo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-xs text-neutral-500">
                      Toca el color del fondo y lo borramos. Funciona mejor con fondos
                      lisos.
                    </p>
                    <button
                      onClick={() => {
                        setError(null);
                        setEligiendoFondo(true);
                      }}
                      className={botonSec}
                    >
                      Elegir color a quitar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold">Color de fondo</p>
                <p className="text-xs text-neutral-500">
                  Se ve en el modo Ajustar y donde hayas quitado el fondo.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {COLORES_FONDO.map((c) => (
                    <button
                      key={c}
                      aria-label={`Fondo ${c}`}
                      onClick={() => setAjuste({ ...ajuste, fondo: c })}
                      style={{ background: c }}
                      className={`h-11 w-11 rounded-full border-2 transition active:scale-95 ${
                        ajuste.fondo.toLowerCase() === c
                          ? "border-violet-600"
                          : "border-neutral-200"
                      }`}
                    />
                  ))}
                  <input
                    type="color"
                    value={ajuste.fondo}
                    onChange={(e) => setAjuste({ ...ajuste, fondo: e.target.value })}
                    aria-label="Elegir otro color de fondo"
                    className="h-11 w-11 cursor-pointer rounded-full border-2 border-neutral-200 bg-white p-1"
                  />
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-neutral-400">
            Es una vista aproximada: el color final al imprimir puede variar un poco.
          </p>
        </div>
      )}
    </div>
  );
}