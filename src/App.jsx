import React, { useEffect, useRef, useState } from "react";
import {Form} from 'react-bootstrap';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './index.css';
import axios from 'axios';

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGE_PER_PAGE = 20;
function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [page, setPage] = useState(1);
  const [errMsg, setErrMsg] = useState("");
  const [show, setShow] = useState(false)

  useEffect(()=>{
    fetchImages();
  }, [page])

  const fetchImages = async () => {
    try {
      if(searchInput.current.value){
        setErrMsg("");
        const {data} =await axios.get(`${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGE_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`)
        console.log('result', data);
        setImages(data.results)
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrMsg("Error fetching images, Try again later.");
      console.log("error:", error);
    }
    
  }

  const resetSearch = ()=>{
    fetchImages();
    setPage(1);
  }
  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  }

  const toggleShow = ()=>{
    setShow(!show);
  }
  return (
    <div className="container">
      <div className={show?"slider show-slider":"slider"}>
      <button className="btn" onClick={toggleShow}>x</button>
        <Slide className="slide">
          {images.map((fadeImage, index) => (
            <div key={index}>
              <img className="slide-img" src={fadeImage.urls.regular} />
            </div>
          ))}
        </Slide>
      </div>
      <h1 className="title">Image Search</h1>
      {errMsg && <p className="error-message">{errMsg}</p>}
      {totalPages === 0 && <p className="error-message">Image Not Found!</p>}
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control type='search' placeholder='Type something to search...' className="searchInput" ref={searchInput}/>
        </Form>
      </div>
      <div className="filters">
        <div onClick={()=>handleSelection("nature")}>Nature</div>
        <div onClick={()=>handleSelection("Birds")}>Birds</div>
        <div onClick={()=>handleSelection("Cats")}>Cats</div>
        <div onClick={()=>handleSelection("Shoes")}>Shoes</div>
      </div>
      <div className="images-field">
          {
            images.map((image)=>(
                <div className="image" key={image.id}>
                  <a href={image.urls.regular}>
                  <img 
                  src={image.urls.small} 
                  alt={image.alt_description}
                  loading="lazy"
                />
                  </a>
                </div>
            ))
          }
      </div>
      <div className="buttons">
        {page > 1 && <button onClick={()=>setPage(page-1)}>Previous</button>}
        {page < totalPages && <button onClick={()=>setPage(page+1)}>Next</button>}
        {totalPages > 0 && <button onClick={toggleShow}>Slide Show</button>}
      </div>
      
    </div>
  )
}

export default App
