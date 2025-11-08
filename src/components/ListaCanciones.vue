<template>
    <div class="player">
        <h2>🎧 Reproductor de Música</h2>

        <!-- Canción actual -->
        <p v-if="audioStore.cancionActual">
            ▶️ Reproduciendo: <strong>{{ audioStore.cancionActual.nombre }}</strong>
        </p>
        <p v-else>
            ⏸️ No hay ninguna canción reproduciéndose.
        </p>

        <!-- Lista de canciones -->
        <ul>
            <li v-for="(cancion, index) in audioStore.canciones" :key="index"
                :class="{ activa: audioStore.cancionActual?.nombre === cancion.nombre }">
                {{ cancion.nombre }}
                <button @click="audioStore.reproducir(cancion)">▶️</button>
            </li>
        </ul>
        <!-- Barra de progreso -->
        <div class="barra-progreso">
            <input type="range" min="0" max="100" step="0.1" v-model="audioStore.progreso"
                @input="audioStore.moverProgreso(audioStore.progreso)" />
            <span>{{ Math.round(audioStore.progreso) }}%</span>
        </div>

        <!-- Controles -->
        <div class="controles">
            <button @click="anterior">⏮️ Anterior</button>
            <button @click="audioStore.pausa()">⏸️ Pausa</button>
            <button @click="siguiente">⏭️ Siguiente</button>
        </div>

        <!-- Control de volumen -->
        <div class="volumen">
            🔊
            <input type="range" min="0" max="1" step="0.01" v-model="audioStore.volumen"
                @input="audioStore.cambiarVolumen(audioStore.volumen)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useControlesAudio } from '../composable/useControlesAudio'
import {onMounted } from "vue"
import { useAudioStore } from '../stores/audio'

const audioStore = useAudioStore()
const {siguiente, anterior} = useControlesAudio()

onMounted(()=>{
    audioStore.cargarCanciones()
})

</script>

<style src="../assets/css/player.css" scoped></style>
