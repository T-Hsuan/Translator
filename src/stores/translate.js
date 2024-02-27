import { defineStore } from "pinia";
import axios from "axios";
import { useDataStore } from "./data";
import { useChatboxStore } from "./chatbox";
import { storeToRefs } from "pinia";
export const useTranslateStore = defineStore("translate", () => {
  const useData = useDataStore();
  const { source_val, target_val } = storeToRefs(useData);
  const useChatbox = useChatboxStore();
  const { chatQst, chatAns, recording, audio } = storeToRefs(useChatbox);

  const textTranslate = async (id1, id2) => {
    if (chatQst.value === "" || chatQst.value === null) return;
    const newParagraph = document.createElement("p");
    newParagraph.className = "chatQ chatQ_text";
    newParagraph.textContent = chatQst.value;
    document.getElementById(id1).appendChild(newParagraph);
    try {
      const response = await axios.post(
        "http://192.168.210.54:8080/translate",
        {
          text: chatQst.value,
          recording: recording.value, //TODO: 確認音頻名稱
          source_lang: source_val.value,
          target_lang: target_val.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); //TODO: 確認音頻來源與格式
      if (recording.value) {
        // 建立 Blob 對象
        const blob = new Blob([response.data.translated_audio], {
          type: "audio/wav",
        });
        // 從 Blob 物件建立音訊 URL
        const audioUrl = URL.createObjectURL(blob);
        // 建立 audio 元素
        audio.value = new Audio(audioUrl);
        const newAudio = document.createElement("audio");
        newAudio.className = "chatA chatA_audio";
        newAudio.controls = true;
        newAudio.src = audio.value;
        document.getElementById(id1).appendChild(newAudio);
      }
      chatAns.value = response.data.translated_text;
      const newParagraph = document.createElement("p");
      newParagraph.className = "chatA chatA_text";
      newParagraph.textContent = chatAns.value;
      document.getElementById(id1).appendChild(newParagraph);
      document.getElementById(id2).value = null;
      chatQst.value = "";
    } catch (error) {
      console.error("[請求失敗]:", error);
    }
  };
  return {
    textTranslate,
  };
});
