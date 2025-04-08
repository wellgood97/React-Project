// ✅ Render 배포 최적화된 Express 서버 예시

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // ✅ 배포 시 실제 프론트 도메인으로 바꾸는 걸 권장
    methods: ["GET", "POST"]
  }
});

// ✅ 환경변수에서 포트 읽기 (Render가 자동으로 지정해줌)
const PORT = process.env.PORT || 4000;

// ✅ JSON 파싱 미들웨어 + CORS 설정
app.use(cors());
app.use(express.json());

// ✅ API 테스트 라우트
app.get("/", (req, res) => {
  res.send("✅ Render 배포용 서버 작동 중!");
});

// ✅ 예시 메시지 API
app.get("/api/messages", (req, res) => {
  res.json([
    { sender_id: 1, content: "안녕하세요" },
    { sender_id: 2, content: "반가워요" }
  ]);
});

// ✅ 소켓 서버 설정
io.on("connection", (socket) => {
  console.log("📡 연결됨:", socket.id);

  socket.on("sendMessage", (msg) => {
    console.log("📨 받은 메시지:", msg);
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ 연결 종료:", socket.id);
  });
});

// ✅ 서버 실행 (Render에서 자동으로 PORT 주입함)
server.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
