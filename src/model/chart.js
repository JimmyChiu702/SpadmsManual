const fs = require('fs');

const filePath = './src/lib/chart.json';

function list() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
        }
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
}

function create(reqBody) {
    return new Promise((resolve, reject) => {
        const {
            part,
            parent,
            text1,
            text2
        } = reqBody;
        list().then(chart => {
            if (parent!==null) {
                let newObject = {
                    "condition": text1,
                    "discription": text2
                };
                chart[part][parent].child.push(newObject);

            } else {
                let newObject = {
                    "parent": text1,
                    "child": []
                }
                chart[part].push(newObject);
            }
            fs.writeFile(filePath, JSON.stringify(chart), err => {
                if (err) reject(err);
                resolve(chart);
            });
        });
    });
}

function modify(reqBody) {
    return new Promise((resolve, reject) => {
        const {
            part,
            parent,
            child,
            text1,
            text2
        } = reqBody;
        list().then(chart => {
            if (child!==null) {
                let modified = {
                    "condition": text1,
                    "discruption": text2
                };
                chart[part][parent].child[child] = modified;
            } else {
                chart[part][parent].parent = text1;
            }
            fs.writeFile(filePath, JSON.stringify(chart), err => {
                if (err) reject(err);
                resolve(chart);
            });
        });
    });
}

function remove(reqBody) {
    return new Promise((resolve, reject) => {
        const {
            part,
            parent,
            child
        } = reqBody;
        list().then(chart => {
            if (child!==null) {
                chart[part][parent].child.splice(child, 1);
            } else {
                chart[part].splice(parent, 1);
            }
            fs.writeFile(filePath, JSON.stringify(chart), err => {
                if (err) reject(err);
                resolve(chart);
            });
        });
    });
}

module.exports = {
    list,
    create,
    modify,
    remove
};