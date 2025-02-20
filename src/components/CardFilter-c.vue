<template>
    <!-- 角色篩選畫面 -->
    <div v-if="!cardShow">
        <h2>角色篩選</h2>
        <div class="character-card-container">
            <div v-for="(character, index) in characters" :key="index" class="character-card">
                <img :src="'src/assets/img/shibi_bg/' + character.id + '.png'" @click="selectCharacter(character)" />
            </div>
        </div>
    </div>

    <!-- 角色詳細資訊頁面 -->
    <div v-else>
        <!-- 返回按鈕 -->
        <button class="back-button" @click="cardShow = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="black" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>

        <!-- 角色詳細資訊 -->
        <div :class="['character-container', 'w-border']">
            <!-- 角色圖片 -->
            <img :src="selectedCharacter.img_src + '.png'" class="character-img" />

            <div class="character-info">
                <p><strong>{{ selectedCharacter.name }}</strong></p>
                <p><strong>ID：</strong> {{ selectedCharacter.id }}</p>

                <!-- 角色標籤 -->
                <div class="tags">
                    <strong>標籤：</strong>
                    <span v-for="(tag, index) in selectedCharacter.tag" :key="index" :class="['tag', getTagClass(tag)]"
                        @mouseover="showTooltip(tag, $event)" @mouseleave="hideTooltip">
                        {{ tag }}
                    </span>
                </div>

                <!-- Tooltip 顯示標籤說明 -->
                <div v-if="tooltip.show" class="tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
                    <img :src="'src/assets/img/capacites/113.png'" class="tooltip-img" />
                    
                    <p>{{ tooltip.text }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 當前顯示的角色列表
const characters = ref([]);

// 是否顯示角色詳細資訊
const cardShow = ref(false);

// 當前選中的角色
const selectedCharacter = ref(null);

// Tooltip 設定
const tooltip = ref({
    show: false, // 是否顯示 Tooltip
    text: "",    // Tooltip 文字
    x: 0,        // X 座標
    y: 0         // Y 座標
});

/**
 * 取得角色資料
 */
const fetchData = async () => {
    try {
        const response = await fetch("src/data/card.json");
        characters.value = await response.json();
        console.log("成功讀取 JSON:", characters.value);
    } catch (error) {
        console.error("讀取 JSON 失敗：", error);
    }
};

/**
 * 選擇角色並顯示詳細資訊
 * @param {Object} character - 被選擇的角色
 */
const selectCharacter = (character) => {
    cardShow.value = true;
    selectedCharacter.value = character;
};

/**
 * 根據標籤名稱回傳對應的 CSS 類名
 * @param {string} tag - 標籤名稱
 * @returns {string} CSS 類名
 */
const getTagClass = (tag) => {
    const tagColors = {
        "craft": "tag-craft",
        "allava": "tag-allava",
        "lightroot": "tag-lightroot",
        "opp_spore": "tag-opp-spore",
    };
    return tagColors[tag] || "tag-default"; // 預設標籤樣式
};

/**
 * 顯示 Tooltip
 * @param {string} tag - 標籤名稱
 * @param {MouseEvent} event - 滑鼠事件
 */
const showTooltip = (tag, event) => {
    tooltip.value.text = tagDescriptions[tag] || "無說明";
    tooltip.value.x = event.pageX + 10;
    tooltip.value.y = event.pageY + 10;
    tooltip.value.show = true;
};

/**
 * 隱藏 Tooltip
 */
const hideTooltip = () => {
    tooltip.value.show = false;
};

// 標籤對應的說明文字
const tagDescriptions = {
    "craft": "與工匠相關的能力",
    "allava": "阿瓦隆相關技能",
    "lightroot": "光根系統強化",
    "opp_spore": "對抗孢子的能力"
};

// 在組件掛載時讀取角色資料
onMounted(fetchData);
</script>

<style scoped>
/* 角色篩選區域 */
.character-card-container {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.character-card {
    width: 16%;
    margin: 2px;
    padding: 5px;
    box-sizing: border-box;
    text-align: center;
}

.character-card img {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
}

/* 響應式調整 */
@media (max-width: 768px) {
    .character-card {
        width: 30%;
    }
}

/* 返回按鈕 */
.back-button {
    padding: 1ch;
    background-color: #f5f5f5;
    color: #333;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease;
}

.back-button:hover {
    background-color: #ddd;
}

/* 角色詳細資訊 */
.character-container {
    display: flex;
    gap: 30px;
    max-width: 900px;
    margin: auto;
}

.character-img {
    padding: 20px;
    width: 30%;
    min-width: 300px;
    height: auto;
    border-radius: 10px;
}

/* 響應式調整 */
@media (max-width: 600px) {
    .character-container {
        flex-direction: column;
        align-items: center;
    }

    .character-img {
        min-width: 300px;
        width: 100px;
    }
}

/* 標籤樣式 */
.tag {
    display: inline-block;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 5px;
    font-size: 14px;
    color: white;
    cursor: pointer;
}

.tag-craft {
    background-color: #3498db;
}

.tag-allava {
    background-color: #e74c3c;
}

.tag-lightroot {
    background-color: #2ecc71;
}

.tag-opp-spore {
    background-color: #f1c40f;
}

.tag-default {
    background-color: #95a5a6;
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

.tooltip-img {
    width: 50px;
    margin-right: 5px;
}
</style>
