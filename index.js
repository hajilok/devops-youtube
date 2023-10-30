import express, { json } from "express";
import { exec } from "child_process";
import cors from "cors"
const app = new express();
const port = 3000;
app.use(cors())
app.use(express.json())


const clonerepo = "wget https://raw.githubusercontent.com/hajilok/youtube-live-streaming/main/main.js"
const install = "npm install"
const build = "pm2 start main.js"

const execshell = (shell) => {
    try {
        exec(shell, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(stdout);
            console.log(stderr);
        });
    } catch (error) {
        console.log(error);
    }
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
