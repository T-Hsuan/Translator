<template>
  <h1 class="title">Translator</h1>
  <section id="chatbox"></section>
  <section class="lang-selection">
    <select
      name="source-lang"
      class="lang"
      v-model="source_key"
      @change="getVal(source_key, 'src')"
    >
      <option :value="item.key" v-for="item in source" :key="item">
        {{ item.key }}
      </option>
    </select>
    <p class="direction">⭢</p>
    <select
      name="target-lang"
      class="lang"
      v-model="target_key"
      @change="getVal(target_key, 'tar')"
    >
      <option :value="item.key" v-for="item in target" :key="item">
        {{ item.key }}
      </option>
    </select>
  </section>
  <section class="enter-Qst">
    <textarea
      id="enter-text"
      v-model="chatQst"
      placeholder="Please enter text"
      @keyup.enter="goTranslate()"
      rows="1"
    >
    </textarea>
    <button class="btn-enter" @click="goTranslate()">➤</button>
  </section>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
const chatQst = ref("");
const textarea = ref("");
const source = ref();
const source_key = ref("Mandarin Chinese (Traditional)");
const source_val = ref("cmn_Hant");
const target = ref();
const target_key = ref("English");
const target_val = ref("eng");
const chatAns = ref("");

//get lang data
const getData = async () => {
  try {
    const response = await axios.post("/json/data.json");
    source.value = response.data.source;
    target.value = response.data.target;
  } catch (error) {
    console.error("data請求失敗:", error);
  }
};
onMounted(() => {
  getData();
});

// auto textarea
const resizeTextarea = () => {
  const textarea = document.getElementById("enter-text");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
};
watch(chatQst, () => {
  resizeTextarea();
});

//get data val
const getVal = (val, key) => {
  if (key === "src") {
    const idx = source.value.findIndex((item) => item.key === val);
    source_val.value = source.value[idx].val;
  }
  if (key === "tar") {
    const idx = target.value.findIndex((item) => item.key === val);
    target_val.value = target.value[idx].val;
  }
};

//translate starting
const goTranslate = async () => {
  if (chatQst.value === "" || chatQst.value === null) return;
  const newParagraph = document.createElement("p");
  newParagraph.className = "chatQ";
  newParagraph.textContent = chatQst.value;
  document.getElementById("chatbox").appendChild(newParagraph);
  try {
    const response = await axios.post(
      "https://a854-150-116-161-157.ngrok-free.app/translate_text2speech",
      {
        text: chatQst.value,
        source_lang: source_val.value,
        target_lang: target_val.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    chatAns.value = response.data.translated_text;
    const newParagraph = document.createElement("p");
    newParagraph.className = "chatA";
    newParagraph.textContent = chatAns.value;
    document.getElementById("chatbox").appendChild(newParagraph);
    document.getElementById("enter-text").value = null;
    chatQst.value = "";
  } catch (error) {
    console.error("[請求失敗]:", error);
  }
};
</script>
<style lang="scss">
.title {
  margin: 48px 0 48px 40px;
}
#chatbox {
  width: 100%;
  height: 500px;
  border: 1px solid black;
  overflow-y: auto;
  .chatQ,
  .chatA {
    width: min(1000px, 80%);
    margin: auto;
    padding: 16px;
    font-size: 20px;
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
  .lang {
    margin: 0 8px;
    padding: 4px 8px;
    border-radius: 15px;
  }
  .direction {
    font-size: 28px;
    font-weight: bold;
  }
}
.enter-Qst {
  width: min(1000px, 90%);
  margin: auto;
  position: relative;
  #enter-text {
    width: 100%;
    margin: 0 8px;
    padding: 16px 32px 16px 16px;
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
}
</style>
