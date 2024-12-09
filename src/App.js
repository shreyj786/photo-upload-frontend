import './App.css';
import React, { useState } from 'react';

function App() {
  return (
    <div className="App">
      <p>Image Upload</p>
      <ImageUpload />
    </div>
  );
}

export default App;


const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false); // Loading state
  const [uploadResult, setUploadResult] = useState(null);  // Upload result state


  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setUploadResult(null); // Clear previous result
  };

  const handleUpload = async () => {
    if (!image) return; // Early return if no image selected

    setUploading(true); // Set loading state
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Throw error for bad status codes
      }
      const result = await response.json();
      setUploadResult({ success: true, url: result.url }); // Update state with successful result

    } catch (error) {
      setUploadResult({ success: false, error: error.message }); // Update state with error information
    } finally {
      setUploading(false); // Reset loading state in all cases (success or error)
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}  {/* Dynamic button text */}
      </button>

      {uploadResult && ( // Conditionally render result message
        <div>
          {uploadResult.success ? (
            <p>Upload Successful! Image URL: {uploadResult.url}</p>
          ) : (
            <p style={{ color: 'red' }}>Upload Failed: {uploadResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
};
