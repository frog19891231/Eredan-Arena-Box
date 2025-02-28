<template>
    <p>Equip image search</p>

    <div class="image-grid">
        <div v-for="image2 in images2" :key="index" class="image-container">
            <img :src="image2" class="image" />
        </div>
    </div>
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
const images2 = ref([
    "http://static.eredan.com/images/print/0e700fca41e768b1092a61370e58b823.png",
    "http://static.eredan.com/images/print/2dc4fd25330f0b4290a869a6b06e8fbd.png",
    "https://images-ext-2.discordapp.net/external/lbVY7VAMB9v-eLX3yVZ5KAwsneETchYwt7GeZOu8Nfw/http/static.eredan.com/images/web_big/037727064d89b993dd6e70a473fcebaf.png",
    "http://static.eredan.com/images/print/5d09cf7da1d1356342da54478f260825.jpg",
    "http://static.eredan.com/images/print/517ae72f6f1dedfad3ad7f83eecb5e9c.png"
]);

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
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    /* 自動填充，最小寬度 150px */
    gap: 20px;
    /* 圖片之間的間距 */
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