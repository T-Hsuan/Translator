<template>
  <section class="input-block">
    <textarea id="textbox" v-model="chatQst" placeholder="Please enter text"
      @keyup.enter="textTranslated(chatQst, source_val, target_val)" rows="1">
    </textarea>
    <button class="btn-enter" @click="textTranslated(chatQst, source_val, target_val)">
      ➤
    </button>
    <button class="btn-record" @click="recordClick()" v-if="!record">🎙️</button>
  </section>
  <section class="recording-block" v-if="record">
    <div class="recording" v-if="!audioSend">
      <p>recording...</p>
      <button class="btn-stop" @click="recordClick()">🟥</button>
    </div>
    <div class="recording-ended" v-else>
      <button class="btn-send" @click="AudioTranslated()">send recording!</button>
      <button class="btn-delete" @click="audioDelete()">🗑️</button>
    </div>
  </section>
</template>
<script setup>
import { ref } from "vue";
import { useDataStore } from "@/stores/langData.js";
import { useChatboxStore } from "@/stores/chatBox.js";
import { storeToRefs } from "pinia";
import { textTranslated, audioTranslated } from "@/assets/js/translate.js";
//[data]
const LangData = useDataStore();
const { source_key, source_val, target_key, target_val } =
  storeToRefs(LangData);
//[chatbox]
const chatQst = ref(null);
const chatData = useChatboxStore();
const { audioBlob } = storeToRefs(chatData);

//<recording block>
const record = ref(false);
const audioSend = ref(false);
const recordClick = () => {
  if (!record.value) {
    record.value = true;
    setTimeout(() => {
      document.getElementsByClassName("recording-block")[0].scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }
  chatData.getAudio();
  setTimeout(() => {
    if (audioBlob.value) audioSend.value = true;
  }, 100);
};
const audioDelete = () => {
  record.value = false;
  audioSend.value = false;
  audioBlob.value = null;
  const chatQ = document.querySelector(".recording-block").querySelector("audio");
  if (chatQ) document.querySelector(".recording-block").removeChild(chatQ);
};
const AudioTranslated = () => {
  audioTranslated(audioBlob.value, target_val.value);
  audioDelete();
};

</script>
<style lang="scss" scoped>
.input-block {
  width: min(1000px, 90%);
  margin: auto;
  position: relative;

  #textbox {
    width: 100%;
    margin: auto;
    padding: 16px 32px 16px 16px;
    font-family: Arial;
    font-size: 20px;
    color: white;
    background: none;
    border-radius: 15px;
    resize: none;
    overflow: hidden;
  }
}

.recording-block {
  width: 100%;
  min-height: 100px;
  margin: auto;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  background: white;

  .recording {
    text-align: center;
  }
}
</style>
