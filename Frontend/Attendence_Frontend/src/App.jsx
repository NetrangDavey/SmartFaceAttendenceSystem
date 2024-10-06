import React, { useRef, useEffect, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [imageData, setImageData] = useState(null); // New state for image data

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({
      video: { width: 1920, height: 1080 }
    })
    .then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.error(err);
    });
  };

  const capturePic = () => {
    const w = 414;
    const h = w / (16 / 9);

    let vid = videoRef.current;
    let photo = photoRef.current;

    photo.width = w;
    photo.height = h;

    let ctx = photo.getContext('2d');
    ctx.drawImage(vid, 0, 0, w, h);

    setImageData(photo.toDataURL('image/png')); // Store the image data URL
    setHasPhoto(true);
  };

  const retake = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
    setImageData(null); // Clear the image data
  };

  const acceptImage = () => {
    if (!imageData) return;

    // Send the image data to the backend
    fetch('http://your-backend-url/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }), // Send the image as JSON
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Handle success (e.g., show a message or redirect)
    })
    .catch((error) => {
      console.error('Error:', error);
      console.log(imageData);
    });
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    <>
      <div className='App'>
        <div className='camera'>
          <video ref={videoRef}></video>
          <button onClick={capturePic}>Capture</button>
        </div>
        <div className={'result' + (hasPhoto ? ' hasPhoto' : '')}>
          <canvas ref={photoRef}></canvas>
          {hasPhoto && (
            <>
              <button onClick={retake}>Retake</button>
              <button onClick={acceptImage}>Accept</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
