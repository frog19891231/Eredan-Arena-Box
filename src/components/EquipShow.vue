<template>
  <div class="container">
    <h1>Equip</h1>
    <p>Just...equip information.</p>
    <!--
    <p v-html="parseText(txt)"></p>
      <img :src="image" :alt="'Image ' + index" />
    -->

    <!-- 搜尋欄 -->
    <div class="search-bar">
      <div class="search-input-container">
        <input type="text" v-model="searchQuery" placeholder="search" @input="handleSearch" class="search-input-text" />
        <!-- 清除按鈕 -->
        <button v-if="searchQuery" class="clear-button" @click="clearSearch">
          ×
        </button>
      </div>
    </div>
    <!-- 技能列表 -->
    <div class="equip-container">
      <div v-if="filteredequip.length > 0" class="equip-list">
        <div v-for="equip in filteredequip" :key="equip.id" class="equip-item">
          <img :src="equip.url" :alt="equip.name" :class="['equip-image', getRarityClass(equip.rarity)]" />
          <div class="equip-details">
            <h2 class="equip-name">{{ equip.name }}</h2>
            <!-- 使用 v-html 渲染轉換後的內容 -->
            <!--v-html="parseText(equip.effect)"-->
            <p class="equip-description">{{ equip.effect }}</p>
          </div>
        </div>
      </div>
      <div v-else class="no-results">
        <p>no </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import data_lib from '../data/library.json';

// 從 JSON 文件中加載技能數據
const libraries = ref(data_lib);
const equipMap = ref(new Map());


// 動態加載圖片
const imageFiles = import.meta.glob("../assets/img/aggregats/*.{jpg,png,gif,jpeg,svg}");/**/
const images = ref([]);

onMounted(() => {
  for (const path in imageFiles) {
    const module = imageFiles[path]();
    images.value.push(module.default);
  }
});

// 將技能數據轉換為 Map 儲存
onMounted(() => {
  libraries.value.Equip.forEach(equip => {
    equipMap.value.set(equip.name, equip);
  });
});

// 搜尋關鍵字
const searchQuery = ref('');

// 計算屬性：根據搜尋關鍵字過濾技能列表
const filteredequip = computed(() => {
  const equipArray = Array.from(equipMap.value.values());
  if (!searchQuery.value) {
    return equipArray; // 如果沒有輸入關鍵字，返回所有技能
  }
  return equipArray.filter(equip =>
    (equip.name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 搜尋處理
const handleSearch = () => {
  // 可以在這裡添加額外的搜尋邏輯
};

// 清除搜尋內容
const clearSearch = () => {
  searchQuery.value = '';
};

// 根據稀有度獲取樣式
const getRarityClass = (rarity) => {
  const rarityColors = {
    Common: 'rarity-Common',
    Rare: 'rarity-Rare',
    Epic: 'rarity-Epic',
    Legendary: 'rarity-Legendary',
  };
  return rarityColors[rarity] || 'tag-default'; // 預設樣式
};

const txt = ref(" At the start of the fight you receive 48-247 Thorns. :sap:: you receive 48-247 Lightroot instead. ")

// 解析文本，將特定語法轉換為圖片
const parseText = (text) => {
  const regex = /:\w+:/g; // 匹配 :word: 格式的語法
  return text.replace(regex, (match) => {
    const keyword = match.slice(1, -1); // 去掉前後的冒號
    return `<img src="/images/${keyword}.png" alt="${keyword}" class="emoji" />`;
  });
};
</script>

<style scoped>
/* 整體佈局 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

/* 搜尋欄樣式 */
.search-bar {
  margin-bottom: 30px;
  text-align: center;
}

.search-input-container {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 400px;
  /* 控制搜尋欄的最大寬度 */
}

/* 輸入框樣式 */
.search-input-text {
  width: 100%;
  /* 控制輸入框的寬度 */
  padding: 12px 40px 12px 16px;
  /* 右邊留出 40px 的空間 */
  font-size: 16px;
  border: 2px solid #1e40af;
  border-radius: 25px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input-text:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}


/* 清除按鈕樣式 */
.clear-button {
  position: absolute;
  right: 16px;
  /* 調整與右邊的距離 */
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  z-index: 10;
  /* 確保按鈕在最上層 */
  width: 24px;
  /* 固定寬度 */
  height: 24px;
  /* 固定高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  color: #1e40af;
}

/* 技能列表容器 */
.equip-container {
  margin-top: 20px;
}

/* 技能列表樣式 */
.equip-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 技能項目樣式 */
.equip-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.equip-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

/* 技能詳細信息樣式 */
.equip-details {
  flex: 1;
  margin-left: 20px;
}

.equip-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e40af;
  margin: 0 0 8px;
}

.equip-description {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.equip-image {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  border-radius: 40px;
  background-color: #e0be4fa1;
  border: 10px solid;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rarity-Common {
  border-color: #666;
}

.rarity-Rare {
  border-color: #1e40af;
}

.rarity-Epic {
  border-color: blueviolet;
}

.rarity-Legendary {
  border-color: chocolate;
}

/* 讓卡片在小螢幕上自動換行，變為一排顯示1個 */
@media (max-width: 768px) {
  .equip-item {
    display: block;
  }
}

/* 無結果提示 */
.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
  padding: 20px;
}

/* 表情圖片樣式 */
.emoji {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>