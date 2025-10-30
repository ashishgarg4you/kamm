import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [tokenCode, setTokenCode] = useState("");
  const navigate = useNavigate();

  // 🔹 Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const { data } = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to fetch users");
      }
    }
  };

  const addUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await API.post(
      "/users",
      { name, tokenCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const newUser = data.user || data; // ✅ Safe for all backend responses
    setUsers((prev) => [...prev, newUser]);

    toast.success("User added successfully!");
    setName("");
    setTokenCode("");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to add user");
  }
};


  // // 🔹 Add a new user
  // const addUser = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const { data } = await API.post(
  //       "/users",
  //       { name, tokenCode },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setUsers((prev) => [...prev, data]); // ✅ Update instantly
  //     toast.success("User added successfully!");
  //     setName("");
  //     setTokenCode("");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Failed to add user");
  //   }
  // };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Team Members</h2>

      <div className="mb-3">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control mb-2"
        />
        <input
          placeholder="Token Code"
          value={tokenCode}
          onChange={(e) => setTokenCode(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={addUser}>
          Add User
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Token Code</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.tokenCode}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-muted">
                No team members yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
