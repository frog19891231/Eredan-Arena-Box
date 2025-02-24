<template>
  <div class="min-h-screen flex flex-col">
    <!-- 導覽列 -->
    <nav class="navbar" :class="{ 'navbar-hidden': !showNavbar }">
      <div class="container_home">
        <!-- Logo -->
        <div class="logo">MyLogo</div>

        <!-- 漢堡選單按鈕（小螢幕） -->
        <button class="menu-toggle" @click="toggleMenu">☰</button>

        <!-- 主要標籤 -->
        <ul :class="{ 'nav-links': true, 'show-menu': showMenu }">
          <li><a href="#" @click.prevent="switchComponent('CardFilter')">Card</a></li>
          <li><a href="#" @click.prevent="switchComponent('SkillShow')">Content</a></li>
        </ul>
      </div>
    </nav>

    <!-- 返回頂部按鈕 -->
    <button
      v-show="showBackToTopButton"
      @click="scrollToTop"
      class="back-to-top"
    >
      ⬆
    </button>

    <!-- 主內容區域 -->
    <main class="main">
      <!-- 動態組件 -->
      <component :is="currentComponent"></component>
    </main>

    <!-- 頁腳 -->
    <footer class="footer">
      &copy; 2025 MyWebsite. 版權所有。
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, markRaw } from 'vue';
import CardFilter from "./CardFilter.vue";
import SkillShow from './SkillShow.vue';
import AddData from './AddData.vue';


// 狀態管理
const showNavbar = ref(true);
const lastScrollY = ref(0);
const showMenu = ref(false);
const showBackToTopButton = ref(false);

// 使用 markRaw 標記組件
const components = {
  CardFilter: markRaw(CardFilter),
  SkillShow: markRaw(SkillShow),
  AddData: markRaw(AddData),
};
const currentComponent = ref(components.AddData);

// 切換組件功能
const switchComponent = (componentName) => {
  currentComponent.value = components[componentName];
};

// 滾動事件處理
const handleScroll = () => {
  const currentScrollY = window.scrollY;

  // 控制導航欄的顯示/隱藏
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    showNavbar.value = false; // 向下滾動時隱藏導航欄
  } else {
    showNavbar.value = true; // 向上滾動時顯示導航欄
  }

  // 控制返回頂部按鈕的顯示
  showBackToTopButton.value = currentScrollY > 200;

  // 更新最後的滾動位置
  lastScrollY.value = currentScrollY;
};

// 返回頂部功能
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 切換漢堡選單
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// 生命週期鉤子
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
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed; /* 改為固定定位 */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out; /* 添加過渡效果 */
}

/* 導航欄隱藏時的樣式 */
.navbar-hidden {
  transform: translateY(-100%); /* 隱藏導航欄 */
}

/* 包裹導覽列內容的容器樣式 */
.container_home {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
}

/* Logo 樣式 */
.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

/* 漢堡選單按鈕樣式（僅在小螢幕顯示） */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

/* 頁面上方導航項目的樣式 */
.nav-links {
  display: flex;
  gap: 1.5rem;
  font-size: 1.125rem;
}

/* 導覽項目連結的樣式 */
.nav-links a {
  text-decoration: none;
  color: white;
  transition: color 0.3s ease-in-out;
}

/* 當滑鼠懸停時顯示底線 */
.nav-links a:hover {
  text-decoration: underline;
}

/* 手機版樣式 */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #1e40af;
    padding: 1rem;
  }

  .show-menu {
    display: flex;
  }
}

/* 返回頂部按鈕樣式 */
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #1e40af;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
}

/* 頁尾樣式 */
.footer {
  background-color: #1f2937;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
}

.main {
  padding-top: 120px;
}
</style>