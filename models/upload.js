const mongoose = require('mongoose');
const schema = mongoose.Schema;

const uploadSchema = new schema({
    originalName: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadTime: {
        type: Date,
        required: true
    }
})

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;