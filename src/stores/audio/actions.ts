// src/stores/audio/actions.ts
import { obtenerCanciones, type Cancion } from "../../services/audioServices"

export function useAudioActions(state: any, getters: any) {
  let previousAudio: HTMLAudioElement | null = null

  function actualizarProgreso() {
    if (state.audio.value && state.audio.value.duration > 0) {
      state.progreso.value =
        (state.audio.value.currentTime / state.audio.value.duration) * 100
    }
  }

  function autoplaySiguiente() {
    const indice = getters.indiceActual.value
    const siguiente = state.canciones.value[indice + 1]
    if (siguiente) reproducir(siguiente)
    else {
      state.cancionActual.value = null
      state.progreso.value = 0
    }
  }

  function reproducir(cancion: Cancion) {
    if (state.audio.value) {
      try {
        state.audio.value.pause()
        state.audio.value.removeEventListener("timeupdate", actualizarProgreso)
        state.audio.value.removeEventListener("ended", autoplaySiguiente)
      } catch {}
      previousAudio = state.audio.value
    }

    state.cancionActual.value = cancion
    const nuevo = new Audio(cancion.ruta)
    nuevo.preload = "metadata"
    nuevo.volume = state.volumen.value

    nuevo.addEventListener("timeupdate", actualizarProgreso)
    nuevo.addEventListener("ended", autoplaySiguiente)
    state.audio.value = nuevo
    nuevo.play().catch((err) => console.warn("Play rejected:", err))
  }

  function pausa() {
    if (state.audio.value) state.audio.value.pause()
  }

  function moverProgreso(p: number) {
    if (state.audio.value && state.audio.value.duration > 0) {
      state.audio.value.currentTime = (p / 100) * state.audio.value.duration
      state.progreso.value = p
    }
  }

  function cambiarVolumen(v: number) {
    state.volumen.value = v
    if (state.audio.value) state.audio.value.volume = v
  }

  // ✅ ahora usamos el servicio
  async function cargarCanciones() {
    try {
      const canciones = await obtenerCanciones()
      state.canciones.value = canciones
    } catch (err) {
      console.error("Error al cargar canciones:", err)
    }
  }

  return {
    reproducir,
    pausa,
    moverProgreso,
    cambiarVolumen,
    cargarCanciones,
  }
}