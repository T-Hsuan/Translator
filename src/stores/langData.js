import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import axios from "axios";

export const useDataStore = defineStore("languageData", () => {
  const source = ref();
  const source_key = ref("Mandarin Chinese (Traditional)");
  const source_val = ref("cmn_Hant");
  const target = ref();
  const target_key = ref("English");
  const target_val = ref("eng");

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
  //[input block]:get data val
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

  return {
    source,
    source_key,
    source_val,
    target,
    target_key,
    target_val,
    getData,
    getVal,
  };
});
