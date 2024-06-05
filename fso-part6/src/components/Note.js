import React from 'react'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong>{note.important ? ' Important' : ''}</strong>
    </li>
  )
}

export default Note
