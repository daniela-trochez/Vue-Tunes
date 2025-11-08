<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">🎵 Canciones disponibles</h1>

    <div v-if="loading" class="text-gray-500">Cargando canciones...</div>

    <div v-else>
      <div v-for="cancion in canciones" :key="cancion._id" class="mb-6 p-4 border rounded-lg shadow">
        <h2 class="text-lg font-semibold">{{ cancion.nombre }}</h2>
        <p class="text-gray-600 mb-2">Artista: {{ cancion.artista }}</p>
        <audio controls :src="cancion.ruta" class="w-full"></audio>
      </div>
    </div>
  </div>
</template>

<script setup >
import { ref, onMounted } from "vue";

const canciones = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/canciones/");
    if (!response.ok) throw new Error("Error al cargar canciones");
    canciones.value = await response.json();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
audio {
  outline: none;
}
</style>