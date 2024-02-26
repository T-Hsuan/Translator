<template>
  <h1 class="title">翻譯</h1>
  <div id="chatbox"></div>
  <label for="source_lang">source_lang</label>
  <select
    name="source_lang"
    id="source_lang"
    v-model="source_key"
    @change="getVal(source_key, 'src')"
  >
    <option :value="item.key" v-for="item in source" :key="item">
      {{ item.key }}
    </option>
  </select>
  <label for="target_lang">target_lang</label>
  <select
    name="target_lang"
    id="target_lang"
    v-model="target_key"
    @change="getVal(target_key, 'tar')"
  >
    <option :value="item.key" v-for="item in target" :key="item">
      {{ item.key }}
    </option>
  </select>
  <br />
  <input
    type="text"
    name="enterQst"
    id="enterQst"
    v-model="chatQst"
    placeholder="請輸入文字"
    @keyup.enter="goTranslate()"
  />
  <img
    class="go-translate"
    src="/img/enter.svg"
    alt="enter"
    @click="goTranslate()"
  />
  <!-- <button @click="getQst()">測試</button> -->
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
const chatQst = ref("");
const source = ref();
const source_key = ref("Mandarin Chinese (Traditional)");
const source_val = ref("cmn_Hant");
const target = ref();
const target_key = ref("English");
const target_val = ref("eng");
const chatAns = ref("");

//取得lang data
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

//取得 data val
const getVal = (val, key) => {
  if (key === "src") {
    const idx = source.value.findIndex((item) => item.key === val);
    source_val.value = source.value[idx].val;
    console.log(source_val.value);
  }
  if (key === "tar") {
    const idx = target.value.findIndex((item) => item.key === val);
    target_val.value = target.value[idx].val;
    console.log(target_val.value);
  }
};

//translate starting
const goTranslate = async () => {
  if (chatQst.value === "" || chatQst.value === null) return;
  const newParagraph = document.createElement("p");
  newParagraph.className = "chatQ";
  newParagraph.textContent = "Q：" + chatQst.value;
  document.getElementById("chatbox").appendChild(newParagraph);
  try {
    const response = await axios.post(
      "http://192.168.210.51:8080/translate",
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
    newParagraph.textContent = "A：" + chatAns.value;
    document.getElementById("chatox").appendChild(newParagraph);
  } catch (error) {
    console.error("[請求失敗]:", error);
  }
};

//測試用
// const getQst = () => {
//   if (chatQst.value !== "" && chatQst.value !== null) {
//     const newParagraph = document.createElement("p");
//     newParagraph.className = "chatQ";
//     newParagraph.textContent =
//       "問題：" +
//       chatQst.value +
//       "  src：" +
//       source_key.value +
//       "  tar：" +
//       target_key.value;
//     document.getElementById("chat").appendChild(newParagraph);
//   } else {
//     window.alert("請輸入文字");
//   }
// };
</script>
<style lang="scss">
#chatbox {
  width: 500px;
  height: 500px;
  overflow-y: auto;
  border: 1px solid black;
}
input {
  width: 500px;
  vertical-align: top;
}
.go-translate {
  border: 1px solid;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background: pink;
  }
}
</style>
