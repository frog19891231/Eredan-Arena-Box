<template>
  <div class="min-h-screen flex flex-col">
    <!-- 導覽列 -->
    <nav ref="navbarRef" class="navbar" :class="{ 'navbar-hidden': !showNavbar }">
      <div class="container_home">
        <!-- Logo -->
        <div class="logo"><a href="#" @click.prevent="switchComponent('intro')">
            <img src="../../public/EABox-w.svg" ></img></a></div>

        <!-- 漢堡選單按鈕（小螢幕） -->
        <button class="menu-toggle" @click="toggleMenu">☰</button>

        <!-- 主要標籤 -->
        <ul :class="{ 'nav-links': true, 'show-menu': showMenu }">
          <li v-for="link in links" :key="link['1st']">
            <a href="#" @click.prevent="switchComponent(link['vue'])">{{ link['name'] }}</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 返回頂部按鈕 -->
    <transition name="fade">
      <button v-show="showBackToTopButton" @click="scrollToTop" class="back-to-top">
        ⬆
      </button>
    </transition>

    <!-- 主內容區域 -->
    <main class="main" :style="{ paddingTop: `${navbarHeight + 32}px` }">
      <component :is="currentComponent"></component>
    </main>

    <!-- 頁腳 -->
    <footer class="footer">
      Copyright &copy; 2025 Eredan-Arena-Box.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, markRaw, watch } from 'vue';
import intro from './intro.vue';
import CardFilter from "./CardFilter.vue";
import SkillShow from './SkillShow.vue';
import EquipShow from './EquipShow.vue';
import AddData from './AddData.vue';
import AddCard from './AddCard.vue';
import Feedback from './Feedback.vue';
import cardOCR from './cardOCR.vue';
import EquipImageSearch from './EquipImageSearch.vue';

// 用於存儲當前的 Hash 值
const hash = ref('');

// 更新 Hash 值的函數
const updateHash = () => {
  hash.value = window.location.hash.replace('#', ''); // 去掉 # 符號
};

// 監聽 Hash 變化
onMounted(() => {
  updateHash(); // 初始加載時檢查 Hash
  window.addEventListener('hashchange', updateHash); // 監聽 Hash 變化
});

// 移除事件監聽
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', updateHash);
});

// 狀態管理
const showNavbar = ref(true);
const lastScrollY = ref(0);
const showMenu = ref(false);
const showBackToTopButton = ref(false);
const navbarHeight = ref(0);
const navbarRef = ref(null);

// 使用 markRaw 標記組件
const components = {
  intro: markRaw(intro),
  CardFilter: markRaw(CardFilter),
  SkillShow: markRaw(SkillShow),
  EquipShow: markRaw(EquipShow),
  AddData: markRaw(AddData),
  AddCard: markRaw(AddCard),
  Feedback: markRaw(Feedback),
  cardOCR: markRaw(cardOCR),
  EquipImageSearch: markRaw(EquipImageSearch),
};
const currentComponent = ref(components.intro);

// 導航連結
const links = ref([]);

// 根據 Hash 值更新導航連結
const updateLinks = () => {
  if (hash.value === '123') {
    links.value = [
      { "vue": "AddData", "name": "AddData" },
      { "vue": "AddCard", "name": "AddCard" },
      { "vue": "EquipImageSearch", "name": "EquipImg" },
      { "vue": "cardOCR", "name": "OCR" }
    ];
  } else {
    links.value = [
      { "vue": "CardFilter", "name": "Card" },
      { "vue": "SkillShow", "name": "Skill" },
      { "vue": "EquipShow", "name": "Equip" },
      { "vue": "Feedback", "name": "Feedback" }
    ];
  }
};

// 監聽 hash 變化，更新導航連結
watch(hash, updateLinks);

// 初始加載時更新導航連結
updateLinks();

// 切換組件功能
const switchComponent = (componentName) => {
  currentComponent.value = components[componentName];
  showMenu.value = false;
};

// 滾動事件處理
let scrollTimeout;

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  // 清除之前的延遲
  clearTimeout(scrollTimeout);

  // 設置延遲
  scrollTimeout = setTimeout(() => {
    if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
      showNavbar.value = false; // 向下滾動時隱藏導航欄
    } else {
      showNavbar.value = true; // 向上滾動時顯示導航欄
    }

    // 控制返回頂部按鈕的顯示
    showBackToTopButton.value = currentScrollY > 200;

    // 更新最後的滾動位置
    lastScrollY.value = currentScrollY;
  }, 100); // 延遲 100ms
};

// 返回頂部功能
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 切換漢堡選單
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// 動態調整導航欄高度
onMounted(() => {
  const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      navbarHeight.value = entry.contentRect.height;
    }
  });

  if (navbarRef.value) {
    observer.observe(navbarRef.value);
  }

  onBeforeUnmount(() => {
    observer.disconnect();
  });

  // 監聽滾動事件
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

/* 導航欄隱藏時的樣式 */
.navbar-hidden {
  transform: translateY(-100%);
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
  font-size: clamp(1.25rem, 5vw, 2rem);
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
  font-size: clamp(1rem, 3vw, 1.125rem);
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
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
  }

  .show-menu {
    display: flex;
    max-height: 500px;
    /* 根據內容調整 */
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
  z-index: 1000;
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
  padding-top: calc(80px + 2rem);
  /* 導航欄高度 + 額外間距 */
}

@media (max-width: 768px) {
  .main {
    padding-top: calc(60px + 2rem);
    /* 小螢幕下導航欄高度較小 */
  }
}

/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>