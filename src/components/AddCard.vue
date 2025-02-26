<template>
    <div>
      <h1>Add Skill Data</h1>
      <p>The skill generated format is here</p>
  
      <div class="dashed-line"></div>
  
      <div>
        <div class="horizontal-table">
          <div>
            <p>
              <button @click="openData">Open</button>
              <button @click="clear">Clear</button>
              <button @click="copy">Copy</button>
            </p>
  
            <div class="table-cell">
              <label>Wiki Data Input：</label>
              <input type="text" v-model="input" placeholder="Enter data" />
              <button @click="parseInput">+</button>
            </div>
            <div class="table-cell">
              <label>Name：</label>
              <input type="text" v-model="input_name" placeholder="Enter name" />
            </div>
          </div>
        </div>
  
        <!-- 提示訊息 -->
        <p v-if="copyStatus === 'success'" class="success-message">內容已複製到剪貼簿！</p>
        <p v-if="copyStatus === 'error'" class="error-message">複製失敗，請手動複製內容。</p>
  
        <!-- JSON 輸出 -->
        <div class="output">
          <pre ref="preElement">{{ formattedOutput }}</pre>
        </div>
      </div>
  
      <div class="dashed-line"></div>
    </div>
  </template>

<script setup>
import { ref, computed } from 'vue';

// 輸入欄位的資料
const input = ref('');
const input_name = ref('');

// 定義解析結果
const results = ref({});

// 複製狀態
const preElement = ref(null);
const copyStatus = ref(null);

// 解析字串的函數
const parseString = (input) => {
  const parts = input.split(' '); // 將字串按空格分割
  const result = {};

  let i = 0;

  // 提取 Name（可能包含逗號和空格）
  let nameParts = [];
  while (i < parts.length && !parts[i].startsWith('#')) {
    nameParts.push(parts[i]);
    i++;
  }
  result.name = nameParts.join(' ').trim(); // 保留逗號

  // 提取 ID
  if (i < parts.length && parts[i].startsWith('#')) {
    result.id = parts[i].replace('#', '').trim();
    i++;
  }

  // 提取 Guild
  if (i < parts.length && parts[i].toLowerCase() === 'guild') {
    result.Guild = parts[i + 1] + ' ' + parts[i + 2]; // Guild 是兩個詞
    i += 3;
  }

  // 提取 Class
  if (i < parts.length && parts[i].toLowerCase() === 'class') {
    result.Class = parts[i + 1];
    i += 2;
  }

  // 提取 Race
  if (i < parts.length && parts[i].toLowerCase() === 'race') {
    result.Race = parts[i + 1];
    i += 2;
  }

  // 提取 Rarity
  if (i < parts.length && parts[i].toLowerCase() === 'rarity') {
    result.Rarity = parts[i + 1];
    i += 2;
  }

  return result;
};

// 點擊按鈕時觸發的函數
const parseInput = () => {
  if (!input.value.trim()) return; // 如果輸入為空，直接返回

  const parsedData = parseString(input.value);
  if (input_name.value.trim()) {
    parsedData.name = input_name.value.trim(); // 如果手動輸入 Name，則覆蓋解析結果
  }
  results.value = parsedData;
};

// 清空輸入欄位
const clear = () => {
  input.value = '';
  input_name.value = '';
  results.value = {};
};

// 複製內容到剪貼簿
const copy = async () => {
  if (!preElement.value) return;

  const preText = preElement.value.textContent;

  // 檢查是否有內容
  if (!preText.trim()) {
    copyStatus.value = 'error';
    setTimeout(() => (copyStatus.value = null), 2000);
    return;
  }

  try {
    await navigator.clipboard.writeText(preText);
    copyStatus.value = 'success';
    setTimeout(() => (copyStatus.value = null), 2000);
  } catch (err) {
    console.error('複製失敗: ', err);
    copyStatus.value = 'error';
    setTimeout(() => (copyStatus.value = null), 2000);
  }
};

// 格式化 JSON 輸出
const formattedOutput = computed(() => {
  const data = {
    name: results.value.name || '',
    id: results.value.id || '',
    Rarity: results.value.Rarity || '',
    classe: results.value.Class || '',
    guild: results.value.Guild || '',
    race: results.value.Race || '',
    basic_ability: {
      strength: '',
      3: { skilltag: [] },
      2: { skilltag: [] },
      1: { skilltag: [] },
    },
    img_src: '',
    tag: [],
    Strategy: [],
  };

  return JSON.stringify(data, null, 2); // 格式化 JSON 輸出
});
</script>

<style scoped>
/* 虛線分隔線 */
.dashed-line {
  width: 100%;
  border-top: 2px dashed #ddd;
  margin: 10px 0;
}

/* 水平表格樣式 */
.horizontal-table {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.table-cell {
  margin: 10px 0;
}

.table-cell label {
  display: inline-block;
  width: 200px;
  font-weight: bold;
}

.table-cell input {
  width: 200px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 輸出區域樣式 */
.output {
  padding: 10px;
  border-radius: 5px;
  max-width: 600px;
  text-align: left;
  border: 1px solid #ddd;
  margin: 0 auto;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  margin: 0;
}

/* 按鈕樣式 */
button {
  margin: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* 提示訊息樣式 */
.success-message {
  color: green;
  margin-top: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>