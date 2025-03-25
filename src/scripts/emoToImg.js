// src/utils/emoji.js

/************************************************************
 * 
 *       使用前initEmojiData()初始化資料
 *       onMounted(() => {
 *       emojiUtil.initEmojiData(); // 初始化 emoji 資料與圖片
 *       });
 *
 *        使用emoToImg(name)將emoji名稱轉換為圖片
 *        const formattedText = (text) => {
 *          if (!text) return text;
 *          return text.replace(/:([a-zA-Z0-9_~]+):/g, (matched, name) => emojiUtil.emoToImg(name) || matched);
 *        };
 * 
 * 
 ***********************************************************/

import { ref, watch } from "vue";
import data_lib from "../data/library.json";

// 將 emoji 資料和圖片儲存在變數中
let emojiData = [];
let emojiImages = [];

const isImagesLoaded = ref(false);

// 加載圖片
const loadImages = async () => {
    try {
        const modules = import.meta.glob("../assets/img/aggregats/*.{jpg,png}");/** */
        const paths = Object.keys(modules);

        emojiImages = await Promise.all(
            paths.map(async (path) => {
                const module = await modules[path]();
                return {
                    id: path.split("/").pop().split(".")[0], // 提取檔案名稱（不含副檔名）
                    path: module.default, // 圖片的實際路徑
                };
            })
        );
        isImagesLoaded.value = true;
    } catch (error) {
        console.error("Error loading images:", error);
    }
};

// 加載 emoji 資料
const loadEmojiData = () => {
    emojiData = data_lib.Emoji || []; // 如果未找到 Emoji 資料則使用空數組
};

// emoToImg：將 emoji 名稱轉換為圖片
export const emoToImg = (name) => {
    const emojiName = name;

    // 查找匹配的 emoji
    const emo = emojiData.find((item) => item.name === emojiName);

    // 如果找到匹配的 emoji，返回 <img> 標籤
    if (emo) {
        const emojiImage = emojiImages.find((item) => item.id === emo.id);
        if (emojiImage) {
            return `<img src="${emojiImage.path}" alt="${name}" style="width: 30px; height: 30px; vertical-align: middle;">`;
        }
    }

    // 如果沒有匹配的 emoji，返回原始名稱
    return name;
};

// 預加載資料
const initEmojiData = () => {
    loadEmojiData();
    loadImages();
};

// 將需要的函式暴露出去，供外部使用
export default {
    emoToImg,
    initEmojiData,
    isImagesLoaded,
};
