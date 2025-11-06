import { defineStore } from "pinia"
import { ref } from "vue"
import { obtenerCanciones, type Cancion } from "../services/audioServices"


export const useAudioStore = defineStore('audio', () => {
  const canciones = ref<Cancion[]>([])
  const cancionActual = ref<Cancion | null>(null)
  const audio = ref<HTMLAudioElement | null>(null)
  const progreso = ref(0)       // Progreso en %
  const volumen = ref(1)   // 0 a 1


   // 🔹 Nueva función: cargar canciones desde el servicio
  async function cargarCanciones() {
    canciones.value = await obtenerCanciones()
  }



  // Guardamos referencia al audio anterior para poder remover listeners limpiamente
  let previousAudio: HTMLAudioElement | null = null

  // Definimos las funciones fuera para que la referencia sea estable
  function actualizarProgreso() {
    if (audio.value && audio.value.duration > 0) {
      progreso.value = (audio.value.currentTime / audio.value.duration) * 100
      // console.log('timeupdate', progreso.value) // descomenta para depuración
    }
  }

  function autoplaySiguiente() {
    const indice = canciones.value.findIndex(
      (c) => c.nombre === cancionActual.value?.nombre
    )
    if (indice >= 0 && indice < canciones.value.length - 1) {
      const siguienteCancion = canciones.value[indice + 1]
      if (siguienteCancion) reproducir(siguienteCancion)
    } else {
      // No hay siguiente: reiniciamos estado
      cancionActual.value = null
      progreso.value = 0
      // console.log('Fin de la lista') // depuración
    }
  }

  function reproducir(cancion: Cancion) {
    // Si había un audio anterior, lo limpiamos (pause + remove listeners)
    if (audio.value) {
      try {
        audio.value.pause()
        audio.value.removeEventListener('timeupdate', actualizarProgreso)
        audio.value.removeEventListener('ended', autoplaySiguiente)
        audio.value.removeEventListener('loadedmetadata', actualizarProgreso)
      } catch (e) {
        // no hacemos nada si falla la limpieza
      }
      previousAudio = audio.value
    }

    cancionActual.value = cancion

    // Creamos nuevo elemento Audio y configuramos preload para asegurar duration
    const nuevo = new Audio(cancion.ruta)
    nuevo.preload = 'metadata'
    nuevo.volume = volumen.value

    // Añadimos listeners ESTABLES (misma referencia de función)
    nuevo.addEventListener('timeupdate', actualizarProgreso)
    nuevo.addEventListener('ended', autoplaySiguiente)
    // Cuando se cargan metadatos (duration) actualizamos progreso al inicio
    nuevo.addEventListener('loadedmetadata', () => {
      // Si queremos posicionar al inicio:
      progreso.value = (nuevo.currentTime / nuevo.duration) * 100 || 0
      // console.log('loadedmetadata duration=', nuevo.duration)
    })

    audio.value = nuevo

    // Reproducimos y capturamos errores (autoplay policy)
    const p = nuevo.play()
    if (p && typeof p.then === 'function') {
      p.catch((err) => {
        // Suele fallar por política de autoplay si no hubo interacción del usuario
        console.warn('Play rejected:', err)
      })
    }
  }

  function pausa() {
    if (audio.value) audio.value.pause()
  }

  function moverProgreso(porcentaje: number) {
    if (audio.value && audio.value.duration > 0) {
      audio.value.currentTime = (porcentaje / 100) * audio.value.duration
      progreso.value = porcentaje
    }
  }

  function cambiarVolumen(valor: number) {
    volumen.value = valor
    if (audio.value) audio.value.volume = valor
  }

  return {
    canciones,
    cancionActual,
    audio,
    progreso,
    volumen,
    reproducir,
    pausa,
    moverProgreso,
    cambiarVolumen,
    cargarCanciones
  }
})