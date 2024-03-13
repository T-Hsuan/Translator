<template>
  <header>
    <h1 class="title">{{ title }}</h1>
    <section class="hamburger" @click="hamClick()">
      <span :class="['ham-line', { hamSwitch: menuSwitch }]"></span>
    </section>
    <section :class="['menu', { menuSwitch: menuSwitch }]">
      <nav class="menu-bar">
        <h2 class="title_nav">Function</h2>
        <button @click="funcChange(1)">Translator</button>
        <button @click="funcChange(2)">ChatChat</button>
      </nav>
    </section>
  </header>
</template>
<script setup>
import { ref } from "vue";
import { useChatboxStore } from "@/stores/chatBox.js";
import { storeToRefs } from "pinia";
const chatData = useChatboxStore();
const { Option } = storeToRefs(chatData);
const title = ref("Translator");
const funcChange = (no) => {
  Option.value = no;
  switch (no) {
    case 1:
      title.value = "Translator";
      break;
    case 2:
      title.value = "ChatChat";
      break;
  }
  hamClick();
};
const menuSwitch = ref(false);
const hamClick = () => menuSwitch.value = !menuSwitch.value;
</script>
<style lang="scss" scoped>
header {
  width: 100%;
  height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin: auto;
  position: relative;
  top: 0;
  z-index: 99;

  @media screen and (min-width: $s) {
    height: 100px;
  }

  .title {
    // margin: clamp($sp3, 4vw, $sp6) 0 clamp($sp3, 4vw, $sp6) clamp($sp2, 3.3vw, $sp5);
    margin: 0 clamp($sp2, 3.3vw, $sp5);
  }

  .hamburger {
    margin: 0 clamp($sp2, 3.3vw, $sp5);
    padding: 0;

    .ham-line {
      display: inline-block;
      width: 25px;
      height: 20px;
      position: relative;

      &::before,
      &::after {
        content: "";
        width: 25px;
        height: 4px;
        background: white;
        border-radius: 2px;
        position: absolute;
        left: 0;
        transition: all 0.5s ease-in-out;
      }

      &::before {
        top: 4px;
        box-shadow: 0 16px white;
      }

      &::after {
        bottom: 4px;
      }
    }

    .hamSwitch {
      &::before {
        top: 7.5px;
        box-shadow: none;
        transform: rotate(225deg);
      }

      &::after {
        bottom: 8.5px;
        transform: rotate(135deg);
      }
    }
  }

  .menu {
    width: 100%;
    height: 100px;
    position: absolute;
    top: -100px;
    background: white;
    transition: top 0.5s ease-in-out;
    z-index: -1;

    .menu-bar {
      padding: 0 clamp($sp2, 3.3vw, $sp5);

      .title_nav {
        color: black;
      }

      button {
        margin: $sp2 auto;
        font-size: clamp(14px, 1.6vw, 20px);

        &:hover {
          color: pink;
        }
      }
    }
  }

  .menuSwitch {
    top: 75px;
    transition: top 0.5s ease-in-out;

    @media screen and (min-width: $s) {
      top: 100px;
    }
  }
}
</style>
