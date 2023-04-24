import React from "react";

function ImageDownloadButton({ imageUrl, fileName }) {
  const handleDownload = async () => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open("GET", imageUrl);
      xhr.send();
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleDownload}>Download Image</button>;
}

export default ImageDownloadButton;
