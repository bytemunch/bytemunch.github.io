const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('fs');
const crypto = require('crypto');
const md = require('markdown-it')();

(async function main() {
    if (fs.existsSync('./blog-staging-temp'))
        fs.rmSync('./blog-staging-temp', { recursive: true });

    fs.mkdirSync('./blog-staging-temp');
    fs.mkdirSync('./blog-staging-temp/posts');
    fs.mkdirSync('./blog-staging-temp/posts/img');

    let db = JSON.parse(fs.readFileSync('./src/root/posts/db.json').toString());

    let postString = fs.readFileSync('./blog-staging/main.md').toString();

    // get blogID and tags from user
    // get title from md
    const title = postString.substring(2, postString.indexOf("\n"));

    let tags = [];

    const blogId = await pQuestion('\nEnter unique blog ID: ');

    let keepOldDate = false;
    let keepOldTags = false;

    // check for ID collision
    if (db[blogId] != undefined) {
        const confirm = await pQuestion('\nID Exists! [F] to overwrite, anything else to quit: ');
        if (confirm != 'F' && confirm != 'f') {
            rl.close();
            return;
        }

        const oldDateStr = new Date(db[blogId].date).toUTCString()

        keepOldDate = (await pQuestion(`\nOld Date: ${oldDateStr}\nKeep old post date? [Y/N]: `)).toLowerCase() == 'y';
        keepOldTags = (await pQuestion(`\nOld Tags: ${db[blogId].tags.join(',')}\nKeep old post tags? [Y/N]: `)).toLowerCase() == 'y';
    }

    if (!keepOldTags) {
        // check for new tags and confirm if found, typo saver
        tags = (await pQuestion('\nEnter comma seperated tags (e.g. tag1,tag2,tag3): ')).split(',');

        for (let t of tags) {
            let tagFound = false;
            for (let id in db) {
                tagFound = db[id].tags.includes(t);
            }

            if (!tagFound) {
                let addNewTag = (await pQuestion(`\n'${t}' is a new tag! Continue? [Y/N]: `)).toLowerCase() == 'y';

                if (!addNewTag) {
                    console.log('Cancelled!');
                    rl.close();
                    return;
                }
            }
        }

    } else {
        tags = db[blogId].tags;
    }

    const date = keepOldDate ? db[blogId].date : Date.now();

    // const dInput = await pQuestion('Please enter date of post YYYY-MM-DD: ');

    // const date = new Date(dInput).valueOf();

    rl.close();

    const images = fs.readdirSync('./blog-staging/posts/img');

    for (let i of images) {
        const imgPath = `./blog-staging/posts/img/${i}`;

        // Hash image
        const img = fs.readFileSync(imgPath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(img);

        const hash = hashSum.digest('hex');

        const imgExt = i.split('.')[1];

        // Replace image refs in postString with hash
        postString = postString.replace(i, `${hash}.${imgExt}`);

        // Copy image to blog-staging-temp named as hash
        fs.copyFileSync(imgPath, `./blog-staging-temp/posts/img/${hash}.${imgExt}`);
    }

    // Write edited postString to blog-staging-temp
    fs.writeFileSync('./blog-staging-temp/main.md', postString);

    // Convert md to html
    const html = md.render(postString);

    fs.writeFileSync(`./blog-staging-temp/${blogId}.html`, html);

    // add blog from blog-staging-temp to /posts
    fs.copyFileSync(`./blog-staging-temp/${blogId}.html`, `./src/root/posts/${blogId}.html`);

    // don't copy images if file exists
    fs.cpSync(`./blog-staging-temp/posts/img`, './src/root/posts/img', { recursive: true, force: false });

    // update db.json
    db[blogId] = {
        title,
        tags,
        date
    }
    fs.writeFileSync('./src/root/posts/db.json', JSON.stringify(db));

    // cleanup 
    fs.rmSync('./blog-staging-temp', { recursive: true });

    console.log(`Added ${db[blogId].title} to /src/root/posts/${blogId}.html`);

    console.log('Remember to build the project and test the update!')
})();

async function pQuestion(text) {
    return new Promise(res => {
        rl.question(text, a => {
            res(a);
        });
    })
}