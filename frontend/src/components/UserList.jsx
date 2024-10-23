import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  // Pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getUsers();
  }, [page, keyword]);

  // Ini belom selesai
  const getUsers = async () => {
    const response = await axios.get(`http://localhost:5000/users?search_query=${keyword}&page=${page}&limit=${limit}`);
    setUsers(response.data);
    // pagination
    setUsers(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      getUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <div>
          <Link to={"user/add"} className="button is-success">
            Add New
          </Link>
        </div>

        <tabel className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="card-image">
                    <figure className="image is-64x64">
                      <img src={user.url} alt="Image" />
                    </figure>
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>
                  <Link to={`user/edit/${user.id}`} className="button is-small is-info">
                    Edit
                  </Link>
                  <span> | </span>
                  <button onClick={() => deleteUser(user.id)} className="button is-small is-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </tabel>
      </div>
    </div>
  );
};

export default UserList;
