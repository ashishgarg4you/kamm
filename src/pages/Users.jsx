import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [tokenCode, setTokenCode] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // 🔹 Track user being deleted
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

  // 🔹 Add new user
  const addUser = async () => {
    if (!name.trim() || !tokenCode.trim()) {
      toast.warning("Please enter name and token code");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await API.post(
        "/users",
        { name, tokenCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newUser = data.user || data;
      setUsers((prev) => [...prev, newUser]);
      toast.success("User added successfully!");
      setName("");
      setTokenCode("");
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user");
    }
  };

  // 🔹 Direct delete by ID (with spinner)
  const deleteUserById = async (id) => {
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      await API.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  // 🔹 Open modal before deleting
  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // 🔹 Delete confirmed user (modal)
  const deleteUser = async () => {
    if (!selectedUser) return;
    await deleteUserById(selectedUser._id);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Team Members</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Add User
        </Button>
      </div>

      {/* 🔹 Users Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Token Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.tokenCode}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deletingId === u._id}
                    onClick={() => confirmDelete(u)}
                  >
                    {deletingId === u._id ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-1"
                        />
                        Deleting...
                      </>
                    ) : (
                      "Remove"
                    )}
                  </Button>

                  {/* Optional: Quick Delete (no modal) */}
                  {/* <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={deletingId === u._id}
                    onClick={() => deleteUserById(u._id)}
                    className="ms-2"
                  >
                    {deletingId === u._id ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-1" />
                        Deleting...
                      </>
                    ) : (
                      "Quick Delete"
                    )}
                  </Button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No team members yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Token Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter token code (e.g. EMP1234)"
                value={tokenCode}
                onChange={(e) => setTokenCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🔹 Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <p>
              Are you sure you want to remove{" "}
              <strong>{selectedUser.name}</strong> (
              <code>{selectedUser.tokenCode}</code>)?
            </p>
          ) : (
            <p>Are you sure you want to remove this user?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deletingId === selectedUser?._id}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={deleteUser}
            disabled={deletingId === selectedUser?._id}
          >
            {deletingId === selectedUser?._id ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
