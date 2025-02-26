<template>
    <div>
        <h1>Add Data</h1>
        <p>The generated format is here</p>

        <!-- 下拉選單 -->
        <select v-model="selectedOption">
            <option disabled value="">請選擇一個選項</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>

        <div class="dashed-line"></div>

        <!-- 動態表單 -->
        <div v-show="selectedOption === 'option1'">
            <div class="horizontal-table">
                <div>
                    <div v-for="field in skillFields" :key="field.key" class="table-cell">
                        <label>{{ field.label }}：</label>
                        <input type="text" v-model="inputData[field.key]"
                            :placeholder="`Enter ${field.label.toLowerCase()}`" />
                    </div>
                </div>
            </div>
        </div>

        <div v-show="selectedOption === 'option2'">
            <div class="horizontal-table">
                <div>
                    <div class="table-cell">
                        <label>Wiki Input：</label>
                        <input type="text" v-model="input_wiki" placeholder="Enter wiki data" />
                        <button @click="parseInput">+</button>
                    </div>
                    <div class="table-cell">
                        <label>url Input：</label>
                        <input type="text" v-model="items.url" placeholder="Enter img url" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 操作按鈕 -->
        <div v-if="selectedOption">
            <button @click="clearInputs">Clear</button>
            <button @click="copyOutput">Copy</button>

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
const inputData = ref({
    name: '',
    id: '',
    description: '',
    url: '',
});

const input_wiki = ref('');
const preElement = ref(null);
const copyStatus = ref(null);

// 下拉選單的選項
const options = ref([
    { value: 'option1', label: 'Skill' },
    { value: 'option2', label: 'Equip' },
]);

// 預設選擇的值
const selectedOption = ref('option2');

// 表單欄位配置
const skillFields = ref([
    { key: 'name', label: 'Name' },
    { key: 'id', label: 'ID' },
    { key: 'description', label: 'Description' },
    { key: 'url', label: 'URL' },
]);

// 清空輸入欄位
const clearInputs = () => {
    inputData.value = { name: '', id: '', description: '', url: '' };
    input_wiki.value = '';
    items.value = {};

};

// 格式化 JSON 輸出
const formattedOutput = computed(() => {
    let data = {};

    if (selectedOption.value === 'option1') {
        data = { ...inputData.value };
    } else if (selectedOption.value === 'option2') {
        data = { ...items.value };
    }

    return JSON.stringify(data, null, 2);
});

// 複製內容到剪貼簿
const copyOutput = async () => {
    if (!preElement.value) return;

    const preText = preElement.value.textContent;

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

// 解析後的數據
const items = ref({});

const parseInput = () => {
    if (!input_wiki.value.trim()) return;

    // 按換行符分割每一段
    const lines = input_wiki.value.trim().split("\n");

    // 只處理第一行（假設每次只有一筆資料）
    const line = lines[0];
    const result = {};

    // 提取 Name
    const nameMatch = line.match(/^(.*?) Rarity /);
    if (nameMatch) {
        result.name = nameMatch[1].trim();
    }

    // 提取 Rarity
    const rarityMatch = line.match(/Rarity (\w+)/);
    if (rarityMatch) {
        result.rarity = rarityMatch[1].trim();
    }

    // 提取 Position
    const positionMatch = line.match(/Position (.*?) Level/);
    if (positionMatch) {
        result.position = positionMatch[1].trim();
    }

    // 提取 Level
    const levelMatch = line.match(/Level (.*?) Effect/);
    if (levelMatch) {
        result.level = levelMatch[1].trim();
    }

    // 提取 Effect
    const effectMatch = line.match(/Effect ⋆ (.*?) 圖片/);
    if (effectMatch) {
        result.effect = effectMatch[1].trim();
    }

    // 提取 Last Patch
    const lastPatchMatch = line.match(/Last Patch: (.*?)$/);
    if (lastPatchMatch) {
        result.last_patch = lastPatchMatch[1].trim();
    }
    if (nameMatch) {
        result.url = "";
    }

    // 將解析結果存儲到 items
    items.value = result;
};


</script>

<style scoped>
/* 樣式保持不變 */
.dashed-line {
    width: 100%;
    border-top: 2px dashed #ddd;
    margin: 10px 0;
}

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

.success-message {
    color: green;
    margin-top: 10px;
}

.error-message {
    color: red;
    margin-top: 10px;
}
</style>