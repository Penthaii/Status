import { useState } from "react";
import "./Notes.css";

function NoteForm({ onAddNote }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const newNote = { id: Date.now(), title, content };
        onAddNote(newNote);
        setTitle("");
        setContent("");

    }

    return (
        <form className="note-form" onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={function (e) {
                    setTitle(e.target.value);
                }}
                placeholder="Başlık"
            />
            <input
                value={content}
                onChange={function (e) {
                    setContent(e.target.value);
                }}
                placeholder="İçerik"
            />
            <button type="submit">Ekle</button>
        </form>
    );
}

export default NoteForm;
