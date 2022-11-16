const express = require('express');
const path = require('path');
const fs = require('fs');
//USE NPM UUID FOR RANDOM ID USED FOR NOTES
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

let notes = "";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

fs.readFile('./db/db.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    // CONVERT STRING INTO JSON OBJECT
    notes = JSON.parse(data);
  }
});

// POST REQUEST TO ADD A REVIEW
app.post('/api/notes', (req, res) => {
  // LOG THAT A POST REQUEST WAS RECEIVED
  console.info(`${req.method} request received to add a note`);

  // DESTRUCTURING ASSIGNMENT FOR THE ITEMS IN REQ.BODY
  const { title, text } = req.body;

  // IF ALL THE REQUIRED PROPERTIES ARE PRESENT
  if ((title) && (text)) {
    // VARIABLE FOR THE OBJECT WE WILL SAVE
    const newNote = {
      title,
      text,
      id: uuid.v4()
    };
    // ADD A NEW NOTE TO ARRAY
    notes.push(newNote);

    // WRITE NEW NOTE TO db.json
    fs.writeFile(
      './db/db.json',
      JSON.stringify(notes, null, 2),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully added new note.')
    );
    res.json(notes);
  } else {
    console.error("Something went wrong");
  }
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});
// DELETE NOTES FROM db.JSON
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  let note;

  notes.map((deleteNote, index) => {
    if (deleteNote.id == id) {
      note = deleteNote;
      notes.splice(index, 1)
      console.log("Note with Id: " + deleteNote.id + " has been deleted");
      return res.json(note);
    }

  })
});
//RETRIEVE NOTES HTML PAGE
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
//RETRIEVE INDEX HTML PAGE
app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
