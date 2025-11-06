// src/stores/audio/index.ts
import { defineStore } from "pinia"
import { useAudioState } from "./state"
import { useAudioGetters } from "./getters"
import { useAudioActions } from "./actions"

export const useAudioStore = defineStore("audio", () => {
  const state = useAudioState()
  const getters = useAudioGetters(state)
  const actions = useAudioActions(state, getters)

  return { ...state, ...getters, ...actions }
})
