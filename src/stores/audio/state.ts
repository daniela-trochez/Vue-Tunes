// src/stores/audio/state.ts
import { ref } from "vue"
import type { Cancion } from "../../services/audioServices"


export function useAudioState() {
  const canciones = ref<Cancion[]>([])
  const cancionActual = ref<Cancion | null>(null)
  const audio = ref<HTMLAudioElement | null>(null)
  const progreso = ref(0)
  const volumen = ref(1)

  return { canciones, cancionActual, audio, progreso, volumen }
}