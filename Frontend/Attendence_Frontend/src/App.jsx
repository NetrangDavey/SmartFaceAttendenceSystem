import React, { useRef, useEffect, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [username, setUsername] = useState("");
  const [regNo, setRegNo] = useState("");

  //Camera Operations
  const getVideo = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("getUserMedia is not supported in this browser.");
      return;
    }
    navigator.mediaDevices.getUserMedia({
      video: {
        // facingMode: { ideal: "environment" }, // Try to use back camera
        width: 1920,
        height: 1080
      }
    })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error(err);
        alert("Back camera not available. Trying front camera.");
      });
  };

  const capturePic = () => {
    const w = 514;
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

  // Marking Attendence
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
        console.log(data);
        alert(`Success:${data.message}\nRegistration Number:${data['Registration Numbers']}\nStudents:${data.Students}\nTotal Stds:${data['total stds']}`)
        // Handle success (e.g., show a message or redirect)
      })
      .catch((error) => {
        console.error('Error:', error);
        console.log(imageData);
      });
  };

  //Student Registration
  const handleRegis = () => {
    if (!imageData || !username) return; // Ensure both image and username are present

    // Send the image data and username to the backend
    fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData, username: username, reg: regNo }),
    })
      .then(response => response.json())
      .then(data => {
        alert('Success:' + data.message + "\nname: " + data.Students_name);
        console.log(data);
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
      <div className='App bg-secondary d-flex align-items-center justify-content-evenly flex-wrap'  >
        <div className='camera_container d-flex flex-column align-items-center p-1  '>
          <video ref={videoRef} className='w-100'></video>
          <button className=" mt-3 btn btn-danger" onClick={capturePic}>Capture</button>
        </div>
        <div className={"p-3 flex-column photo_container" + (hasPhoto ? ' hasPhoto' : '')} >
          <canvas className="image-res" ref={photoRef}></canvas>
          {hasPhoto && (
            <>
              <div className="my-2 d-flex align-items-center justify-content-evenly">
                <button className='btn btn-danger' onClick={retake}>Retake</button>
                <button className='btn btn-success' onClick={acceptImage}>Accept</button>
              </div>

              <div className="px-3 w-100 d-flex flex-column align-items-center justify-content-evenly">
                <input
                  className="form-control my-1"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Update username state
                  placeholder="Enter your name"
                />
                <input
                  className="form-control my-1"
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)} // Update username state
                  placeholder="Enter your registration number"
                />
                <button className="btn btn-success my-1" onClick={handleRegis}>Register Student</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
