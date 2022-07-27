import React, { useState } from 'react';
import './Tags.css';

const COLORS = ['red', 'green', 'blue', 'yellow' , 'gray'];

function TagsList({items, handleClick}) {
  const listItems = items.map((item) =>
    <li key={item.id} className={item.color}>
      <div> {item.name}</div>
      <button onClick={(e)=>handleClick(e, item)}></button>
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

export default function Tags({tags, onAdd, onDelete, }) {

  const [tag, setTag] = useState('');
  const [id, setId] = useState(0);

  function handleSave () {
    if (tag === '') return;

    const color = COLORS[id%COLORS.length];
    const item =  {id, name: tag + " " + id, color };
    onAdd(item);
    setTag('');
    setId(id +1);
  }

  function handleChange(event) {
    setTag(event.target.value);
  }

  function handleDelete(event, item) {
    onDelete(item);
  }

  return (

    <div className='tags'>
      {/*<TagSelect tags={tags} onApply={handleSelect} />*/}
      <input type="text" onChange={handleChange} value={tag} />
      <button onClick={handleSave}>Save</button>
      <TagsList items={tags} handleClick={handleDelete} />
  </div>);
}
