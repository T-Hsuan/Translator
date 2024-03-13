<template>
  <Header />
  <main>
    <section id="chatbox"></section>
    <section class="lang-selection">
      <select name="source-lang" class="lang" v-model="source_key" @change="getVal(source_key, 'src')">
        <option :value="item.key" v-for="item in source" :key="item">
          {{ item.key }}
        </option>
      </select>
      <p class="direction">{{ direction }}</p>
      <select name="target-lang" class="lang" v-model="target_key" @change="getVal(target_key, 'tar')">
        <option :value="item.key" v-for="item in target" :key="item">
          {{ item.key }}
        </option>
      </select>
    </section>
    <Translator v-if="Option === 1" />
    <ChatChat v-else-if="Option === 2" />
  </main>
</template>
<script setup>
import Header from "@/components/Header.vue";
import Translator from "@/components/Translator.vue";
import ChatChat from "@/components/ChatChat.vue";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useDataStore } from "@/stores/langData.js";
import { useChatboxStore } from "@/stores/chatBox.js";
import { storeToRefs } from "pinia";
import { textTranslated, audioTranslated } from "@/assets/js/translate.js";

//[data]
const LangData = useDataStore();
const { source, source_key, source_val, target, target_key, target_val } =
  storeToRefs(LangData);
const getVal = (val, key) => LangData.getVal(val, key);
//[chatbox]
const chatQst = ref(null);
const chatData = useChatboxStore();
const { Option, audioBlob } = storeToRefs(chatData);

//<recording block>
// const record = ref(false);
// const audioSend = ref(false);
// const recordClick = () => {
//   if (!record.value) {
//     record.value = true;
//     setTimeout(() => {
//       document.getElementsByClassName("recording-block")[0].scrollIntoView({ behavior: "smooth", block: "end" });
//     }, 100);
//   }
//   chatData.getAudio();
//   setTimeout(() => {
//     if (audioBlob.value) audioSend.value = true;
//   }, 100);
// };
// const audioDelete = () => {
//   record.value = false;
//   audioSend.value = false;
//   audioBlob.value = null;
//   const chatQ = document.querySelector(".recording-block").querySelector("audio");
//   if (chatQ) document.querySelector(".recording-block").removeChild(chatQ);
// };
// const audioTranslated = () => {
//   audioTranslated(audioBlob.value, target_val.value);
//   audioDelete();
// };

//*basic setting*--------------------------------------------------------------
//<language selection>
const direction = ref(window.innerWidth >= 650 ? "⭢" : "⭣");

//<input block>:textarea auto size
const resizeTextarea = () => {
  const textarea = document.getElementById("textbox");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
};
watch(chatQst, () => resizeTextarea());

//<lang selection>:change direction
window.onresize = () => {
  if (window.innerWidth >= 650) direction.value = "⭢";
  else direction.value = "⭣";
};
</script>
<style lang="scss">
@import "@/assets/scss/button.scss";

#chatbox {
  width: 100%;
  height: 60vh;
  border: 1px solid black;
  overflow-y: auto;

  .chatQ,
  .chatA {
    width: min(1000px, 80%);
    margin: auto;
    padding: clamp($sp1, 1.3vw, $sp2);
  }

  .chatA {
    background: rgb(255, 255, 255, 25%);
    border: 1px solid white;
    border-radius: 15px;
  }
}

.lang-selection {
  display: flex;
  justify-content: center;
  margin: 16px 0 24px;

  @media screen and (max-width: 649.9px) {
    flex-direction: column;
    align-items: center;
  }

  .lang {
    max-width: 280px;
    margin: 0 8px;
    padding: 4px 8px;
    font-family: "Madimi One", sans-serif;
    font-size: 18px;
    border-radius: 15px;
  }

  .direction {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
