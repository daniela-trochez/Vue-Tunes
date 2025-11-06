// src/stores/audio/getters.ts
import { computed } from "vue"
import type { Cancion } from "../../services/audioServices"

export function useAudioGetters(state: {
  canciones: { value: Cancion[] }
  cancionActual: { value: Cancion | null }
}) {
  const indiceActual = computed(() =>
    state.canciones.value.findIndex(
      (c) => c.nombre === state.cancionActual.value?.nombre
    )
  )

  return { indiceActual }
}