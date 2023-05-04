// mode을 이용해 테이블 생성하는 코드

// const { sequelize } = require('./models/index.js');

// async function main() {
//   // model을 이용해 데이터베이스에 테이블을 삭제 후 생성합니다.
//   await sequelize.sync({ force: true });
// }

// main();

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
// const commentsRouter = require('./routes/comments.route');
// const postsRouter = require('./routes/posts.route');

// const usersRouter = require('./routes/users.route'); //오류

const routes = require('./routes'); // 한 번에 임포트

app.use(express.json());
app.use(cookieParser());

// app.use('/posts', [postsRouter]);
// app.use('/posts', [commentsRouter]);
// app.use('/', [signupRouter]);
app.use('/', routes); // 한 번에 호출

app.listen(port, () => {
    console.log(`${port} success`);
    //     app.get('/', (req, res) => {
    //     res.send('Test!!');
    // });
});
