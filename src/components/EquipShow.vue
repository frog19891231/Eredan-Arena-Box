<template>
  <div class="container">
    <h1>Equip</h1>
    <p>Just...equip information.</p>

    <!-- 搜尋欄 -->
    <div class="search-bar">
      <div class="search-input-container">
        <input type="text" v-model="searchQuery" placeholder="search" @input="handleSearch" class="search-input-text" />
        <!-- 清除按鈕 -->
        <button v-if="searchQuery || selectedRarity || selectedPosition || selectedTag" class="clear-button"
          @click="clearSearch">
          ×
        </button>
        <button class="adv-button" @click="toggleAdvSearch">
          Adv
        </button>
      </div>

      <!-- 進階篩選器 -->
      <div v-if="showAdvSearch" class="adv-search-container">
        <div>
          <label for="rarity">Rarity:</label>
          <select id="rarity" v-model="selectedRarity">
            <option value="">All</option>
            <option v-for="rarity in EquipRarity" :key="rarity" :value="rarity">
              {{ rarity }}
            </option>
          </select>
        </div>

        <div>
          <label for="position">Position:</label>
          <select id="position" v-model="selectedPosition">
            <option value="">All</option>
            <option v-for="pos in position" :key="pos" :value="pos">
              {{ pos }}
            </option>
          </select>
        </div>

        <!-- Tag 篩選器 -->
        <div>
          <label>Tags:</label>
          <div class="tag-container">
            <button v-for="tag in uniqueTags" :key="tag" :class="['tag-button', { active: selectedTag === tag }]"
              @click="selectTag(tag)" v-html="emoToImg(tag)">
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- 技能列表 -->
    <div class="equip-container">
      <div v-if="filteredequip.length > 0" class="equip-list">
        <div v-for="equip in filteredequip" :key="equip.name" class="equip-item">
          <img :src="equip.url" :alt="equip.name" :class="['equip-image', getRarityClass(equip.rarity)]" />
          <div class="equip-details">
            <h2 class="equip-name">{{ equip.name }}</h2>
            <pre class="equip-description" v-html="formattedText(equip.effect)"></pre>
          </div>
        </div>
      </div>
      <div v-else class="no-results">
        <p>No results found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/******************************************************************** */
import { ref, computed, onMounted } from "vue";
import data_lib from "../data/library.json";

// 從 JSON 文件中加載技能數據
const libraries = ref(data_lib);
const equipMap = ref(new Map());
const emojiData = ref({});
const taghub = ref(new Set()); // 使用 Set 來存儲唯一的 tag

const emoji = ref([]);

// 篩選標的選項
const EquipRarity = ref(["Common", "Rare", "Epic", "Legendary"]);
const position = ref(["1st / Attacker", "2nd / Defender"]);

// 選擇的篩選條件
const selectedRarity = ref("");
const selectedPosition = ref("");
const selectedTag = ref("")

// 搜尋關鍵字
const searchQuery = ref("");

// 是否顯示進階篩選器
const showAdvSearch = ref(false);

// 將 Set 轉換為陣列
const uniqueTags = computed(() => Array.from(taghub.value));

/************************************************************************** */
// 加載圖片
const loadImages = async () => {
  const modules = import.meta.glob("../assets/img/aggregats/*.{jpg,png}");/**/
  const paths = Object.keys(modules);

  const images = await Promise.all(
    paths.map(async (path) => {
      const module = await modules[path]();
      return {
        id: path.split("/").pop().split(".")[0], // 提取檔案名稱（不含副檔名）
        path: module.default, // 圖片的實際路徑
      };
    })
  );

  emoji.value = images; // 直接賦值，提高效能
};

// 計算屬性：根據搜尋關鍵字和篩選條件過濾技能列表
const filteredequip = computed(() => {
  const equipArray = Array.from(equipMap.value.values());
  return equipArray.filter((equip) => {
    const matchesSearch = equip.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesRarity =
      !selectedRarity.value || equip.rarity === selectedRarity.value;
    const matchesPosition =
      !selectedPosition.value || equip.position === selectedPosition.value;
    const matchesTag =
      !selectedTag.value || (equip.tag && equip.tag.includes(selectedTag.value));
    return matchesSearch && matchesRarity && matchesPosition && matchesTag;
  });
});


// 搜尋處理
const handleSearch = () => {
  console.log("Search query:", searchQuery.value);
};

// 清除搜尋
const clearSearch = () => {
  searchQuery.value = "";
  selectedRarity.value = "";
  selectedPosition.value = "";
  selectedTag.value = "";
};

// 切換進階搜尋
const toggleAdvSearch = () => {
  showAdvSearch.value = !showAdvSearch.value;
};

// 選擇 tag
const selectTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? "" : tag; // 點擊已選中的 tag 時取消選擇
};

// 根據稀有度獲取樣式
const getRarityClass = (rarity) => {
  const rarityColors = {
    Common: "rarity-Common",
    Rare: "rarity-Rare",
    Epic: "rarity-Epic",
    Legendary: "rarity-Legendary",
  };
  return rarityColors[rarity] || "rarity-default";
};

// 格式化文本，替換表情符號
const formattedText = (text) => {
  if (!text) {
    return text; // 如果是 undefined 或 null，直接返回原始值
  }

  return text.replace(/:([a-zA-Z0-9_~]+):/g, (matched, name) => {


    if (emoToImg(name)) {
      return emoToImg(name)
    }
    // 如果沒有找到匹配的，返回原始文本
    return matched;
  });
};

const emoToImg = (name) => {
  const emojiName = name;
  // 比對資料庫中的名稱
  const emo =
    emojiData.value.find((item) => item.name === emojiName);

  // 如果找到匹配的 emoji，返回 <img> 標籤
  if (emo) {
    const emojiImage = emoji.value.find((item) => item.id === emo.id);
    if (emojiImage) {
      return `<img src="${emojiImage.path}" alt="${name}" style="  width: 30px; height: 30px; ; vertical-align: middle; ">`;
    }
  }
}


/************************************************************************************ */
// 將技能數據轉換為 Map 儲存
onMounted(() => {
  libraries.value.Equip.forEach((equip) => {
    equipMap.value.set(equip.name, equip);


    // 提取並存儲 tag
    if (equip.tag && Array.isArray(equip.tag)) { // 修正為 equip.tag
      equip.tag.forEach((tag) => {
        taghub.value.add(tag); // 將 tag 添加到 Set 中
      });
    }
  });
  emojiData.value = libraries.value.Emoji;
  loadImages();
});

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
}

/* 輸入框樣式 */
.search-input-text {
  width: 100%;
  padding: 12px 40px 12px 16px;
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
  right: -50px;
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
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  color: #1e40af;
}

.adv-button {
  position: absolute;
  right: 1px;
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
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
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
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
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
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: left;
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


/* 無結果提示 */
.no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
  padding: 20px;
}

/* Tag 容器 */
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag-button {
  padding: 6px 6px;
  /* 保持內邊距 */
  border: none;
  /* 移除邊框 */
  border-radius: 16px;
  /* 圓角 */
  background-color: transparent;
  /* 透明背景 */
  cursor: pointer;
  /* 鼠標指針 */
  transition: background-color 0.3s ease, border-color 0.3s ease;
  /* 過渡效果 */
  margin: 4px;
  /* 按鈕之間的間距 */
}

.tag-button.active {
  transform: scale(2);
  /* 放大 10% */
  transition: transform 0.2s ease;
  /* 添加平滑過渡效果 */
}


@media (max-width: 768px) {

  /* 讓卡片在小螢幕上自動換行，變為一排顯示1個 */
  .equip-item {
    display: block;
  }

  .search-input-container {
    width: 70%;
    right: 5%;
  }
}
</style>