const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const os = require('os');
const fs = require('fs');

const app = express();

app.use(cors())

let source = os.homedir() + '\\Downloads';

app.get('/download/video', async (req, res) => {
    try{
        const { url } = req.query;
        ytdl.getInfo(url)
        .then(r=>{
            console.log('start...');
            ytdl(url, { quality: 'highestvideo', format: 'mp4' })
            .pipe(fs.createWriteStream(source + '\\'+ r.videoDetails.title +'.mp4'))
            .on('finish', () => {
                return res.json({ mensagem: 'Vídeo baixado!'})           
            })
            .on('error', () => {
                return res.status(400).json({ mensagem: 'Ocorreu um erro...' });
            })
        })
        .catch(()=>{
            return res.status(404).json({
                mensagem: 'O download do vídeo falhou!'
            })
        })

    }catch{
        return res.status(400).json({ mensagem: 'Não foi possível baixar o vídeo' });
    }

});

app.get('/download/audio', async (req, res) => {
    try{
        const { url } = req.query;

        ytdl.getInfo(url)
        .then((r)=>{
            ytdl(url, { quality: 'highestaudio', format: 'mp3' })
            .pipe(fs.createWriteStream(source + '\\'+ r.videoDetails.title +'.mp3'))
            .on('finish', () => {
                return res.json({ mensagem: 'Áudio baixado!' });
            })
            .on('error', () => {
                return res.status(400).json({ mensagem: 'Ocorreu um erro...' });
            })
        })
        .catch(()=>{
            return res.status(404).json({
                mensagem: 'O download do áudio falhou!'
            })
        })

    }catch{
        return res.status(400).json({ mensagem: 'Não foi possível baixar o áudio' });
    }

});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
