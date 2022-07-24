import React, {useEffect, useState} from 'react';
// import logo from './logo.svg';
import './App.css';
import Tags from './components/tags/Tags.js';
import Photos from './components/photos/Photos.js';


function getPhotos() {
  return fetch(`https://picsum.photos/v2/list`).then(response => response.json());
}


function App() {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    try {
      const fetchPhotos = async () => {
          const data = await getPhotos();
          // console.log(data);
          return data;

      };
      fetchPhotos()
        .then(data=> {setPhotos(data.map(d => Object.assign({}, d, {tagged: false})))});
    } catch (e) {
      console.log("Error fetch photos", e);
    }
  }, []);

  return (
    <div className="App">
      <Tags />
      <Photos photos={photos} />
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
