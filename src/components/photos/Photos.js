import React, {useState, useEffect} from 'react';
import './Photos.css';

function groupBy(array, callbackFn, callbackItem=(item)=>item) {
  // groups: map{tag1:[], tag2:[], ..., tagN:[]}
  let groups = new Map();
  for (const item of array) {
    let groupKey = callbackFn(item);
    if (groups.has(groupKey)) {
      groups.set(groupKey, [...groups.get(groupKey), callbackItem(item)]);
    } else {
      groups.set(groupKey, [callbackItem(item)]);
    }
  }
  return groups;
}

function PhotosList({items, onTagging}) {
  const listItems = items.slice(0,10).map((item) =>
    <li key={item.id} >
      <img src={item.download_url} alt={item.author} ></img>
      <button onClick={(e) => onTagging(e, item)}>A</button>
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

function PhotosByTag({value, key}) {
  let groupItems = value.map(item =>
    <li key={item.id} >
      <img src={item.download_url} alt={item.author} ></img>
    </li>
  );
  return (<div key={"div" + key.id}><div className={key.color}>{key.name}</div><ul>{groupItems}</ul></div>); //key={"ul" + key}
}

function PhotosByTags({groups}) {

  let pbt = [];
  for (let [key, value] of groups) {
    // console.log(key, group);
    pbt.push (PhotosByTag({value, key}));
  }
  return (<div>{pbt.map(pt => pt)}</div>);
}

export default function Photos({photos, tagsToPhotos, onTagging}) {

  const [tagged, setTagged] = useState([]);
  const [unTagged, setUnTagged] = useState([]);

  useEffect(() => {
    let groups = groupBy(photos, (photo) => photo.tagged.toString());
    setUnTagged( groups.get('false') || []);
    // setTagged( groups.get('true') || []);
    console.log("photos useeffect", groups.get('false'));
  }, [photos]);

  useEffect(() => {
    let groupsByTags = groupBy(tagsToPhotos, (ttp) => ttp.tag, (item) => item.photo);
    // console.log("groups by tag", groupsByTags, "tagstophotos" ,tagsToPhotos);
    setTagged(groupsByTags);
  }, [tagsToPhotos]);


  return (
    <div className={'photos'}>
      <section className="untagged">
        <label htmlFor="untaggedList">Not tagged</label>
        <PhotosList id={"untaggedList"} items={unTagged} onTagging={onTagging} />
      </section>
      <section className="tagged">
        <label htmlFor="taggedList">Tagged</label>
        <PhotosByTags id={"taggedList"} groups={tagged} />
      </section>
    </div>
  );
}