var express = require('express');
var router = express.Router();
var Gun = require('../models/gun');

router.route('/guns')
    .post(function (req, res){
        Gun(req.body).save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Gun created!' });
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

module.exports = router;
