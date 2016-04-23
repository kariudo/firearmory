var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var Grid = require('gridfs-stream');

/* guns */
var Gun = require('../models/gun');
router.route('/guns')
    .post(function (req, res){
        var gun = new Gun(req.body);

        gun.save(function(err) {
            if (err)
                res.send(err);

            res.json(gun);
        });
    })
    .get(function (req, res) {
        Gun.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

router.route('/guns/:gun_id')
    .get(function(req, res) {
        Gun.findById(req.params.gun_id, function(err, gun) {
            if (err)
                res.send(err);

            res.json(gun);
        });
    })
    .put(function(req, res) {
        Gun.findById(req.params.gun_id, function(err, gun) {
            if (err)
                res.send(err);

            Object.assign(gun, req.body);

            gun.save(function (err) {
                if (err)
                    res.send(err);

                res.json({message: 'Gun updated!'});
            });
        });

    })
    .delete(function(req, res){
        Gun.remove({
            _id: req.params.gun_id
        }, function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted.' });
        });
    });

/* Upload */
var upload = multer({dest: 'uploads/'});

router.post('/upload', upload.any(), function(req, res){
    var dirname = require('path').dirname(__dirname);
    var conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);
    var fileNames = [];
    for(var i=0, c=req.files.length; i<c; ++i)
    {
        var upload = req.files[i];
        var filePath = dirname + '/' + upload.path;
        var read_stream = fs.createReadStream(filePath);
        var writeStream = gfs.createWriteStream({
            filename: upload.filename,
            metadata: {
                mime: upload.mimetype
            }
        });
        read_stream.pipe(writeStream);
        fileNames.push(upload.filename);
        fs.unlink(filePath);
    }
    res.json({uploaded:fileNames});
});

/* File */
router.get('/file/:id',function(req,res){
    var file_id = req.params.id;
    var conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);

    gfs.files.find({filename: file_id}).toArray(function (err, files) {
        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            res.set('Content-Type', files[0].metadata.mime);
            var read_stream = gfs.createReadStream({filename: file_id});
            read_stream.pipe(res);
        } else {
            res.json('File Not Found');
        }
    });
});

module.exports = router;
