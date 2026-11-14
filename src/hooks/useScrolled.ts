import { useSyncExternalStore } from "react";

function suscribir(avisar: () => void) {
  window.addEventListener("scroll", avisar, { passive: true });
  return () => window.removeEventListener("scroll", avisar);
}

// true cuando la página se ha desplazado más de `umbral` píxeles
export function useScrolled(umbral = 24) {
  return useSyncExternalStore(
    suscribir,
    () => window.scrollY > umbral,
    () => false
  );
}