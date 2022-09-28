const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const NAVER_ID = process.env.NAVER_ID;
const NAVER_SECRET_ID = process.env.NAVER_SECRET_ID;

app.set("port", process.env.PORT || 8099); // 지정된 서버가 있으면 받고 없으면 8099로 하겠다.
const port = app.get("port");

app.use(morgan("dev")); // dev는 간단하게 보겠다
app.use(cors());
//post로 넘어올땐 두 문장이 필요하다.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
//   res.send("hello express");
// });
app.post("/papago", (req, res) => {
  console.log(req.body.txt);
  const txt = req.body.txt;
  const language = req.body.language;
  axios({
    url: "https://openapi.naver.com/v1/papago/n2mt",
    method: "POST",
    params: {
      source: "ko",
      target: language,
      text: txt,
    },
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET_ID,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((response) => {
      // console.log(response.data.message.result.translatedText);
      res.json({ result: response.data.message.result.translatedText });
    })
    .catch((error) => {
      // console.log(error);
      res.send(error);
    });
  // const queryTxt = encodeURIComponent(req.query.typing);
  // axios({
  //   url: `https://openapi.naver.com/v1/papago/detectLangs?query=${queryTxt}`,
  //   method: "POST",
  //   headers: {
  //     "X-Naver-Client-Id": "f5lsoT583CxvfsjQRzRN",
  //     "X-Naver-Client-Secret": "GGg7YRqJM2",
  //   },
  //   "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  // }).then((response) => {
  //   // console.log(response);
  //   res.json({ result: response.langcode });
  //   // res.send(response.langcode);
  // });
});
app.listen(port, () => {
  console.log(`${port}번에서 서버 대기중`);
});
