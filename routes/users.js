let express = require('express');
let router = express();
let handleError;

let mongoose = require('mongoose');
const User = mongoose.model('User');
const Upload = mongoose.model('Upload');

function getUsers(req, res) {
    if (req.params.id) {
        var result = User.find({ _id: req.params.id })
    } else if (req.params.name) {
        var result = User.find({ name: req.params.name });
    } else if (req.params.role) {
        var result = User.find({ role: req.params.role });
    } else {
        var result = User.find();
    }

    result.then(data => {
        return res.json(data);
    })
        .catch(err => handleError(req, res, 500, err));
}

function deleteUser(req, res) {
    User.findByIdAndDelete(req.params.id, function (err, docs) {
        if (err) {
            return res.json('The User could not be deleted, try again.');
        }
        else {
        }
    });
}

function getTargetFromUserUpload(req, res) {
    User.findById(req.params.id, function (err, docs) {
        if (err) {
            return res.json('The User could not be found, try again.')
        }
        else {
            var result = Upload.findById(req.params.uploadid, function (err, docs) {
                if (err) {
                    return res.json('The User had no such Upload, try again.')
                }
            }).populate('target');

            console.log(result.then(data => {
                return res.json(data.target)
            }));
        }
    })
}

//Routing
router.route('/').get(getUsers);
router.route('/:id').get(getUsers);
router.route('/:name').get(getUsers);
router.route('/:role').get(getUsers);
router.route('/:id/delete').delete(deleteUser);
router.route('/:userid/uploads/:uploadid/target').get(getTargetFromUserUpload);

//Export
module.exports = function (errCallback) {
    console.log('Initializing Users Routing Module');

    handleError = errCallback;
    return router;
};