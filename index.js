const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' })
const Upload = require('./models/upload');
const fs = require('fs')

mongoose.connect('mongodb://localhost:27017/upload-db',{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/upload', (req, res) => {
    res.render('upload');
});

app.post('/upload', upload.array('uploadFile'), async (req, res) => {
    const timeStamp = Date.now();
    const data = req.files.map((e) => {
        return {
            originalName: e.originalname,
            fileName: e.filename,
            filePath: e.path,
            uploadTime: timeStamp
    }})
    await Promise.all(data.map((e) => {
        const upload = new Upload(e);
        upload.save();
    }));
    res.redirect('/list');
});

app.get('/list', async (req, res) => {
    const uploads = await Upload.find();
    res.render('list', {uploads});
})

app.get('/download/:id', async (req, res) => {
    const uploads = await Upload.findById(req.params.id);
    res.download(path.join(__dirname, 'uploads/' + uploads.fileName), uploads.originalName);
})

app.get('/delete/:id', async (req, res) => {
    const upload = await Upload.findByIdAndDelete(req.params.id);
    fs.unlink(path.join(__dirname, 'uploads', upload.fileName), (err) => {
        if (err){
            console.log('error!!' + err);
        }
        else{
            console.log('File was deleted!!');
        }
        res.redirect('/list');
    });
    
})

app.get('/', (req, res) => {
    res.send('Index');
});

app.listen('3000', () => {
    console.log('Serving port 3000');
});