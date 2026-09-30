import { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import NoteForm from "./NoteForm";
import api from "../api";

function NoteList() {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);

    async function handleAddNote(newNote) {
        try {
            const res = await api.post("/notes", newNote);
            setNotes([...notes, res.data]);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDeleteNote(id) {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note.id !== id));
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleUpdateNote(id, newTitle, newContent) {
        try {
            const res = await api.put(`/notes/${id}`, { title: newTitle, content: newContent });
            setNotes(notes.map((note) => (note.id === id ? res.data : note)));
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }
    useEffect(function () {
        async function fetchNotes() {
            try {
                const res = await api.get("/notes");
                setNotes(res.data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchNotes();
    }, []);


    return (
        <div>
            {error && <div className="error-banner">{error}</div>}
            <NoteForm onAddNote={handleAddNote} />
            <div className="notes-grid">
                {notes.map(function (note) {
                    return (
                        <NoteCard
                            key={note.id}
                            id={note.id}
                            title={note.title}
                            content={note.content}
                            onDelete={handleDeleteNote}
                            onUpdate={handleUpdateNote}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default NoteList;
