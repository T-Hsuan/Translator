import { defineStore } from "pinia";
import { ref } from "vue";
export const useChatboxStore = defineStore("chatbox", () => {
  const chatQst = ref("");
  const chatAns = ref("");
  const recording = ref(false);
  const audio = ref("");

  return {
    chatQst,
    chatAns,
    recording,
    audio,
  };
});
