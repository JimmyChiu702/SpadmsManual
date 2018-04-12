const express = require('express');
const formidable = require('formidable');

const router = express.Router();

const contentModel = require('../model/content.js');
const chartModel = require('../model/chart.js');

const basePath = './src/lib/documents/';

// Content
router.get('/pdf/:filename', (req, res, next) => {
    let path = `${basePath}${req.params.filename}`;
    res.sendfile(path);                        
});             

router.get('/content', (req, res, next) => {
    contentModel.list().then(data => {
        res.json(data);
    }).catch(next); 
});

/*
router.post('/pdf/create', (req, res, next) => {
    var form = formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        contentModel.create(files.file, fields).then(data => {
            res.json(data);
        }).catch(next);
    });
});

router.post('/pdf/modify',  (req, res,  next) => {
    var form = formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        contentModel.modify(files.file, fields).then(data => {
            res.json(data);
        });
    });
});

router.post('/pdf/remove', (req, res, next) => {
    var form = formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        contentModel.remove(fields).then(data => {
            res.json(data);
        });
    });
    contentModel.remove(req.body).then(data => {
        res.json(data);
    }).catch(next);
})
*/
// Chart
router.get('/chart', (req, res, next) => {
    chartModel.list().then(data => {
        res.json(data);
    }).catch(next);
});
/*
router.post('/chart/create/', (req, res, next) => {
    chartModel.create(req.body).then(data => {
        res.json(data); 
    }).catch(next);
});

router.post('/chart/modify/', (req, res, next)  => {
    chartModel.modify(req.body).then(data => {
        res.json(data);
    }).catch(next);
});

router.post('/chart/remove', (req, res, next) => {
    chartModel.remove(req.body).then(data => {
        res.json(data);
    }).catch(next);
});
*/
module.exports = router;