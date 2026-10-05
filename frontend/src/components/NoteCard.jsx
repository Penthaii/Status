import { useState } from "react";
import "./Notes.css";

function NoteCard({ id, title, content, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editContent, setEditContent] = useState(content);


    function handleSave() {
        onUpdate(id, editTitle, editContent);
        setIsEditing(false);
    }



    function handleDeleteClick() {
        if (window.confirm("Bu notu silecek misin ?")) {
            onDelete(id);
        }
    }

    if (isEditing) {
        return (
            <div className="note-card note-card--editing">
                <input
                    className="note-card__input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Başlık"
                />
                <input
                    className="note-card__input"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="İçerik"
                />
                <div className="note-card__actions">
                    <button className="btn btn--save" onClick={handleSave}>Kaydet</button>
                    <button className="btn btn--cancel" onClick={() => setIsEditing(false)}>İptal</button>
                </div>
            </div>
        );
    }

    return (
        <div className="note-card">
            <h3>{title}</h3>
            <p>{content}</p>
            <div className="note-card__actions">
                <button className="btn btn--edit" onClick={() => setIsEditing(true)}>Güncelle</button>
                <button className="btn btn--delete" onClick={handleDeleteClick}>Sil</button>
            </div>
        </div>
    );
}

export default NoteCard;
