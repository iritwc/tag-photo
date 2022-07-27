import React, {useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import Tags from './components/tags/Tags.js';
import Photos from './components/photos/Photos.js';
import TagSelect from './components/tags/TagSelect.js';

function getPhotos() {
  return fetch(`https://picsum.photos/v2/list`).then(response => response.json());
}


function App() {

  const [photos, setPhotos] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsToPhotos, setTagsToPhotos] = useState([]);
  const [selectPosition, setSelectPosition] = useState(null);
  const [selectPhoto, setSelectPhoto] = useState(null);

  function handleDeleteTag(item) {
    const index = tags.indexOf(item);
    setTags([...tags.slice(0, index), ...tags.slice(index+1)]);

    let removettp = tagsToPhotos.filter(obj => obj.tag === item);
    let newttp = tagsToPhotos.filter(obj => obj.tag !== item);
    let untaggedPhotos = [];
    for (const rttp of removettp) {
      if (!newttp.some(tp => tp.photo.id === rttp.photo.id)) {
        rttp.photo.tagged = false;
        untaggedPhotos.push(rttp.photo);
      }
    }

    console.log("untagged photos", untaggedPhotos);

    if (untaggedPhotos.length > 0) {
      let newPhotos = photos.map(photo => {
        let p = untaggedPhotos.find(p => p.id === photo.id);
        console.log("p=", p);
        if (p) return p;
        else return photo;
      });

      console.log(untaggedPhotos, newPhotos);
      setPhotos(newPhotos);
    }


    setTagsToPhotos(newttp);
  }

  function handleAddTag(item) {
    setTags([...tags,item]);
  }

  function handleAttachTags(items){
    // console.log("Attaching tags ",  items, selectPhoto);

    const photoId = selectPhoto.id;
    let index = photos.findIndex(p => p.id === photoId);
    if (index > -1) {
      const photo = photos[index];
      photo.tagged = true;
      setPhotos([...photos.slice(0, index), photo, ...photos.slice(index + 1)]);

      let ttp = items.map(tagId => {
        let tag = tags.find(t => t.id === parseInt(tagId));
        // console.log(tag, tagId,tags);
        return {photo, tag};
      });
      // console.log(tagsToPhotos, ttp);

      setTagsToPhotos([...tagsToPhotos, ...ttp]);
    }
    setSelectPosition(null);
    setSelectPhoto(null);
  }

  function handleTagging(e, item) {
    let {offsetTop, offsetLeft, offsetHeight, offsetWidth} = e.target;

    if (selectPosition == null) {
      setSelectPosition({ offsetTop, offsetLeft, offsetHeight, offsetWidth });
    } else {
      setSelectPosition(null);
    }
    setSelectPhoto(item);
    // setToggleTagSelect(!toggleTagSelect);
  }

  useEffect(() => {
    try {
      const fetchPhotos = async () => {
          const data = await getPhotos();
          return data;

      };
      fetchPhotos().then(data=> {setPhotos(data.map(d => Object.assign({}, d, {tagged: false})))});
    } catch (e) {
      console.log("Error fetch photos", e);
    }
  }, []);

  return (
    <div className="App">
      <TagSelect position={selectPosition} tags={tags} onApply={handleAttachTags} />
      <Tags tags={tags} onAdd={handleAddTag} onDelete={handleDeleteTag} />
      <Photos photos={photos} tagsToPhotos={tagsToPhotos} onTagging={handleTagging} />


      {/*<header className="App-header">*/}
        {/**/}
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        {/*<p>*/}
          {/*Edit <code>src/App.js</code> and save to reload.*/}
        {/*</p>*/}
        {/*<a*/}
          {/*className="App-link"*/}
          {/*href="https://reactjs.org"*/}
          {/*target="_blank"*/}
          {/*rel="noopener noreferrer"*/}
        {/*>*/}
          {/*Learn React*/}
        {/*</a>*/}
      {/*</header>*/}
    </div>
  );
}

export default App;
