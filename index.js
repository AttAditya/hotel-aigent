const express = require("express");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const app = express();
const chatsRouter = require("./src/routes/chats.route");

app.use(express.json());
app.use("/api/chats", chatsRouter);

app.get("/postwoman", (req, res) => {
    let postwomanHtmlPath = "./src/views/postwoman.html";
    let postwomanHtml = fs.readFileSync(postwomanHtmlPath, "utf8");
    res.send(postwomanHtml);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

