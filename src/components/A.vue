<template>
    <input type="text" v-model="A">
    <button @click="addImage">add</button>
    <button @click="cls">cls</button>
    <!-- 動態渲染圖片列表 -->
    <div class="image-grid">
    <div v-for="(image, index) in images" :key="index" class="image-container">
        <p>{{ image.id }}</p>
        <img :src="image.url" :alt="image.alt" class="image" />
    </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const A = ref("");

const images = ref([]);

// 添加圖片的函數
const addImage = () => {
    console.log(A.value);
    const newImage = {
        id: A.value,
        url: 'https://www.eredan-arena.com/images/HD/items/' + A.value + '.png', // 圖片 URL
    };

    images.value.push(newImage); // 將新圖片添加到數組中
    A.value++
};

const cls = () => {
    images.value = [];
}
</script>

<style scoped>
button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 20px;
}

/* 圖片網格佈局 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* 自動填充，最小寬度 150px */
  gap: 20px; /* 圖片之間的間距 */
}

.image-container {
    margin: 10px 0;
}

.image {
    width: 150px;
    height: 150px;
    border: 1px solid #ccc;
    border-radius: 8px;
}
</style>