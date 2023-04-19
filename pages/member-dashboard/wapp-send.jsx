import { useState } from "react";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

const Form = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mobileNumbers, setMobileNumbers] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // note that getMonth() returns 0 for January, 1 for February, etc.
    let day = currentDate.getDate();
    const storage = getStorage();
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        const imageUrl = await getDownloadURL(storageRef);
        const form = {
          title,
          description,
          url,
          mobileNumbers,
          RegisteredDate: day + "/" + month + "/" + year,
          imageUrl,
          Messages: 0,
          CampaignStatus: "pending",
        };
        // You can save the form data to Firestore or Realtime Database
        try {
          const docRef = await addDoc(collection(db, "wapps"), form);
          console.log("Form data saved successfully with ID: ", docRef.id);
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-5 mt-24 mb-10">
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 font-bold text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="mobile-numbers"
          className="block mb-2 font-bold text-gray-700"
        >
          Mobile Numbers
        </label>
        <textarea
          id="mobile-numbers"
          value={mobileNumbers}
          onChange={(e) => setMobileNumbers(e.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          required
          placeholder="Enter Mobile Numbers like
          8872960014 
          7973994038
          9888610086"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="url" className="block mb-2 font-bold text-gray-700">
          URL
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block mb-2 font-bold text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block mb-2 font-bold text-gray-700">
          Image
        </label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus :shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <progress value={progress} max="100" className="w-full"></progress>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
export default Form;
