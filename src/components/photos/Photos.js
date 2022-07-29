import React, {useState, useEffect} from 'react';
import './Photos.css';

function groupBy(array, callbackFn, callbackItem=(item)=>item) {

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

function PhotosList({items, onTagging, disabled}) {
  const listItems = items.slice(0,10).map((item) =>
    <li key={item.id} >
      <img src={item.download_url} alt={item.author} ></img>
      <button disabled={disabled} onClick={(e) => onTagging(e, item)}></button>
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
  return (<div key={"div" + key.id} className={"tag-group"}><div className={key.color+ " title"}>{key.name}</div><ul>{groupItems}</ul></div>);

}

function PhotosByTags({groups}) {

  let pbt = [];
  for (let [key, value] of groups) {
    pbt.push (PhotosByTag({value, key}));
  }
  return (<div>{pbt.map(pt => pt)}</div>);
}

export default function Photos({photos, tagsToPhotos, onTagging, disableTagging}) {

  const [tagged, setTagged] = useState([]);
  const [unTagged, setUnTagged] = useState([]);

  useEffect(() => {
    let groups = groupBy(photos, (photo) => photo.tagged.toString());
    setUnTagged( groups.get('false') || []);
  }, [photos]);

  useEffect(() => {
    let groupsByTags = groupBy(tagsToPhotos, (ttp) => ttp.tag, (item) => item.photo);
    setTagged(groupsByTags);
  }, [tagsToPhotos]);


  return (
    <div className={'photos'}>
      <section className="untagged">
        <label htmlFor="untaggedList">Not tagged</label>
        <PhotosList id={"untaggedList"} items={unTagged} onTagging={onTagging} disabled={disableTagging} />
      </section>
      <section className="tagged">
        <label htmlFor="taggedList">Tagged</label>
        <PhotosByTags id={"taggedList"} groups={tagged} />
      </section>
    </div>
  );
}