<template>
  <div class="intro-container">
    <p class="intro-text">
      Due to the scarcity of information available for this game, I created this website to make it easier for players to enjoy their experience.
    </p>
    <p class="intro-text">Most of the data here is sourced from the official Discord, and my role is simply to organize and share it.</p>
  </div>
  <div>
    <div class="fb-page"
         data-href="https://www.facebook.com/EredanArenaOfficial/"
         data-tabs="timeline"
         data-width="500"
         data-height="600"
         data-small-header="false"
         data-adapt-container-width="true"
         data-hide-cover="false"
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
.intro-container {
  max-width: 800px; /* 限制最大寬度 */
  margin: 0 auto; /* 水平居中 */
  padding: 2rem; /* 內邊距 */
  /*background-color: #f9fafb; /* 淺灰色背景 */
  border-radius: 12px; /* 圓角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 陰影效果 */
}

.intro-text {
  font-size: 1.125rem; /* 字體大小 */
  line-height: 1.75; /* 行高 */
  color: #ffffff; /* 文字顏色 */
  text-align: center; /* 文字居中 */
  font-style: italic; /* 斜體 */
}
</style>