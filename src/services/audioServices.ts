// src/services/audioService.ts

// Este servicio se encargará de obtener la lista de canciones.
// Por ahora simularemos una "API local".

export interface Cancion {
   _id?: string
  nombre: string
  artista?: string
  ruta: string
}

export async function obtenerCanciones(): Promise<Cancion[]> {
  try {
    const resp = await fetch("http://127.0.0.1:8000/api/canciones/")
    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`)
    return await resp.json()
  } catch (error) {
    console.error("Error obteniendo canciones:", error)
    return []
  }
}
export async function obtenerCanciones1(): Promise<Cancion[]> {
  // En un futuro, aquí haremos una llamada HTTP a FastAPI:
  // const resp = await fetch("http://localhost:8000/api/canciones");
  // return await resp.json();

  // Por ahora simulamos una respuesta "falsa":
  return [
    { nombre: "Canción 1", ruta: "/songs/cancion1.mp3" },
    { nombre: "Canción 2", ruta: "/songs/cancion2.mp3" },
    { nombre: "Canción 3", ruta: "/songs/cancion3.mp3" },
  ]
}