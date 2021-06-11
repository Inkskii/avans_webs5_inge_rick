let express = require('express');
let router = express();
let handleError;

let mongoose = require('mongoose');
const Upload = mongoose.model('Upload');

function getUploads(req, res){
	if (req.params.id) {
		var result = Upload.find({ _id: req.params.id })
		.populate('user')
		.populate('target');
	} else if (req.params.target) {
		var result = Upload.find({ target: req.params.target })
		.populate('user')
		.populate('target');
	} else if (req.params.user) {
		var result = Upload.find({ user: req.params.user })
		.populate('user')
		.populate('target');
	} else if (req.params.uri) {
		var result = Upload.find({ uri: req.params.uri })
		.populate('user')
		.populate('target');
	} else {
		var result = Upload.find()
		.populate('user')
		.populate('target');
	}

    result.then(data => {
        return res.json(data);
    })
    .catch(err => handleError(req, res, 500, err));   
}

function addUpload(req, res) {
    let upload = new Upload(req.body);
	upload
		.save()
		.then(savedUpload => {
			res.status(201);
			res.json(savedUpload);
		})
		.catch(err => handleError(req, res, 500, err));
}

router.route('/').get(getUploads);
router.route('/:id').get(getUploads);
router.route('/:target').get(getUploads);
router.route('/:user').get(getUploads);
router.route('/create').post(addUpload);

//Export
module.exports = function (errCallback){
	console.log('Initializing Uploads Routing Module');
	
	handleError = errCallback;
	return router;
};
