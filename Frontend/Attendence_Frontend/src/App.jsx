import React, { useRef, useEffect, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [imageData, setImageData] = useState(null); 
  const [username, setUsername] = useState("");
  const [regNo, setRegNo] = useState("");

  const getVideo = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      return; 
    }
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
    fetch(' http://127.0.0.1:8000/api/mark_attendence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }), // Send the image as JSON
    })
    .then(response => response.json())
    .then(data => {
      alert(`Success:${data.message}\nRegistration Number:${data['Registration Numbers']}\nStudents:${data.Students}\nTotal Stds:${data['total stds']}`)
      // Handle success (e.g., show a message or redirect)
    })
    .catch((error) => {
      console.error('Error:', error);
      console.log(imageData);
    });
  };
  const handleRegis = () => {
    if (!imageData || !username) return; // Ensure both image and username are present

    // Send the image data and username to the backend
    fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData, username: username ,reg:regNo}), // Send image and username as JSON
    })
    .then(response => response.json())
    .then(data => {
      alert('Success:'+data.message+"\nname: "+data.Students_name);
      console.log(data);
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
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} // Update username state
                placeholder="Enter your name"
              />
              <input 
                type="text" 
                value={regNo} 
                onChange={(e) => setRegNo(e.target.value)} // Update username state
                placeholder="Enter your registration number"
              />
              <button onClick={handleRegis}>Register</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
