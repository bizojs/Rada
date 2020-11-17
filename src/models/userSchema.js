const mongoose = require('mongoose');
const config = require('../config');
mongoose.connect(config.mongooseUrl, {useNewUrlParser: true, useUnifiedTopology: true});
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    settings: {
        type: Object,
        require: true
    }
}, { minimize: false });

module.exports = mongoose.model('users', userSchema);