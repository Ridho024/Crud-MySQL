import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const saveUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("gender", gender);

    try {
      await axios.post("http://localhost:5000/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={saveUser}>
          <div className="field">
            <label className="label">Image</label>
            <div className="control">
              <div className="file">
                <label className="file-lable">
                  <input type="file" className="file-input" onChange={loadImage} />
                  <span className="file-cta">
                    <span className="file-lable">Choose a file...</span>
                  </span>
                  <span>
                    {preview ? (
                      <figure className="image is-64x64 mt-3 mb-3">
                        <img src={preview} alt="Preview Image" />
                      </figure>
                    ) : (
                      ""
                    )}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input type="text" className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label className="label">Gender</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <button type="submit" className="button is-success">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
