<template>
  <h1 class="title">Translator</h1>
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
  <section class="text-entering">
    <textarea id="textbox" v-model="chatQst" placeholder="Please enter text"
      @keyup.enter="textTranslate('chatbox', 'textbox')" rows="1">
    </textarea>
    <button class="btn-enter" @click="textTranslate('chatbox', 'textbox')">
      ➤
    </button>
    <button class="btn-record" @click="getRecording()">🎙️</button>
  </section>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useDataStore } from "@/stores/data.js";
import { useChatboxStore } from "@/stores/chatbox.js";
import { useTranslateStore } from "@/stores/translate.js";
import { storeToRefs } from "pinia";
//[data]
const useData = useDataStore();
const { source, source_key, source_val, target, target_key, target_val } =
  storeToRefs(useData);
const getVal = (val, key) => useData.getVal(val, key);

//[chatbox]
const { chatQst, audio } = storeToRefs(useChatboxStore());
//[translate]
const useTranslate = useTranslateStore();
const textTranslate = (id1, id2) => useTranslate.textTranslate(id1, id2);
//*basic setting*
//<language selection>
const direction = ref(window.innerWidth >= 650 ? "⭢" : "⭣");
//<text entering>:textarea auto size
const resizeTextarea = () => {
  const textarea = document.getElementById("textbox");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
};
watch(chatQst, () => resizeTextarea());
//<lang selection>:change direction
addEventListener("resize", () => {
  if (window.innerWidth >= 650) direction.value = "⭢";
  else direction.value = "⭣";
});
const test = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/test.wav", true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (xhr.status === 200) {
      const blob = xhr.response;
      // 现在您可以使用 blob 对象进行进一步的处理，比如创建 audio 元素
      const audio = document.createElement("audio");
      audio.src = URL.createObjectURL(blob);
      audio.controls = true;
      document.getElementById("chatbox").appendChild(audio);
      console.log(blob);
    } else {
      console.error("无法获取文件");
    }
  };
  xhr.send();
};
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const getRecording = () => {
  const constraints = { audio: true };
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        console.log("Authorization successful! Starting audio recording");
        if (!mediaRecorder.value) mediaRecorder.value = new MediaRecorder(stream);
        console.log(mediaRecorder.value);
        mediaRecorder.value.ondataavailable = (e) => {
          audioChunks.value.push(e.data);
          console.log(audioChunks.value);
          console.log("Data available");
        };
        mediaRecorder.value.onstop = (e) => {
          console.log("Recording stopped");
          const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
          const audio = document.createElement("audio");
          audio.src = URL.createObjectURL(audioBlob);
          audio.controls = true;
          document.getElementById("chatbox").appendChild(audio);
          mediaRecorder.value = null;
          audioChunks.value.length = 0;
        };

        if (mediaRecorder.value.state === "inactive") {
          mediaRecorder.value.start();
          console.log("Recording...");
        } else if (mediaRecorder.value.state === "recording") {

          mediaRecorder.value.stop();
          console.log("Recording ended");
        }
        console.log("Recorder state:", mediaRecorder.value.state);
      })
      .catch(error => {
        console.error("Authorization failed!", error);
      });
  } else {
    console.error("Browser does not support getUserMedia");
  }
};

</script>
<style lang="scss">
.title {
  margin: clamp($sp3, 4vw, $sp6) 0 clamp($sp3, 4vw, $sp6) clamp($sp2, 3.3vw, $sp5);
  font-family: "Madimi One", sans-serif;
}

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

.text-entering {
  width: min(1000px, 90%);
  margin: auto;
  position: relative;

  #textbox {
    width: 100%;
    margin: 0 8px;
    padding: 16px 32px 16px 16px;
    font-family: "Madimi One", sans-serif;
    font-size: 20px;
    color: white;
    background: none;
    border-radius: 15px;
    resize: none;
    overflow: hidden;
  }

  .btn-enter {
    width: 32px;
    height: 32px;
    position: absolute;
    right: 0;
    bottom: 16.5px;
    color: white;
    background: none;
    border: 1px solid white;
    border-radius: 10px;
    cursor: pointer;
    z-index: 1;

    &:hover {
      color: black;
      background: white;
    }
  }

  .btn-record {
    width: 32px;
    height: 32px;
    position: absolute;
    right: 40px;
    bottom: 16.5px;
    color: white;
    background: none;
    border: 1px solid white;
    border-radius: 10px;
    cursor: pointer;
    z-index: 1;

    &:hover {
      color: black;
      background: white;
    }
  }
}
</style>
