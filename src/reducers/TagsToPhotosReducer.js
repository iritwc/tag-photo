export const initialState = {
  tagsToPhotos: [],
  tag: [],
  photos: []
};

export default function TagsToPhotosReducer(state, action) {
  const {tags, tagsToPhotos, photos} = state;
  switch (action.type) {
    case 'get-photos':
        const {payload} = action;
        return payload.map(d => Object.assign({}, d, {tagged: false}));
    case 'add-tag':
      return { tags: [...tags,action.item]};

    case 'delete-tag':
      const {item} = action;
      let newState = {};

      const i = tags.indexOf(item);
      newState = {tags: ([...tags.slice(0, i), ...tags.slice(i+1)])};

      let unTagTtp = tagsToPhotos.filter(obj => obj.tag === item);
      let keepTagTtp = tagsToPhotos.filter(obj => obj.tag !== item);
      let untaggedPhotos = [];
      for (const ttp of unTagTtp) {
        if (!keepTagTtp.some(tp => tp.photo.id === ttp.photo.id)) {
          ttp.photo.tagged = false;
          untaggedPhotos.push(ttp.photo);
        }
      }

      if (untaggedPhotos.length > 0) {
        let newPhotos = photos.map(photo => {
          let p = untaggedPhotos.find(p => p.id === photo.id);
          return (p) ?  p : photo;
        });

        newState = {...newState, ...{photos: newPhotos}};
      }

      newState = {...newState, ...{tagsToPhotos: keepTagTtp}};
      return newState;

    case 'attach-tag':
      const {tagIds, photoId} = action;

      let index = photos.findIndex(p => p.id === photoId);
      if (index > -1) {
        const photo = photos[index];
        photo.tagged = true;

        const ttp = tagIds.map(tagId => {
          const tag = tags.find(t => t.id === parseInt(tagId));
          return {photo, tag};
        });

        return {
          tagsToPhotos: ([...tagsToPhotos, ...ttp]) ,
          photos: ([...photos.slice(0, index), photo, ...photos.slice(index + 1)])
        };
      }
      return state;

    default:
      throw new Error();
  }
}
