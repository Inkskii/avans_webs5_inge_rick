let mongoose = require('mongoose');
let imagga = require('../external/imaggaConnection')

console.log('Initializing Upload Schema');

let uploadSchema = new mongoose.Schema({
    uri: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'Target' },
    tags: { type: String },
    completed: { type: Boolean, default: false},
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

uploadSchema.pre(
    'save',
    async function (next) {
        const upload = this;
        const tags = await imagga.getTags(this.uri);
        this.tags = tags;

        var tagMap = new Map();
        var parsedJSON = JSON.parse(this.tags);

        //if upload tags ongeveer hetzelfde als target tags
        for(i = 0; i < 10; i++ ) {
            tagMap.set(parsedJSON.result.tags[i].tag.en, parsedJSON.result.tags[i].confidence)
        }
        console.log(tagMap);


        //Set accepted true
        next()
    }
);

const UploadModel = mongoose.model('Upload', uploadSchema);
module.exports = UploadModel;