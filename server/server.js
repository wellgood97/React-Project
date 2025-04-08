// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const socketHandler = require('./socket');
const dbPool = require('./section2Server/db');
const mariadb = require('./section2Server/express+mariadb');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

// ✅ 검색 API 라우터 추가
app.get('/api/search', async (req, res) => {
  const query = req.query.query;

  const dummyData = [
    { id: 1, title: '채팅 기능 소개', category: '채팅', path: '/ChatApp' },
    { id: 2, title: '파일 업로드 방법', category: '파일', path: '/file' },
    { id: 3, title: '이메일 보내기 가이드', category: '이메일', path: '/sendEmail' }
  ];

  // 쿼리로 필터링
  const result = dummyData.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  res.json(result);
});

// middleware
app.use(cors());
app.use(express.json());

// REST API
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io 연결
socketHandler(io);

// ✅ 서버 실행 (4001번 포트로 충돌 방지)
server.listen(4001, () => {
  console.log('🚀 서버 실행 중: http://localhost:4001');
});
