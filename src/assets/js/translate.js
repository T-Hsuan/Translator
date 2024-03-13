import axios from "axios";
import { ref } from "vue";

const API_URL = "https://f9f3-150-116-161-157.ngrok-free.app";

export const textTranslated = async (chatQst, src_val, tar_val) => {
  if (chatQst === "" || chatQst === null || chatQst === undefined) return;
  const Qst = document.createElement("p");
  Qst.className = "chatQ chatQ_text";
  Qst.textContent = chatQst;
  document.getElementById("chatbox").appendChild(Qst);
  try {
    const response = await axios.post(
      `${API_URL}/translate_text`,
      {
        text: chatQst,
        source_lang: src_val,
        target_lang: tar_val,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //text ans
    document.getElementById("textbox").value = "";
    chatQst = null;
    const Ans_text = response.data.translated_text;
    const Ans = document.createElement("p");
    Ans.className = "chatA chatA_text";
    Ans.textContent = Ans_text;
    document.getElementById("chatbox").appendChild(Ans);
  } catch (error) {
    console.error("[請求失敗]:", error);
  }
};

const Base64ToBlob = (base64) => {
  //將Base64字串解碼為原始二進位數據
  const binary = atob(base64);
  //創建一個Uint8Array以存儲二進位數據
  const uint8Array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }
  return new Blob([uint8Array], { type: "audio/wav" });
};

export const audioTranslated = async (audioBlob, tar_val) => {
  if (audioBlob) {
    const Qst = document.createElement("audio");
    Qst.className = "chatQ chatQ_audio";
    Qst.src = URL.createObjectURL(audioBlob);
    Qst.controls = true;
    document.getElementById("chatbox").appendChild(Qst);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("target_lang", tar_val);
      const response = await axios.post(
        `${API_URL}/translate_speech2speech`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //text ans
      const Ans_text = response.data.translated_text;
      const AnsP = document.createElement("p");
      AnsP.className = "chatA chatA_text";
      AnsP.textContent = Ans_text;
      document.getElementById("chatbox").appendChild(AnsP);
      //audio ans
      const Ans_audio = response.data.base64_audiodata;
      const blob = Base64ToBlob(Ans_audio);
      const AnsA = document.createElement("audio");
      AnsA.className = "chatA chatA_audio";
      AnsA.src = URL.createObjectURL(blob);
      AnsA.controls = true;
      document.getElementById("chatbox").appendChild(AnsA);
      audioBlob = null;
    } catch (error) {
      console.error("[請求失敗]:", error);
    }
  }
};
