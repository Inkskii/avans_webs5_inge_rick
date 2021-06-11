let mongoose = require('mongoose');
const bcrypt = require('bcrypt');

console.log('Initializing User Schema');

let userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'}
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

userSchema.pre(
    'save',
    async function(next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next()
    }
);

userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
