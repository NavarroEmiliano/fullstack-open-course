import { useEffect, useState } from 'react';
import { createNote, getAllNotes } from './services/noteService';
import { Note } from './types/types';

const App = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getAllNotes();
      setNotes(data);
    })();
  }, []);

  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    (async () => {
      const data = await createNote({ content: newNote });
      setNotes(notes.concat(data));
    })();
    setNewNote('');
  };

  return (
    <div>
      <form onSubmit={noteCreation}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type='submit'>Add</button>
      </form>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
