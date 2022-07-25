import React, { useState } from 'react';
import './Tags.css';
import TagSelect from './TagSelect.js';

// const MOCK_TAGS = [{id: 1, name: 'Tag 1', color: 'red'},
//   {id: 2, name: 'Tag 2', color: 'blue'},
//   {id: 3, name: 'Tag 3', color: 'yellow'},
//   {id: 4, name: 'Tag 4', color: 'green'},
//   {id: 5, name: 'Tag 5', color: 'gray'},];

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

export default function Tags({tags, onAdd, onDelete}) {

  // const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');
  const [id, setId] = useState(0);

  function handleSave () {
    if (tag === '') return;

    const color = COLORS[id%COLORS.length];
    const item =  {id, name: tag + " " + id, color };
    onAdd(item);
    // setTags([...tags,item]);
    setTag('');
    setId(id +1);
  }

  function handleChange(event) {
    setTag(event.target.value);
  }

  function handleDelete(event, item) {

    onDelete(item);
    // let index = tags.indexOf(item);
    // // console.log(item, index);
    // setTags([...tags.slice(0, index), ...tags.slice(index+1)]);
  }

  function handleSelect(items){
    console.log("Selected items", items);
  }


  return (

    <div className='tags'>
      <TagSelect tags={tags} onApply={handleSelect} />
      <input type="text" onChange={handleChange} value={tag} />
      <button onClick={handleSave}>Save</button>
      <TagsList items={tags} handleClick={handleDelete} />
  </div>);
}
