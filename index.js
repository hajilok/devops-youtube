import express, { json } from "express";
import { exec } from "child_process";
import cors from "cors"
const app = new express();
const port = 3000;
app.use(cors())
app.use(express.json())


const clonerepo = "git clone https://github.com/hajilok/youtube-live-streaming && cd youtube-live-streaming"
const install = "npm install"
const build = "pm2 main.js"

const execshell = (shell) => {
    exec(shell, (err, stdout, stderr) => {
        if (err) {
            res.send(`error: ${err.message}`);
            return;
        }
    })
}





app.get("/api/deploy/:key", async (req, res) => {
    const key = req.params.key;
    const getkey = `echo streamkey=${key} > .env`

    execshell(clonerepo)
    execshell(getkey)
    execshell(install)
    execshell(build)

    res.status(200).send({ status: "success", data: "deployed" });



});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
