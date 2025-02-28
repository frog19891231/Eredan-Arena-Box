<template>
  <div class="intro-container">
    <p class="intro-text">
      Due to the scarcity of information available for this game, I created this website to make it easier for players
      to enjoy their experience.
    </p>
    <p class="intro-text">Most of the data here is sourced from the official Discord, and my role is simply to organize
      and share it.</p>
  </div>
  <div class="dashed-line"></div>
  <Div>
    <button class="image-button" @click="redirectToNewPage">
      <img src="https://support.discord.com/hc/theming_assets/01HZPN9XBJQZSPXWYYVY76TBEE">
    </button>

  </Div>
  <div>
    <div class="fb-page" data-href="https://www.facebook.com/EredanArenaOfficial/" data-tabs="timeline" data-width="500"
      data-height="600" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false"
      data-show-facepile="true">
    </div>
  </div>

</template>

<script>
export default {
  mounted() {
    this.loadFacebookSDK();
  },
  methods: {
    redirectToNewPage() {
      window.location.href = "https://discord.gg/uGjZ84wUEU"; // 替換為你的目標網址
    },
    loadFacebookSDK() {
      if (!window.FB) {
        let script = document.createElement("script");
        script.src = "https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v18.0";
        script.async = true;
        document.body.appendChild(script);
      } else {
        window.FB.XFBML.parse();
      }
    }
  }
}
</script>

<style scoped>
/* 樣式保持不變 */
.dashed-line {
    width: 100%;
    border-top: 2px dashed #ddd;
    margin: 10px 0;
}

.intro-container {
  max-width: 800px;
  /* 限制最大寬度 */
  margin: 0 auto;
  /* 水平居中 */
  padding: 2rem;
  /* 內邊距 */
  /*background-color: #f9fafb; /* 淺灰色背景 */
  border-radius: 12px;
  /* 圓角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* 陰影效果 */
}

.intro-text {
  font-size: 1.125rem;
  /* 字體大小 */
  line-height: 1.75;
  /* 行高 */
  color: #ffffff;
  /* 文字顏色 */
  text-align: center;
  /* 文字居中 */
  font-style: italic;
  /* 斜體 */
}

.image-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.image-button img {
  padding: 80px 0;
  width: 400px;
  /* 調整圖片大小 */
  height: auto;
  transition: transform 0.2s ease;
  /* 添加懸停效果 */
}

.image-button:hover img {
  transform: scale(1.1);
  /* 圖片放大 */
}
</style>