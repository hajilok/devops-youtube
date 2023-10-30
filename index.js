import express, { json } from "express";
import { promisify } from "util";
import { exec } from "child_process";
import { promises as fs } from "fs";
import cors from "cors"
const app = new express();
const port = 3000;
app.use(cors())
app.use(express.json())


const addacount = `git config --global user.name "Yuki Kato"`
const addemail = `git config --global user.email "yukikatodo@gmail.com"`
const mkdir = "mkdir deployserver"
const dir = "cd deployserver"
const getfile = "wget https://raw.githubusercontent.com/hajilok/youtubeuploader/main/.gitlab-ci.yml"
const init = "git init --initial-branch=main"
const remote = "git remote add origin https://gitlab.com/yukikatodo/deployserver.git"
const addtogit = "git add ."
const commit = `git commit -m "update stream key"`
const push = "git push --set-upstream origin main"

const execshell = async (shell) => {
    try {
        const { stdout, stderr } = await promisify(exec)(shell);
        console.log(stdout);
        if (stderr) {
            console.log(stderr);
        }
    } catch (error) {
        console.log(error);
    }
}



app.get("/api/deploy/:key", (req, res) => {
    const key = req.params.key;
    // const getkey = `echo streamkey="${key}" > .env`



    const editFile = async (skey) => {
        try {
            const data = await fs.readFile('.gitlab-ci.yml', 'utf8');
            const result = data.replace(/STREAM_KEY: .*/, `STREAM_KEY: ${skey}`);
            await fs.writeFile('.gitlab-ci.yml', result, 'utf8');
            console.log('File updated successfully');
        } catch (err) {
            console.error('Error:', err);
        }
    };



    execshell(addacount)
    execshell(addemail)
    execshell(mkdir)
    execshell(dir)
    editFile(key).then(() => res.status(200).send({ status: "success", data: { key: key } })).catch(() => res.status(500).send({ status: "error", data: { error: error } }));
    execshell(getfile)
    execshell(init)
    execshell(remote)
    execshell(addtogit)
    execshell(commit)
    execshell(push)






});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
