import { computed } from "vue"
import { useAudioStore } from "../stores/audio"

export function useControlesAudio() {
  const audioStore = useAudioStore()

  // Calcula el índice de la canción actual
  const indiceActual = computed(() =>
    audioStore.canciones.findIndex(
      (c) => c.nombre === audioStore.cancionActual?.nombre
    )
  )

  // Ir a la siguiente canción
  function siguiente() {
    const siguienteCancion = audioStore.canciones[indiceActual.value + 1]
    if (siguienteCancion) {
      audioStore.reproducir(siguienteCancion)
    }
  }

  // Ir a la anterior
  function anterior() {
    const anteriorCancion = audioStore.canciones[indiceActual.value - 1]
    if (anteriorCancion) {
      audioStore.reproducir(anteriorCancion)
    }
  }

  return { siguiente, anterior, indiceActual }
}