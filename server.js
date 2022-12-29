const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

dotenv.config({ path: "./config.env" });

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const atlas_username = process.env.ATLAS_USERNAME;
const atlas_password = process.env.ATLAS_PASSWORD;

const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${atlas_username}:${atlas_password}@cluster0.lvuymcy.mongodb.net/keeperDB`);

const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Note = mongoose.model("Note", noteSchema);

app.route("/notes")

    .get((req, res) => {
        getAllNotes(res);
    })

    .post((req, res) => {
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content
        });

        newNote.save((err) => {
            if (err) {
                console.log(err);
            } else {
                getAllNotes(res);
            }
        });
    });

app.route("/notes/:noteId")

    .get((req, res) => {

        const noteId = req.params.noteId;

        Note.findById(noteId, (err, foundNote) => {
            if (err) {
                console.log(err);
            } else {
                res.send(foundNote);
            }
        });
    })

    .delete((req, res) => {
        const noteId = req.params.noteId;
        Note.deleteOne({ _id: noteId }, (err) => {
            if (err) {
                console.log(err);
            } else {
                getAllNotes(res);
            }
        })
    });

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
}

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})

function getAllNotes(res) {
    Note.find({}, (err, notes) => {
        if (err) {
            console.log(err);
        } else {
            res.send(notes);
        }
    });
}