<template>
    <div v-if="!cardShow">
        <h2>角色篩選</h2>
        <div class="character-card-container">
            <div v-for="(character, card) in characters" :key="card" class="character-card">
                <img :src="'src/assets/img/shibi_bg/' + character.id + '.png'" @click="selectCharacter(character)" />
            </div>
        </div>
    </div>
    <div v-if="cardShow">
        <button class="back-button" @click="cardShow = !cardShow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="black" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>


        <div>
            <div :class="['character-container', 'w-border']">
                <!-- 角色圖片 -->
                <img :src="selectedCharacter.img_src + '.png'" class="character-img" />

                <!-- 角色資訊 -->
                <div class="character-info">
                    <p><strong>{{ selectedCharacter.name }}</strong></p>
                    <p><strong>ID：</strong> {{ selectedCharacter.id }}</p>
                    <!-- 標籤區塊 -->
                    <div class="tags">
                        <strong>標籤：</strong>
                        <span v-for="(tag, index) in selectedCharacter.tag" :key="index"
                            :class="['tag', getTagClass(tag)]" 
                            @mouseover="showTooltip(tag, $event)"
                            @mouseleave="hideTooltip">
                            {{ tag }}
                        </span>
                    </div>
                    <!-- 自訂 Tooltip -->
                    <div v-if="tooltip.show" class="tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
                        <img :src="'src/assets/img/capacites/113.png'" style="width: 50px;"/>
                        <p >{{ tooltip.text }}</p>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const currentPage = ref('filter');
const characters = ref({});
const cardShow = ref(false);
// 用來存儲當前選中的角色
const selectedCharacter = ref(null);
const tooltip = ref({
    show: false,
    text: "",
    x: 0,
    y: 0
});



const paddedCharacters = computed(() => {
    const cardsArray = Object.values(characters.value);
    const totalCards = cardsArray.length - 1;
    const remainder = totalCards % 4;
    const padding = remainder === 0 ? 0 : 4 - remainder;
    return [...cardsArray, ...Array(padding).fill(null)];
});

const fetchData = async () => {
    try {
        const response = await fetch("./src/data/card.json");
        characters.value = await response.json();
        console.log("成功讀取 JSON:", characters.value);
    } catch (error) {
        console.error("讀取 JSON 失敗：", error);
    }
};

// 監聽 cardShow 變化
watch(cardShow, (newVal, oldVal) => {

    if (newVal) {

    } else {

    }
});

onMounted(() => {
    fetchData();
});

const selectCharacter = (character) => {
    cardShow.value = true;
    selectedCharacter.value = character;
};

const getTagClass = (tag) => {
    const tagColors = {
        "craft": "tag-craft",
        "allava": "tag-allava",
        "lightroot": "tag-lightroot",
        "opp_spore": "tag-opp-spore",
    };

    return tagColors[tag] || "tag-default"; // 預設樣式
};

const showTooltip = (tag, event) => {
    tooltip.value.text = tagDescriptions[tag] || "無說明";
    tooltip.value.x = event.pageX + 10; // 滑鼠 X 座標
    tooltip.value.y = event.pageY + 10; // 滑鼠 Y 座標
    tooltip.value.show = true;
};

const tagDescriptions = {
  "craft": "與工匠相關的能力",
  "allava": "阿瓦隆相關技能",
  "lightroot": "光根系統強化",
  "opp_spore": "對抗孢子的能力"
};

const hideTooltip = () => {
    tooltip.value.show = false;
};

</script>

<style scoped>
.character-card-container {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}



.character-card {
    width: 16%;
    /* 每個卡片佔的寬度 */
    margin: 2px;
    /* 上下間距 */

    padding: 5px;
    box-sizing: border-box;
    /* 包含邊框和內邊距 */
    text-align: center;
    /* 讓卡片內部的內容置中 */
}

.w-border {
    border: 1px solid #ccc;
}

.character-card img {
    max-width: 100%;
    /* 圖片寬度最多是卡片寬度 */
    height: auto;
    /* 高度自動調整，保持比例 */
    margin-bottom: 10px;
    /* 圖片和文字之間的間隔 */
}

/* 讓卡片在小螢幕上自動換行，變為一排顯示1個 */
@media (max-width: 768px) {
    .character-card {
        width: 30%;
    }
}

.back-button {
    padding: 1ch;
    background-color: #f5f5f5;
    /* 淺灰色背景 */
    color: #333;
    /* 深色圖標 */
    border: none;
    border-radius: 50%;
    /* 圓形按鈕 */
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    /* 陰影 */
    transition: background-color 0.3s ease;
}

.back-button:hover {
    background-color: #dddddd7a;
    /* 滑鼠懸停時變淺 */
}

/* 讓內容水平排列 */
.character-container {
    display: flex;
    gap: 30px;

    max-width: 900px;
    margin: auto;
}

/* 設定圖片大小 */
.character-img {
    padding: 20px;
    align-items: center;
    width: 30%;
    min-width: 300px;
    height: auto;
    border-radius: 10px;
}

/* 讓文字區塊填滿剩餘空間 */
.character-info {
    text-align: left;
}

/* 當畫面變窄（手機版）時，改為垂直排列 */
@media (max-width: 600px) {
    .character-container {
        flex-direction: column;
        /* 改為垂直排列 */
        align-items: center;
        /* 讓內容置中 */
    }

    .character-img {
        min-width: 300px;
        width: 100px;
        /* 手機版縮小圖片 */
    }
}

/* 通用標籤樣式 */
.tag {
    display: inline-block;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 5px;
    font-size: 14px;
    color: white;
}

/* 特定標籤樣式 */
.tag-craft {
    background-color: #3498db;
    /* 藍色 */
}

.tag-allava {
    background-color: #e74c3c;
    /* 紅色 */
}

.tag-lightroot {
    background-color: #2ecc71;
    /* 綠色 */
}

.tag-opp-spore {
    background-color: #f1c40f;
    /* 黃色 */
}

/* 預設標籤 */
.tag-default {
    background-color: #95a5a6;
    /* 灰色 */
}

/* 標籤樣式 */
.tag {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  font-size: 14px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

/* Tooltip 樣式 */
.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;
}
</style>