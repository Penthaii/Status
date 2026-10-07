import { useState } from "react";

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
        <form className="flex justify-center gap-2 my-6" onSubmit={handleSubmit}>
            <input
                className="px-2.5 py-2 border border-border rounded-md"
                value={title}
                onChange={function (e) {
                    setTitle(e.target.value);
                }}
                placeholder="Başlık"
            />
            <input
                className="px-2.5 py-2 border border-border rounded-md"
                value={content}
                onChange={function (e) {
                    setContent(e.target.value);
                }}
                placeholder="İçerik"
            />
            <button className="px-3.5 py-2 rounded-md bg-accent text-white cursor-pointer" type="submit">Ekle</button>
        </form>
    );
}

export default NoteForm;
