export const initialState = {
  tagsToPhotos: [],
  tags: [],
  photos: []
};

export default function TagsToPhotosReducer(state, action) {

  const {tags, tagsToPhotos, photos} = state;
  const {photoId, tagIds, tagId} = action;
  let newState = state;

  switch (action.type) {
    case 'set-photos':
        const {payload} = action;
        return { ...state, photos: payload.map(d => Object.assign({}, d, {tagged: false}))};

    case 'add-tag':
      return { ...state, tags: [...tags, action.item]};

    case 'delete-tag':
      const {item} = action;

      const i = tags.indexOf(item);
      newState = {...newState, tags: ([...tags.slice(0, i), ...tags.slice(i+1)])};

      let discardTtp = tagsToPhotos.filter(obj => obj.tag === item);
      let keepTtp = tagsToPhotos.filter(obj => obj.tag !== item);
      let untaggedPhotos = [];
      for (const ttp of discardTtp) {
        if (!keepTtp.some(tp => tp.photo.id === ttp.photo.id)) {
          ttp.photo.tagged = false;
          untaggedPhotos.push(ttp.photo);
        }
      }

      if (untaggedPhotos.length > 0) {
        let newPhotos = photos.map(photo => {
          let p = untaggedPhotos.find(p => p.id === photo.id);
          return (p) ?  p : photo;
        });

        newState = {...newState, photos: newPhotos};
      }

      newState = {...newState, tagsToPhotos: keepTtp};
      return newState;

    case 'attach-tags':

      let index = photos.findIndex(p => p.id === photoId);
      if (index > -1) {
        const photo = photos[index];
        photo.tagged = true;

        const ttp = tagIds.map(tagId => {
          const tag = tags.find(t => t.id === parseInt(tagId));
          return {photo, tag};
        });

        return {
          ...state,
          tagsToPhotos: ([...tagsToPhotos, ...ttp]) ,
          photos: ([...photos.slice(0, index), photo, ...photos.slice(index + 1)])
        };
      }
      return state;

    case 'un-tag-photo':

      const indie = tagsToPhotos.findIndex(ttp => ttp.photo.id===photoId && tagId === ttp.tag.id);
      newState = state;
      if (indie > -1) {
        let keepTtp = [...tagsToPhotos.slice(0,indie), ...tagsToPhotos.slice(indie+1)];
        if (!keepTtp.some(tp => tp.photo.id === photoId)) {
          let index = photos.findIndex(p => p.id === photoId);
          if (index > -1) {
            const photo = photos[index];
            photo.tagged = false;

            newState = {
              ...newState,
              photos: ([...photos.slice(0, index), photo, ...photos.slice(index + 1)])
            };
          }
        }
        return {...newState, tagsToPhotos: keepTtp};
      }

      return state;

    default:
      throw new Error();
  }
}
