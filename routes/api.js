var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var Grid = require('gridfs-stream');
var imagemagick = require('imagemagick');

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

router.post('/upload/:parentId?', upload.any(), function(req, res){
    // TODO: change this to only take images
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
                mime: upload.mimetype,
                parent: req.params.parentId
            }
        });
        read_stream.pipe(writeStream);
        fileNames.push(upload.filename);
        // create thumbnail
        (function(filePath, upload) {
            imagemagick
                .resize({
                    srcPath: filePath,
                    dstPath: filePath + '_thumb',
                    width: 100
                }, function (err) {
                    // store thumbnail
                    if (err) {
                        res.json(err);
                    }
                    var thumbReadStream = fs.createReadStream(filePath + '_thumb');
                    var thumbWriteStream = gfs.createWriteStream({
                        filename: upload.filename + '_thumb',
                        metadata: {
                            mime: upload.mimetype,
                            parent: req.params.parentId,
                            thumbnail: true
                        }
                    });
                    thumbReadStream.pipe(thumbWriteStream);
                    // cleanup temp file cache
                    fs.unlink(filePath);
                    fs.unlink(filePath + '_thumb');
                });
        })(filePath, upload);
    }
    res.json({uploaded:fileNames});
});

/* File */
router.get('/file/:id/:action?',function(req,res){
    var file_id = req.params.id;
    var conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);

    var query = req.params.action === 'thumb' ? {filename: file_id + '_thumb'} : {filename: file_id};
    gfs.files.find(query).toArray(function (err, files) {
        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            res.set('Content-Type', files[0].metadata.mime);
            var read_stream = gfs.createReadStream(query);
            read_stream.pipe(res);
        } else {
            res.statusCode = 404;
            res.json('File Not Found');
        }
    });
});

// file by parent id
router.get('/files/:id',function(req,res){
    var parent_id = req.params.id;
    var conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);

    gfs.files.find({'metadata.parent':parent_id}).toArray(function (err, files) {
        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            res.json(files);
        } else {
            res.statusCode = 404;
            res.json('File Not Found');
        }
    });
});

module.exports = router;
