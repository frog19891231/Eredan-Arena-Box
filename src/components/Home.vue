<template>
  <div class="min-h-screen flex flex-col">
    <!-- 導覽列 -->
    <nav class="navbar">
      <div class="container">
        <!-- Logo -->
        <div class="logo">MyLogo</div>

        <!-- 漢堡選單按鈕（小螢幕） -->
        <button class="menu-toggle" @click="toggleMenu">☰</button>

        <!-- 主要標籤 -->
        <ul :class="{ 'nav-links': true, 'show-menu': showMenu }">
          <li><a href="#">篩選</a></li>
        </ul>
      </div>
    </nav>

    <!-- 返回頂部按鈕 -->
    <button v-show="showBackToTopButton" @click="scrollToTop" class="back-to-top">
      ⬆
    </button>

    <!-- 主內容區域 -->
    <main class="content">
      <!-- 動態組件 -->
      <component :is="currentComponent"></component>
      <CardFilter />
    </main>

    <!-- 頁腳 -->
    <footer class="footer">
      &copy; 2025 MyWebsite. 版權所有。
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import CardFilter from './CardFilter-c.vue'; // 確保路徑正確

const showNavbar = ref(true);
const lastScrollY = ref(0);
const showMenu = ref(false);
const showBackToTopButton = ref(false);
const currentComponent = ref('CardFilter');

const handleScroll = () => {
  lastScrollY.value = window.scrollY;
  showBackToTopButton.value = lastScrollY.value > 200;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>


<style scoped>
/* 導覽列樣式 */
.navbar {
  background-color: #1e40af;
  /* 背景顏色 */
  color: white;
  /* 文字顏色 */
  padding: 1rem;
  /* 內邊距 */
  display: flex;
  /* 使用 Flexbox 排版 */
  justify-content: space-between;
  /* 項目分佈於兩端 */
  align-items: center;
  /* 垂直居中 */
  position: relative;
  /* 正常元素流，不固定位置 */
  width: 100%;
  /* 寬度 100% */
  z-index: 50;
  /* 層級高於其他元素 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 陰影效果 */
}

/* 包裹導覽列內容的容器樣式 */
.container {
  display: flex;
  /* 使用 Flexbox 排版 */
  justify-content: space-between;
  /* 項目分佈於兩端 */
  align-items: center;
  /* 垂直居中 */
  width: 90%;
  /* 設定容器寬度 */
  max-width: 1200px;
  /* 最大寬度 1200px */
}

/* Logo 樣式 */
.logo {
  font-size: 1.5rem;
  /* 字體大小 */
  font-weight: bold;
  /* 加粗文字 */
}

/* 漢堡選單按鈕樣式（僅在小螢幕顯示） */
.menu-toggle {
  display: none;
  /* 預設隱藏 */
  background: none;
  /* 去除背景 */
  border: none;
  /* 去除邊框 */
  font-size: 1.5rem;
  /* 字體大小 */
  color: white;
  /* 文字顏色 */
  cursor: pointer;
  /* 滑鼠為手形 */
}

/* 頁面上方導航項目的樣式 */
.nav-links {
  display: flex;
  /* 使用 Flexbox 排版 */
  gap: 1.5rem;
  /* 項目間距 */
  font-size: 1.125rem;
  /* 字體大小 */
}

/* 導覽項目連結的樣式 */
.nav-links a {
  text-decoration: none;
  /* 取消底線 */
  color: white;
  /* 文字顏色 */
  transition: color 0.3s ease-in-out;
  /* 滑鼠懸停過渡效果 */
}

/* 當滑鼠懸停時顯示底線 */
.nav-links a:hover {
  text-decoration: underline;
}

/* 搜尋欄樣式 */
.search-bar input {
  padding: 0.5rem;
  /* 內邊距 */
  border-radius: 8px;
  /* 圓角邊框 */
  border: 1px solid #d1d5db;
  /* 邊框顏色 */
  outline: none;
  /* 去除焦點輪廓 */
}

/* 手機版樣式 */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
    /* 顯示漢堡選單 */
  }

  .nav-links {
    display: none;
    /* 預設隱藏導航項目 */
    flex-direction: column;
    /* 排成垂直 */
    position: absolute;
    /* 絕對定位 */
    top: 100%;
    /* 顯示在導航列下方 */
    left: 0;
    /* 左對齊 */
    width: 100%;
    /* 寬度 100% */
    background: #1e40af;
    /* 背景顏色 */
    padding: 1rem;
    /* 內邊距 */
  }

  .show-menu {
    display: flex;
    /* 顯示導航項目 */
  }
}

/* 返回頂部按鈕樣式 */
.back-to-top {
  position: fixed;
  /* 固定位置 */
  bottom: 20px;
  /* 距離頁面底部 20px */
  right: 20px;
  /* 距離頁面右側 20px */
  background: #1e40af;
  /* 背景顏色 */
  color: white
    /* 頁腳樣式 */
}

/* 頁尾樣式 */
.footer {
  background-color: #1f2937;
  /* 背景顏色 */
  color: white;
  /* 文字顏色 */
  text-align: center;
  /* 文字置中 */
  padding: 1rem;
  /* 內邊距 */
  margin-top: 2rem;
  /* 上邊距 */
}
</style>