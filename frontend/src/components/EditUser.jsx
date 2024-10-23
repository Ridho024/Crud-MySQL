import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getUserByID();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("file", file);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("gender", gender);

    try {
      await axios.patch(`http://localhost:5000/user/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const getUserByID = async () => {
    const response = await axios.get(`http://localhost:5000/user/data/${id}`);
    setName(response.data.name);
    setEmail(response.data.email);
    setGender(response.data.gender);
    setFile(response.data.file);
    setPreview(response.data.url);
  };

  const loadImage = async (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={updateUser}>

          <div className="field">
            <label className="label">Image</label>
            <div className="control">
              <div className="file">
                <label className="file-lable">
                  <input type="file" className="file-input" onChange={loadImage} />
                  <span className="file-cta">
                    <span className="file-lable">Choose a file...</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {preview ? (
            <figure className="image is-64x64">
              <img src={preview} alt="Preview Image" />
            </figure>
          ) : (
            ""
          )}

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
              Update
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EditUser;
