import React from 'react';
import { ClipLoader } from 'react-spinners';
import './index.css';

const Loader = () => (
  <div className="loader-wrapper">
    <ClipLoader color="#0077cc" size={50} />
    <p>Loading...</p>
  </div>
);

export default Loader;
