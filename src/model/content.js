const fs = require('fs');

const filePath = './src/lib/content.json';
const uploadPath = './src/lib/documents/';

function list() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "[]");
        }
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data ? JSON.parse(data) : []);
        });
    });
}

function create(file, fields) {
    return new Promise((resolve, reject) => {
        list().then(content => {
            const {
                chapter,
                section,
                text,
                level
            } = fields;
            if (file && chapter>=0) {
                const filename = file.name;
                const oldPath = file.path;
                const newPath = `${uploadPath}${file.name}`;
                fs.rename(oldPath, newPath, err => {
                    if (err) reject(err);
                    const newObject = {
                        "text": text,
                        "filename": filename,
                        "level": (level) ? level : ""
                    };
                    if (section) {
                        content[chapter].section[section].subsection.push(newObject);
                    } else {
                        content[chapter].subsection.push(newObject);
                    }
                    fs.writeFile(filePath, JSON.stringify(content), err => {
                        if (err) reject(err);
                        resolve(content);
                    });
                });
            } else {
                if (chapter>=0) {
                    const newObject = {
                        "text": text,
                        "subsection": []
                    };
                    content[chapter].section.push(newObject);
                } else {
                    const newObject = {
                        "text": text,
                        "section": [],
                        "subsection": []
                    };
                    content.push(newObject);
                }
                fs.writeFile(filePath, JSON.stringify(content), err => {
                    if (err) reject(err);
                    resolve(content);
                });
            }
        });
    });
}

function modify(file, fields) {
    return new Promise((resolve, reject) => {
        list().then(content => {
            const {
                chapter,
                section,
                subsection,
                text,
                level
            } = fields;
            if (chapter>=0) {
                if (subsection>=0) {
                    const modified = {
                        "text": text,
                        "filename": file.name,
                        "level": (level) ? level : ""
                    };
                    if (section>=0) {
                        content[chapter].section[section].subsection[subsection] = modified;
                    } else {
                        content[chapter].subsection[subsection] = modified;
                    }
                    if (file) {
                        const oldPath = file.path;
                        const newPath = `${uploadPath}${file.name}`;
                        fs.renameSync(oldPath, newPath);
                    }
                } else {
                    if (section>=0) {
                        content[chapter].section[section].text = text;
                    } else {
                        content[chapter].text = text;
                    }
                }
                fs.writeFile(filePath, JSON.stringify(content), err => {
                    if (err) reject(err);
                    resolve(content);
                });
            } else {
                resolve(content);
            }
        });
    });
}

function remove(fields) {
    return new Promise((resolve, reject) => {
        list().then(content => {
            const {
                chapter,
                section,
                subsection
            } = fields;
            if (chapter>=0) {
                if (subsection>=0) {
                    if (section>=0) {
                        fs.unlink(`${uploadPath}${content[chapter].section[section].subsection[subsection].text}`, err => {
                            if (err) reject(err);
                            content[chapter].section[section].subsection.splice(subsection, 1);
                            fs.writeFile(filePath, JSON.stringify(content), err => {
                                if (err) reject(err);
                                resolve(content);
                            });
                        });
                    } else {
                        fs.unlink(`${uploadPath}${content[chapter].subsection[subsection].text}`, err => {
                            if (err) reject(err);
                            content[chapter].subsection.splice(subsection, 1);
                            fs.writeFile(filePath, JSON.stringify(content), err => {
                                if (err) reject(err);
                                resolve(content);
                            });
                        });
                    }
                } else {
                    if (section>=0) {
                        content[chapter].section[section].subsection.forEach((item, index) => {
                            fs.unlinkSync(`${uploadPath}${item.filename}`);
                        });
                        content[chapter].section.splice(section, 1);    
                        fs.writeFile(filePath, JSON.stringify(content), err => {
                            if (err) reject(err);
                            resolve(content);
                        });
                    } else {
                        content[chapter].section.forEach(item_sec => {
                            item_sec.subsection.forEach((item_sub, index) => {
                                fs.unlinkSync(`${uploadPath}${item_sub.filename}`);
                            });
                        });
                        content.splice(chapter, 1);
                        fs.writeFile(filePath, JSON.stringify(content), err => {
                            if (err) reject(err);
                            resolve(content);
                        });
                    }
                }
            } else {
                resolve(content);
            }
        });
    });
}

module.exports = {
    list,
    create,
    modify,
    remove
};