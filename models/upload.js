let mongoose = require('mongoose');
let imagga = require('../external/imaggaConnection')

console.log('Initializing Upload Schema');

const Target = mongoose.model('Target');

let uploadSchema = new mongoose.Schema({
    uri: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'Target' },
    tags: { type: String },
    completed: { type: Boolean},
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

uploadSchema.pre(
    'save',
    async function (next) {
        const upload = this;
        this.completed = false;
        const tags = await imagga.getTags(this.uri);
        this.tags = tags;

        var uploadTags = [];
        var parsedJSON = JSON.parse(this.tags);

        //if upload tags ongeveer hetzelfde als target tags
        for(i = 0; i < 10; i++ ) {
            uploadTags.push(parsedJSON.result.tags[i].tag.en)
        }
        var targetTags = [];

        var target = Target.findById(this.target, function (err, docs){
            if (err) {
                return res.json('The Target could not be found, try again.')
            }
        });

        target.then(data => {
            parsedJSON = JSON.parse(data.tags);
            for(i = 0; i < 10; i++ ) {
                targetTags.push(parsedJSON.result.tags[i].tag.en)
            }

            k = 0;

            targetTags.forEach(target => {
                if(uploadTags.includes(target)){
                    k++;
                }
            })

            if(k > 4) {
                this.completed = true;
            }
            
        });

        next()
    }
);

const UploadModel = mongoose.model('Upload', uploadSchema);
module.exports = UploadModel;