import React, {useEffect, useState, useReducer } from 'react';
import './App.css';
import Tags from './components/tags/Tags.js';
import Photos from './components/photos/Photos.js';
import TagSelect from './components/tags/TagSelect.js';
import TagsToPhotosReducer, {initialState} from './reducers/TagsToPhotosReducer.js';
import appLocalStorage from './services/LocalStorage.js';


const PICSUM_URL = `https://picsum.photos/v2/list`;

async function fetchPhotos (){
  try {
    const response = await fetch(PICSUM_URL);
    return response.json();
  }
  catch (e) {
    console.log("Error fetch photos", e);
  }
};

function App() {

  const [state, dispatch] = useReducer(TagsToPhotosReducer, initialState);
  const {tags, photos, tagsToPhotos} = state;

  const [selectPosition, setSelectPosition] = useState(null);
  const [selectPhoto, setSelectPhoto] = useState(null);
  const [disableTagging, setDisableTagging ] = useState(true);

  function handleDeleteTag(item) {
    dispatch({type:'delete-tag', item});
  }

  function handleAddTag(item) {
    dispatch({type: 'add-tag', item});
  }

  function handleAttachTags(tagIds = []){

    if (tagIds.length > 0) {
      const photoId = selectPhoto.id;
      dispatch({type: 'attach-tags', tagIds, photoId});
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
    setDisableTagging(state.tags.length === 0);
  }, [state.tags]);

  useEffect(() => {

    fetchPhotos().then(photos => {
      dispatch({type:'set-photos', payload: photos});
      console.log("Photos loaded!");
    });
  }, []);

  return (
    <div className="App">
      <TagSelect position={selectPosition} tags={tags} onApply={handleAttachTags} />
      <Tags tags={tags} onAdd={handleAddTag} onDelete={handleDeleteTag} />
      <Photos dispatch={dispatch} photos={photos} tagsToPhotos={tagsToPhotos} disableTagging={disableTagging} onTagging={handleTagging} />
    </div>
  );
}

export default App;
