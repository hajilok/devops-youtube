import express, { json } from "express";
import { promisify } from "util";
import { exec } from "child_process";
import { promises as fs } from "fs";
import cors from "cors"
const app = new express();
const port = 3000;
app.use(cors())
app.use(express.json())


const addacount = `git config --global user.name "imamwahyu"`
const addemail = `git config --global user.email "imamwahyu635@gmail.com"`
const remote = "git remote add origin https://imamwahyu@bitbucket.org/gohashindi/youtube-live-streaming.git"
const addtogit = "git add bitbucket-pipelines.yml"
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
            const data = await fs.readFile('bitbucket-pipelines.yml', 'utf8');
            const result = data.replace(/streamkey= .*/, `streamkey=${skey}`);
            await fs.writeFile('bitbucket-pipelines.yml', result, 'utf8');
            console.log('File updated successfully');
        } catch (err) {
            console.error('Error:', err);
        }
    };



    async function runCommands(gkey) {
        try {
            await execshell(addacount);
            await execshell(addemail);
            const nextkey = await editFile(gkey);
            await execshell(remote);
            await execshell(commit);
            await execshell(push);

            res.status(200).send({ status: "success", data: { key: nextkey } });
        } catch (error) {
            res.status(500).send({ status: "error", data: { error: error } });
        }
    }

    runCommands(key);







});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
