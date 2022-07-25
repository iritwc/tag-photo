import React, { useState } from 'react';
import './TagSelect.css';

export default function TagSelect({tags, onApply}) {

  const [selects, setSelects] = useState([]);

  const listItems = tags.map((item) =>
    <option key={item.id} className={item.color} value={item.id}>{item.name}</option>
  );

  function handleSelect(event) {
    const value = event.target.value;
    let index = selects.findIndex(s => s == value);
    console.log(index, value, selects);
    if (index == -1) {
      setSelects([...selects, value]);
    } else {
      setSelects([...selects.slice(0, index), ...selects.slice(index+1)]);
    }
  }

  function handleApply() {
    if (onApply) {
      onApply(selects);
      setSelects([]);
    }
  }

  return (
    <div className={"tags-select-wrapper"}>
      <select multiple={true} value={selects} onChange={handleSelect}>{listItems}</select>
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}
