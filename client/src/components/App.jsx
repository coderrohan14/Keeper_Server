import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notesList, setNoteList] = useState([]);

  useEffect(() => {
    fetch("/notes")
      .then(res => res.json())
      .then(
        (result) => {
          setNoteList(result);
        },
        (error) => {
          console.log(error);
        }
      )
  }, []);

  function addNote(note) {
    fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(note)
    }).then(response => response.json())
      .then(response => {
        setNoteList(response);
      });
  }

  function deleteNote(id) {
    fetch(`/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ noteId: id })
    }).then(response => response.json())
      .then(response => {
        setNoteList(response);
      });
  }

  return (
    <div>
      <Header />
      <CreateArea addNote={addNote} />
      {notesList.map((note) => {
        return <Note key={note._id} currNote={note} onDelete={deleteNote} />;
      })}
      <Footer />
    </div>
  );
}

export default App;
