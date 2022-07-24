import React, {useState, useEffect} from 'react';
import './Photos.css';

function groupBy(array, callbackFn) {
  // groups: map{tag1:[], tag2:[], ..., tagN:[]}
  let groups = new Map();
  for (const item of array) {
    let group = callbackFn(item);
    if (groups.has(group)) {
      groups.set(group, [...groups.get(group), item]);
    } else {
      groups.set(group, [item]);
    }
  }
  return groups;
}

function PhotosList({items}) {
  const listItems = items.slice(0,10).map((item) =>
    <li key={item.id} >
      <img src={item.download_url} alt={item.author} ></img>
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

export default function Photos({photos}) {

  const [tagged, setTagged] = useState([]);
  const [unTagged, setUnTagged] = useState([]);

  useEffect(() => {
    let groups = groupBy(photos, (photo) => photo.tagged.toString());
    setUnTagged( groups.get('false') || []);
    setTagged( groups.get('true') || []);
  }, [photos]);


  return (
    <div className={'photos'}>
      <section className="untagged">
        <h3>Unassigned</h3>
        <PhotosList items={unTagged} />
      </section>
      <section className="tagged">
        <h3>Assigned</h3>
        <PhotosList items={tagged} />
      </section>
    </div>
  );
}