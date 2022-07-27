import React, { useState , useRef, useEffect} from 'react';
import './TagSelect.css';

export default function TagSelect({tags, onApply, position=null}) {

  const [selects, setSelects] = useState([]);
  const selectTag = useRef(null);

  const listItems = tags.map((item) =>
    <option key={item.id} className={item.color} value={item.id}>{item.name}</option>
  );

  function handleSelect(event) {
    const value = event.target.value;
    let index = selects.findIndex(s => s === value);
    // console.log(index, value, selects);
    if (index === -1) { // not exist then add
      setSelects([...selects, value]);
    } else { // exist then remove
      setSelects([...selects.slice(0, index), ...selects.slice(index+1)]);
    }
  }

  function handleApply() {
    if (onApply) {
      onApply(selects);
      setSelects([]);
    }
  }

  useEffect(() => {
    // console.log("useEffect", selectTag.current.style, position);

    if (position == null) {
      selectTag.current.top = 0;
      selectTag.current.left = 0;
    } else {
      selectTag.current.style.top = (position.offsetTop + position.offsetHeight) + "px";
      selectTag.current.style.left = position.offsetLeft + "px";
    }
    setSelects([]);
  }, [position]);

  return (
    <div ref={selectTag} className={"tags-select-wrapper" + ((position===null) ? " hide":"") }>
      <select multiple={true} value={selects} onSelect={() => {console.log("onselect");}} onChange={handleSelect}>{listItems}</select>
      <button onClick={handleApply}>Apply</button>
    </div>
  );
}
