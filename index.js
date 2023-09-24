const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

app.use(express.static('public')); // 靜態資源目錄，存放前端代碼和圖片


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});