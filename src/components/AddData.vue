<template>
    <div>
        <h1>Add Skill Data</h1>
        <p>The skill generated format is here</p>

        <div class="dashed-line"></div>

        <div>
            <div class="horizontal-table">
                <div>
                    <p>
                        <button @click="clearSkill">Clear</button>
                        <button @click="copySkill">Copy</button>
                    </p>

                    <div class="table-cell">
                        <label>Name：</label>
                        <input type="text" v-model="input_name" placeholder="Enter name" />
                    </div>
                    <div class="table-cell">
                        <label>ID：</label>
                        <input type="text" v-model="input_id" placeholder="Enter ID" />
                    </div>
                    <div class="table-cell">
                        <label>Description：</label>
                        <input type="text" v-model="input_description" placeholder="Enter description" />
                    </div>
                    <div class="table-cell">
                        <label>URL：</label>
                        <input type="text" v-model="input_url" placeholder="Enter URL" />
                    </div>
                </div>
            </div>
            <p v-if="copyStatus === 'success'" class="success-message">內容已複製到剪貼簿！</p>
            <p v-if="copyStatus === 'error'" class="error-message">複製失敗，請手動複製內容。</p>
            <div class="output">
                <pre ref="preElement">
  {
    "name": "{{ input_name }}",
    "id": "{{ input_id }}",
    "description": "{{ input_description }}",
    "img_url": "{{ input_url }}"
  }
          </pre>
            </div>


        </div>

        <div class="dashed-line"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 輸入欄位的資料
const input_name = ref('');
const input_id = ref('');
const input_description = ref('');
const input_url = ref('');

// 複製狀態
const preElement = ref(null);
const copyStatus = ref(null);

// 清空輸入欄位
const clearSkill = () => {
    input_name.value = '';
    input_id.value = '';
    input_description.value = '';
    input_url.value = '';
};

// 複製內容到剪貼簿
const copySkill = async () => {
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