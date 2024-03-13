import { defineStore } from "pinia";
import { ref } from "vue";
export const useChatboxStore = defineStore("chatbox", () => {
  const chatQst = ref("");
  const chatAns = ref("");
  const mediaRecorder = ref(null);
  const audioBlob = ref(null); //Blob{size: 0, type: "audio/wav"}
  const getAudio = () => {
    const constraints = { audio: true };
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log("Authorization successful!");
          if (!mediaRecorder.value) {
            mediaRecorder.value = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.value.ondataavailable = (e) => {
              audioChunks.push(e.data);
              console.log("Data available");
            };

            mediaRecorder.value.onstop = () => {
              audioBlob.value = new Blob(audioChunks, {
                type: "audio/wav",
              });
              if (audioBlob.value) {
                const Qst = document.createElement("audio");
                Qst.className = "chatQ chatQ_audio";
                Qst.src = URL.createObjectURL(audioBlob.value);
                Qst.controls = true;
                document
                  .getElementsByClassName("recording-block")[0]
                  .appendChild(Qst);
              }
            };
          }

          if (mediaRecorder.value.state === "inactive") {
            mediaRecorder.value.start();
            console.log("Recording...");
          } else if (mediaRecorder.value.state === "recording") {
            mediaRecorder.value.stop();
            console.log("Recording ended");
          }
        })
        .catch((error) => {
          console.error("Authorization failed!", error);
        });
    } else {
      console.error("Browser doesn't support getUserMedia");
    }
  };
  return {
    chatQst,
    chatAns,
    getAudio,
    audioBlob,
  };
});
