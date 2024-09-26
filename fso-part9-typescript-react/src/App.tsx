import axios from 'axios';
import { useEffect, useState } from 'react';


const App = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([{ id: 1, content: 'testing' }]);

  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    axios
      .post<Note>('http://localhost:3001/notes', { content: newNote })
      .then(response => setNotes(notes.concat(response.data)));

    setNewNote('');
  };

  useEffect(() => {
    axios.get<Note[]>('http://localhost:3001/notes').then(response => {
      setNotes(response.data);
    });
  }, []);

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
