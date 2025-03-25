<template>
    <div>
        <h1>Add Data</h1>
        <p>The generated format is here</p>

        <!-- 下拉選單 -->
        <select v-model="selectedOption">
            <option disabled value=""></option>
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>

        <div class="dashed-line"></div>

        <!-- 動態表單 -->
        <div v-show="selectedOption">
            <div class="horizontal-table">
                <div>
                    <div class="table-cell">
                        <label>{{ }} Wiki Input：</label>
                        <input type="text" v-model="inputWiki" placeholder="Enter wiki data" />
                        <button @click="parseInput">+</button>
                    </div>
                    <div class="table-cell">
                        <label>URL Input：</label>
                        <input type="text" v-model="inputUrl" placeholder="Enter img url" />
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

// 响应式变量定义
const inputWiki = ref('');         // 存储维基文本输入内容
const inputUrl = ref('');          // 存储图片URL输入内容
const preElement = ref(null);      // 指向 <pre> 输出元素的引用
const copyStatus = ref(null);      // 复制操作状态（success/error/null）
const selectedOption = ref(''); // 当前选中的选项（默认option1）
const parsedData = ref({});        // 存储解析后的数据结构

// 可选的解析类型选项
const options = ref([
    { value: 'option1', label: 'Skill' },  // 选项1：技能解析
    { value: 'option2', label: 'Equip' },  // 选项2：装备解析（待实现）
]);

// 方法：清空所有输入字段
const clearInputs = () => {
    inputWiki.value = '';
    inputUrl.value = '';
    parsedData.value = {};
};

// 计算属性：将解析数据格式化为美观的JSON字符串
const formattedOutput = computed(() => JSON.stringify(parsedData.value, null, 2));

// 方法：复制输出内容到剪贴板
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
    } catch (err) {
        copyStatus.value = 'error';
    }
    setTimeout(() => (copyStatus.value = null), 2000); // 2秒后重置状态
};

// 方法：解析输入内容
const parseInput = () => {
    // 確保 inputWiki 不為空
    if (!inputWiki.value.trim()) return;

    // 將輸入分割成行
    const lines = inputWiki.value.trim().split("\n");

    // 如果輸入只有一行，將其視為一個完整的字符串
    if (lines.length === 1) {
        lines.push("");  // 如果只有一行，將空行加入以避免後續錯誤
    }

    const result = {};

    // 技能解析模式
    if (selectedOption.value === 'option1') {
        const [name, ...descParts] = lines.join(" ").split("Description ⋆");
        result.name = name.trim();  // 提取技能名稱
        result.description = descParts.join(" ").trim();  // 提取描述部分
        const imgMatch = inputUrl.value.match(/([^\/]+)\.png$/);  // 提取圖片ID
        result.id = imgMatch ? imgMatch[1] : '';  // 提取ID
        result.img_url = inputUrl.value;  // 存儲完整圖片URL
    }
    // 裝備解析模式
    else if (selectedOption.value === 'option2') {
        // 確保有有效的 line 資料
        const line = lines.join(" ");  // 將多行合併成一個字符串

        // 提取 Name
        const nameMatch = line.match(/^(.*?) Rarity/);
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

        // 裝備解析的 URL (這裡假設你會手動處理或自動生成 URL)
        result.url = inputUrl.value ? inputUrl.value : '';
    }

    parsedData.value = result;  // 更新解析結果
};
</script>

<style scoped>
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
