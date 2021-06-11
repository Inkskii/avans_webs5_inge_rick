let mongoose = require('mongoose');
let imagga = require('../external/imaggaConnection');
const url = require('url');

console.log('Initializing Target Schema');

let targetSchema = new mongoose.Schema({
    uri: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    tags: { type: String }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

targetSchema.pre(
    'save',
    async function (next) {
        const target = this;
        const tags = await imagga.getTags(this.uri);
        this.tags = tags;
        next()
    }
);

const TargetModel = mongoose.model('Target', targetSchema);
module.exports = TargetModel;