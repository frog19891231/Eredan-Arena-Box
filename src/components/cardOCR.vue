<template>
    <div class="ocr-container">
      <h2>圖片文字辨識</h2>
      
      <div class="upload-section">
        <input 
          type="file" 
          accept="image/*" 
          @change="handleFileUpload"
          ref="fileInput"
        >
        <div class="url-input">
          <input
            type="text"
            v-model="imageUrlInput"
            placeholder="輸入圖片網址"
            @keyup.enter="loadImageFromUrl"
          >
          <button @click="loadImageFromUrl">載入</button>
        </div>
      </div>
  
      <!-- 顯示圖片和畫布 -->
      <div class="image-container" v-if="imageUrl">
        <canvas 
          ref="canvas" 
          @mousedown="startDrawing"
          @mousemove="drawRectangle"
          @mouseup="stopDrawing"
        ></canvas>
      </div>
  
      <!-- 辨識和清除按鈕 -->
      <button 
        :disabled="!imageUrl || loading" 
        @click="recognizeText"
      >
        {{ loading ? '辨識中...' : '開始辨識' }}
      </button>
      
      <button @click="clear" class="clear-button">
        清除
      </button>
      
      <!-- 辨識結果 -->
      <div v-if="recognizedText" class="result">
        <h3>辨識結果：</h3>
        <pre>{{ recognizedText }}</pre>
      </div>
      
      <!-- 顯示錯誤 -->
      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>
  </template>
  

<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue';
import Tesseract from 'tesseract.js';

// 響應式變數
const fileInput = ref(null);
const canvas = ref(null);
const imageUrl = ref(null);
const imageUrlInput = ref('');
const recognizedText = ref('');
const loading = ref(false);
const error = ref(null);
const drawing = ref(false);
const startX = ref(0);
const startY = ref(0);
const rect = ref({ x: 0, y: 0, width: 0, height: 0 });

// 預設辨識區域
const name_rect = ref({ x: 156.93746948242188, y: 24.944427490234375, width: 270, height: 56 });
const skill_rect1 = ref({ x: 113.93746948242188, y: 655.1666870117188, width: 360, height: 160 });

// 方法：處理文件上傳
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
    recognizedText.value = '';
    error.value = null;
    nextTick(() => initCanvas());
  }
};

// 方法：從 URL 載入圖片
const loadImageFromUrl = async () => {
  if (!imageUrlInput.value) {
    error.value = '請輸入有效的圖片網址';
    return;
  }

  loading.value = true;
  error.value = null;
  recognizedText.value = '';

  try {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrlInput.value;
    });

    imageUrl.value = imageUrlInput.value;
    nextTick(() => initCanvas());
  } catch (err) {
    error.value = '無法載入圖片，請檢查網址是否正確';
  } finally {
    loading.value = false;
  }
};

// 初始化畫布並載入圖片
const initCanvas = () => {
  const ctx = canvas.value.getContext('2d');
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    canvas.value.width = img.width;
    canvas.value.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.onerror = () => {
    error.value = '圖片載入失敗';
  };
  img.src = imageUrl.value;
};

// 開始繪製區域
const startDrawing = (event) => {
  drawing.value = true;
  const rectCanvas = canvas.value.getBoundingClientRect();
  startX.value = event.clientX - rectCanvas.left;
  startY.value = event.clientY - rectCanvas.top;
};

// 繪製選擇區域
const drawRectangle = (event) => {
  if (!drawing.value) return;

  const ctx = canvas.value.getContext('2d');
  const rectCanvas = canvas.value.getBoundingClientRect();
  
  // 計算事件相對於畫布的座標
  const currentX = event.clientX - rectCanvas.left;
  const currentY = event.clientY - rectCanvas.top;

  // 確保矩形的起點和終點都正確，避免出現負值
  rect.value.x = Math.min(startX.value, currentX);
  rect.value.y = Math.min(startY.value, currentY);
  rect.value.width = Math.abs(currentX - startX.value);
  rect.value.height = Math.abs(currentY - startY.value);

  // 清除畫布並重新繪製圖片和矩形
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    ctx.drawImage(img, 0, 0);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.value.x, rect.value.y, rect.value.width, rect.value.height);
  };
  img.src = imageUrl.value;
};


// 停止繪製區域
const stopDrawing = () => {
  drawing.value = false;
};

// 開始辨識文字
const recognizeText = async () => {
  if (!imageUrl.value) return;

  loading.value = true;
  error.value = null;

  try {
    const ctx = canvas.value.getContext('2d');
    let resultText = '';

    if (rect.value.x === 0 && rect.value.y === 0 && rect.value.width === 0 && rect.value.height === 0) {
      // 辨識預設的區域
      const nameImageData = ctx.getImageData(
        name_rect.value.x,
        name_rect.value.y,
        name_rect.value.width,
        name_rect.value.height
      );
      const skillImageData = ctx.getImageData(
        skill_rect1.value.x,
        skill_rect1.value.y,
        skill_rect1.value.width,
        skill_rect1.value.height
      );

      const nameCanvas = document.createElement('canvas');
      nameCanvas.width = name_rect.value.width;
      nameCanvas.height = name_rect.value.height;
      nameCanvas.getContext('2d').putImageData(nameImageData, 0, 0);

      const skillCanvas = document.createElement('canvas');
      skillCanvas.width = skill_rect1.value.width;
      skillCanvas.height = skill_rect1.value.height;
      skillCanvas.getContext('2d').putImageData(skillImageData, 0, 0);

      const nameResult = await Tesseract.recognize(
        nameCanvas,
        'chi_tra+eng',
        { logger: m => console.log(m) }
      );
      const skillResult = await Tesseract.recognize(
        skillCanvas,
        'chi_tra+eng',
        { logger: m => console.log(m) }
      );

      resultText = `${nameResult.data.text}\n\n${skillResult.data.text}`;
    } else {
      // 辨識自訂區域
      const imageData = ctx.getImageData(
        rect.value.x,
        rect.value.y,
        rect.value.width,
        rect.value.height
      );

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = rect.value.width;
      tempCanvas.height = rect.value.height;
      tempCanvas.getContext('2d').putImageData(imageData, 0, 0);

      const { data: { text } } = await Tesseract.recognize(
        tempCanvas,
        'chi_tra+eng',
        { logger: m => console.log(m) }
      );
      resultText = text;
    }

    recognizedText.value = resultText;
  } catch (err) {
    error.value = '文字辨識失敗：' + err.message;
  } finally {
    loading.value = false;
  }
};

// 清除按鈕的處理
const clear = () => {
  imageUrl.value = null;
  recognizedText.value = '';
  error.value = null;
  rect.value = { x: 0, y: 0, width: 0, height: 0 };
  imageUrlInput.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 生命週期鉤子
onBeforeUnmount(() => {
  if (imageUrl.value && imageUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageUrl.value);
  }
});
</script>


  
<style scoped>
.ocr-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.upload-section {
  margin-bottom: 20px;
}

.url-input {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.url-input input {
  flex: 1;
  padding: 5px;
}

.image-container {
  margin: 20px 0;
  position: relative;
}

canvas {
  max-width: 100%;
  cursor: crosshair;
}

.result {
  margin-top: 20px;
  border: 2px solid white;
  padding: 10px;
  border-radius: 5px;
}

.error {
  color: red;
  margin-top: 10px;
}

.clear-button {
  color: white;
}

.clear-button:hover {
  background-color: #e53935;
}
</style>
