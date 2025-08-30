import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import BottomBar from '../components/Bottombar';
import Navbar from '../components/Navbar';
import app from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useAddPostsMutation } from '../redux/posts/postApi';
import { useNavigate } from 'react-router-dom';
import * as nsfwjs from 'nsfwjs';

let cachedModel = null; // Global variable to store the loaded model

const AddPost = () => {
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nsfwAlert, setNsfwAlert] = useState(null); // NSFW alert and result
  const [modelStatus, setModelStatus] = useState('loading'); // it may loading, loaded, analyzing
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [addPost, { isLoading, error }] = useAddPostsMutation();

  useEffect(() => {
    inputRef.current.focus();
    if (!cachedModel) {
      loadModel();
    } else {
      setModelStatus('loaded');
    }
  }, []);

  const loadModel = async () => {
    setModelStatus('loading');
    try {
      const nsfwModel = await nsfwjs.load('/models/model.json', { size: 299 });
      cachedModel = nsfwModel; // Store the model in global variable
      setModelStatus('loaded');
      console.log('NSFW Model loaded successfully');
    } catch (err) {
      console.error('Failed to load NSFW Model:', err);
      setModelStatus('error');
    }
  };

  const checkImageForNSFW = async (imgFile) => {
    if (!cachedModel) {
      console.warn('NSFW Model not loaded yet');
      return false;
    }

    try {
      const imgElement = document.createElement('img');
      imgElement.src = URL.createObjectURL(imgFile);

      return new Promise((resolve) => {
        imgElement.onload = async () => {
          setModelStatus('analyzing');
          const predictions = await cachedModel.classify(imgElement);
          console.log('Predictions:', predictions);

          // Process predictions
          let pornProbability = 0;
          let hentaiProbability = 0;
          let sexyProbability = 0;

          predictions.forEach(pred => {
            if (pred.className === 'Porn') pornProbability = pred.probability;
            if (pred.className === 'Hentai') hentaiProbability = pred.probability;
            if (pred.className === 'Sexy') sexyProbability = pred.probability;
          });

          const isNSFW = (
            pornProbability > 0.05 || 
            hentaiProbability > 0.10 || 
            sexyProbability > 0.15
          );

          setModelStatus('loaded');
          resolve({ isNSFW, predictions });
        };
      });
    } catch (error) {
      console.error('Error during NSFW classification:', error);
      setModelStatus('loaded');
      return { isNSFW: false, predictions: [] };
    }
  };

  const handleImageUpload = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setNsfwAlert(null); // Clear previous NSFW alert
      const { isNSFW, predictions } = await checkImageForNSFW(selectedImage);

      if (isNSFW) {
        setNsfwAlert({ isNSFW: true, predictions });
        setImage(null); // Clear image if inappropriate
      } else {
        setNsfwAlert({ isNSFW: false, predictions });
        setImage(selectedImage); // Accept the image if it's safe
      }
    }
  };

  const handlePost = async () => {
    setLoading(true);
    setNsfwAlert(null); // Clear NSFW alert

    let imageUrl = null;

    if (image) {
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, "images/" + image.name);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
        console.log('Image uploaded to:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    try {
      await addPost({ text: postContent, postImage: imageUrl }).unwrap();
      setPostContent('');
      setImage(null);
      navigate("/home");
    } catch (err) {
      console.error('Error posting content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelImage = () => {
    setNsfwAlert(null);
    setImage(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#EFEFF4] pb-[120px] font-inter">
      <Navbar />
      <h1 className="text-2xl md:text-4xl font-bold my-4">Add a Post</h1>
      <textarea
        className="w-full md:w-1/2 p-2 h-20 rounded-xl mb-4 border focus:outline-none"
        placeholder="Type something..."
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        ref={inputRef}
      ></textarea>

      <div className="w-full md:w-1/2 mb-4">
        <p>{` Image Upload(Optional)`}</p>
        <label className="flex items-center justify-start p-4 cursor-pointer hover:bg-gray-200 border-2 border-gray-300 rounded-xl">
          <FontAwesomeIcon icon={faUpload} className="text-gray-600 mr-2" />
          <span className="text-gray-600">Upload a meme</span>
          <input
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {modelStatus === 'loading' && <p className='text-center'>Please wait: Loading Image Recognition Model...</p>}
        {modelStatus === 'analyzing' && <p className='text-center'>Analyzing Image...</p>}
        {modelStatus === 'loaded' && <p className='text-green-500 text-center'>Image Recognition Model Loaded</p>}
        {modelStatus === 'loaded' && image && (
          <div className="mt-2 flex flex-col items-center">
            <p className="text-center text-gray-600">
              Selected file: {image.name}
            </p>
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="mt-2 max-w-full max-h-36 rounded"
            />
            <button
              className="mt-2 p-2 bg-gray-500 text-white hover:bg-red-600 rounded"
              onClick={handleCancelImage}
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </button>
          </div>
        )}

        {nsfwAlert && nsfwAlert.isNSFW && (
          <div className="text-red-500 text-center mb-4">
            Inappropriate content detected. Please upload a different image.
          </div>
        )}
        {nsfwAlert && !nsfwAlert.isNSFW && (
          <div className="text-green-500 text-center mb-2">
            Image is approved by model for posting.
          </div>
        )}

        {nsfwAlert && (
          <div className="text-gray-600 text-center">
            <h3 className="font-bold">Prediction Details:</h3>
            {nsfwAlert.predictions.map((prediction, index) => (
              <p key={index}>
                {prediction.className}: {(prediction.probability * 100).toFixed(2)}%
              </p>
            ))}
          </div>
        )}
      </div>

      <button
        className={`p-4 w-full md:w-1/2 ${isLoading ? 'bg-[#c9cfff]' : 'bg-[#6a7cff]'} text-white rounded-xl`}
        onClick={handlePost}
        disabled={isLoading || loading}
      >
        {loading || isLoading ? 'Posting...' : 'Post'}
      </button>

      <BottomBar />
    </div>
  );
};

export default AddPost;
