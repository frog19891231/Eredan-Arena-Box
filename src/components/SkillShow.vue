<template>
  <div class="container">
    <h1>Content</h1>
    <p>This is the content of ability display.</p>

    <!-- 搜尋欄 -->
    <div class="search-bar">
      <div class="search-input-container">
        <input type="text" v-model="searchQuery" placeholder="輸入技能名稱進行搜尋" @input="handleSearch"
          class="search-input-text" />
        <!-- 清除按鈕 -->
        <button v-if="searchQuery" class="clear-button" @click="clearSearch">
          ×
        </button>
      </div>
    </div>

    <!-- 技能列表 -->
    <div class="skills-container">
      <div v-if="filteredSkills.length > 0" class="skills-list">
        <div v-for="skill in filteredSkills" :key="skill.id" class="skill-item">
          <img :src="skill.img_url" :alt="skill.name" class="skill-image" />
          <div class="skill-details">
            <h2 class="skill-name">{{ skill.name }}</h2>
            <p class="skill-description" style="white-space: pre-line; text-align: left">{{ skill.description }}</p>
          </div>

        </div>
      </div>
      <div v-else class="no-results">
        <p>沒有找到相關技能。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import data_lib from '../data/library.json';

// 從 JSON 文件中加載技能數據
const libraries = ref(data_lib);
const skillsMap = ref(new Map());

// 將技能數據轉換為 Map 儲存
onMounted(() => {
  libraries.value.Skill.forEach(skill => {
    skillsMap.value.set(skill.id, skill);
  });
});

// 搜尋關鍵字
const searchQuery = ref('');

// 計算屬性：根據搜尋關鍵字過濾技能列表
const filteredSkills = computed(() => {
  const skillsArray = Array.from(skillsMap.value.values());
  if (!searchQuery.value) {
    return skillsArray; // 如果沒有輸入關鍵字，返回所有技能
  }
  return skillsArray.filter(skill =>
    (skill.name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
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
.skills-container {
  margin-top: 20px;
  /* 確保與上方內容有間距 */
}

/* 技能列表樣式 */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 技能項目樣式 */
.skill-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.skill-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

/* 技能詳細信息樣式 */
.skill-details {
  flex: 1;
  margin-left: 20px;
  /* 與圖示之間的間距 */
}

.skill-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e40af;
  margin: 0 0 8px;
}

.skill-description {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* 技能圖示樣式 */
.skill-image {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

/* 讓卡片在小螢幕上自動換行，變為一排顯示1個 */
@media (max-width: 768px) {
  /* 技能項目樣式 */
  .skill-item {
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
</style>