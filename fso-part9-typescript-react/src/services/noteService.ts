import axios from 'axios';
import { NewNote, Note } from '../types/types';

const baseUrl = 'http://localhost:3001/notes';

export const getAllNotes = async () => {
  const response = await axios.get<Note[]>(baseUrl);
  return response.data;
};

export const createNote = async (object: NewNote) => {
  const response = await axios.post<Note>(baseUrl, object);
  return response.data;
};
