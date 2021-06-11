let express = require('express');
let router = express();
let handleError;

let mongoose = require('mongoose');
const Target = mongoose.model('Target');

function getTargets(req, res) {
	if (req.params.city) {
		var result = Target.find({ city: req.params.city })
	} else if (req.params.name) {
		var result = Target.find({ name: req.params.name });
	} else if (req.params.uri) {
		var result = Target.find({ uri: req.params.uri });
	} else if (req.params.id) {
		var result = Target.find({ _id: req.params.id })
	} else {
		var result = Target.find();
	}

	result.then(data => {
		return res.json(data);
	})
		.catch(err => handleError(req, res, 500, err));
}

function addTarget(req, res) {
	let target = new Target(req.body);
	target
		.save()
		.then(savedTarget => {
			res.status(201);
			res.json(savedTarget);
		})
		.catch(err => handleError(req, res, 500, err));
}

//Routes
router.route('/:city').get(getTargets);
router.route('/:name').get(getTargets);
router.route('/:id').get(getTargets);
router.route('/').get(getTargets);
router.route('/create').post(addTarget);

//Export
module.exports = function (errCallback) {
	console.log('Initializing Targets Routing Module');

	handleError = errCallback;
	return router;
};
