import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

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

  const changePage = async ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg("Jika tidak menemukan data yang anda cari, silahkan cari data dengan kata kunci spesifik");
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
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
        <form onSubmit={searchData} className="mb-5">
          <div className="field has-addons">
            <div className="control is-expanded">
              <input type="text" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find something here..." />
            </div>
            <div className="control">
              <button type="submit" className="button is-success">
                search
              </button>
            </div>
          </div>
        </form>

        <div className="mb-5">
          <Link to={"user/add"} className="button is-success">
            Add New
          </Link>
        </div>

        <tabel className="table is-striped is-bordered is-fullwidth mb-5">
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
                    <img src={user.url} alt="Image" className="image is-64x64" />
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

        <p className="mt-5 has-text-centered mb-3">
          Total Rows: {rows} || Page: {rows ? page + 1 : 0} of {pages}
        </p>

        <p className="has-text-centered has-text-danger mb-3">{msg}</p>

        <nav key={rows} className="pagination is-centered" role="navigation" aria-label="pagination">
          <ReactPaginate
            previousLabel={"< Prev"}
            nextLabel={"Next >"}
            pageCount={Math.min(10, pages)} // Dibuat begini karene tidak mungkin user mencari satu persatu sampai page yang banyak
            onPageChange={changePage}
            containerClassName={"pagination-list"}
            pageLinkClassName={"pagination-link"}
            previousLinkName={"pagination-previous"}
            nextLinkClassName={"pagination-next"}
            activeLinkClassName={"pagination-link is-current"}
            disabledLinkClassName={"pagination-link is-disabled"}
          />
        </nav>

      </div>
    </div>
  );
};

export default UserList;
