import React, {useEffect, useState, useReducer } from 'react';
import './App.css';
import Tags from './components/tags/Tags.js';
import Photos from './components/photos/Photos.js';
import TagSelect from './components/tags/TagSelect.js';
import TagsToPhotosReducer, {initialState} from './reducers/TagsToPhotosReducer.js';

function getPhotos() {
  return fetch(`https://picsum.photos/v2/list`).then(response => response.json());
}


function App() {

  const [state, dispatch] = useReducer(TagsToPhotosReducer, initialState);

  // const [photos, setPhotos] = useState([]);
  // const [tags, setTags] = useState([]);
  // const [tagsToPhotos, setTagsToPhotos] = useState([]);

  const [selectPosition, setSelectPosition] = useState(null);
  const [selectPhoto, setSelectPhoto] = useState(null);

  function handleDeleteTag(item) {
    dispatch('delete-tag', {item});
    // const index = tags.indexOf(item);
    // setTags([...tags.slice(0, index), ...tags.slice(index+1)]);
    //
    // let removettp = tagsToPhotos.filter(obj => obj.tag === item);
    // let newttp = tagsToPhotos.filter(obj => obj.tag !== item);
    // let untaggedPhotos = [];
    // for (const rttp of removettp) {
    //   if (!newttp.some(tp => tp.photo.id === rttp.photo.id)) {
    //     rttp.photo.tagged = false;
    //     untaggedPhotos.push(rttp.photo);
    //   }
    // }
    //
    // if (untaggedPhotos.length > 0) {
    //   let newPhotos = photos.map(photo => {
    //     let p = untaggedPhotos.find(p => p.id === photo.id);
    //     return (p) ?  p : photo;
    //   });
    //
    //   setPhotos(newPhotos);
    // }
    //
    // setTagsToPhotos(newttp);
  }

  function handleAddTag(item) {
    dispatch('add-tag', {item});
    // setTags([...tags,item]);
  }

  function handleAttachTags(tagIds){

    const photoId = selectPhoto.id;
    dispatch('attach-tag', {tagIds, photoId});
            // let index = photos.findIndex(p => p.id === photoId);
            // if (index > -1) {
            //   const photo = photos[index];
            //   photo.tagged = true;
            //   setPhotos([...photos.slice(0, index), photo, ...photos.slice(index + 1)]);
            //
            //   const ttp = tagIds.map(tagId => {
            //     const tag = tags.find(t => t.id === parseInt(tagId));
            //     return {photo, tag};
            //   });
            //
            //   setTagsToPhotos([...tagsToPhotos, ...ttp]);
            // }
    setSelectPosition(null);
    setSelectPhoto(null);
  }

  function handleTagging(e, item) {
    const {offsetTop, offsetLeft, offsetHeight, offsetWidth} = e.target;

    if (selectPosition == null) {
      setSelectPosition({ offsetTop, offsetLeft, offsetHeight, offsetWidth });
    } else {
      setSelectPosition(null);
    }
    setSelectPhoto(item);
  }

  useEffect(() => {
    try {
      const fetchPhotos = async () => {
          const data = await getPhotos();
          return data;

      };
      fetchPhotos().then(data=> dispatch('get-photos', {payload: data}));
    } catch (e) {
      console.log("Error fetch photos", e);
    }
  }, []);

  return (
    <div className="App">
      <TagSelect position={selectPosition} tags={state.tags} onApply={handleAttachTags} />
      <Tags tags={state.tags} onAdd={handleAddTag} onDelete={handleDeleteTag} />
      <Photos photos={state.photos} tagsToPhotos={state.tagsToPhotos} onTagging={handleTagging} />
    </div>
  );
}

export default App;
