import client from './client';

export const getNotes = () => client.get('/notes');

export const getNote = (noteId) => client.get(`/notes/${noteId}`);

export const deleteNote = (noteId) => client.delete(`/notes/${noteId}`);
