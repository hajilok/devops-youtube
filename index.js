import express, { json } from "express";
import { exec } from "child_process";
import fs from "fs";
import cors from "cors"
const app = new express();
const port = 3000;
app.use(cors())
app.use(express.json())



const addtogit = "git add .gitlab-ci.yml"
const commit = `git commit -m "update stream key"`
const push = "git push -u -f source master"

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
    // const getkey = `echo streamkey="${key}" > .env`


    const editfile = (skey) => {
        fs.readFile('.gitlab-ci.yml', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            const result = data.replace(/STREAM_KEY: .*/, `STREAM_KEY: ${skey}`);

            fs.writeFile('.gitlab-ci.yml', result, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }

            });

        });


    }

    editfile(key)



    execshell(addtogit)
    execshell(commit)
    execshell(push)


    res.status(200).send({ status: "success", data: { key: key } });



});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
