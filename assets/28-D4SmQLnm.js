const A="data:image/png;base64,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";export{A as default};
