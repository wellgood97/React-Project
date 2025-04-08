const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");

// 📌 업로드 폴더가 없으면 생성
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// 📌 Multer 설정
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// 📌 파일 업로드 API
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "파일이 업로드되지 않았습니다." });

    res.status(200).json({ success: true, fileName: req.file.filename });
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 📌 업로드된 파일 목록 불러오기 (폴더에서 직접 읽기)
app.get("/files", (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir); // 📌 업로드 폴더에서 파일 목록 읽기
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("파일 목록 불러오기 오류:", error);
    res.status(500).json({ success: false, message: "파일 목록을 불러오는 중 오류 발생" });
  }
});

// 📌 파일 다운로드 API
app.get("/download/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(uploadDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "파일을 찾을 수 없습니다." });
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("파일 다운로드 오류:", err);
      res.status(500).json({ success: false, message: "파일 다운로드 중 오류 발생" });
    }
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행: http://localhost:${PORT}`);
});
