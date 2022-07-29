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
  const {tags, photos, tagsToPhotos} = state;

  const [selectPosition, setSelectPosition] = useState(null);
  const [selectPhoto, setSelectPhoto] = useState(null);

  function handleDeleteTag(item) {
    dispatch({type:'delete-tag', item});
  }

  function handleAddTag(item) {
    dispatch({type: 'add-tag', item});
  }

  function handleAttachTags(tagIds = []){

    if (tagIds.length > 0) {
      const photoId = selectPhoto.id;
      dispatch({type: 'attach-tag', tagIds, photoId});
    }
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
      fetchPhotos().then(data=> dispatch({type:'set-photos', payload: data}));
    } catch (e) {
      console.log("Error fetch photos", e);
    }
  }, []);

  return (
    <div className="App">
      <TagSelect position={selectPosition} tags={tags} onApply={handleAttachTags} />
      <Tags tags={tags} onAdd={handleAddTag} onDelete={handleDeleteTag} />
      <Photos photos={photos} tagsToPhotos={tagsToPhotos} onTagging={handleTagging} />
    </div>
  );
}

export default App;
