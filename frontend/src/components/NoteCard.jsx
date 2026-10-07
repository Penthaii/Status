import { useState } from "react";


const BUTTON_BASE = "flex-1 px-2.5 py-1.5 rounded-md border text-sm cursor-pointer transition-opacity hover:opacity-85";
const CARD_BASE = "flex flex-col text-left px-4 py-3.5 border border-border rounded-lg bg-bg shadow-card transition-colors hover:border-accent-border";
const INPUT_CLASS = "px-2 py-1.5 border border-border rounded-md";

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
            <div className={`${CARD_BASE} gap-2`}>
                <input
                    className={INPUT_CLASS}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Başlık"
                />
                <input
                    className={INPUT_CLASS}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="İçerik"
                />
                <div className="flex gap-2 mt-auto">
                    <button className={`${BUTTON_BASE} bg-accent text-white border-transparent`} onClick={handleSave}>Kaydet</button>
                    <button className={`${BUTTON_BASE} bg-transparent text-text border-border`} onClick={() => setIsEditing(false)}>İptal</button>
                </div>
            </div>
        );
    }

    return (
        <div className={CARD_BASE}>
            <h3 className="mb-1.5 text-lg font-bold text-text-h">{title}</h3>
            <p className="mb-3 grow text-text">{content}</p>
            <div className="flex gap-2 mt-auto">
                <button className={`${BUTTON_BASE} bg-accent-bg text-accent border-accent-border`} onClick={() => setIsEditing(true)}>Güncelle</button>
                <button className={`${BUTTON_BASE} bg-transparent text-danger border-danger`} onClick={handleDeleteClick}>Sil</button>
            </div>
        </div>
    );
}

export default NoteCard;
