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
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  // 🔹 Delete user
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

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-indigo-100 p-5 sm:p-8 transition-all duration-300 hover:shadow-xl animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-indigo-100 pb-3">
          <h2 className="text-2xl font-bold text-indigo-700 tracking-tight text-center sm:text-left">
            Team Members
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 hover:scale-[1.03] shadow-md transition-all duration-300"
          >
            + Add User
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-full bg-indigo-100 rounded shimmer"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-indigo-100">
            <table className="min-w-full text-sm md:text-[15px] text-gray-700 border-collapse">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Token Code</th>
                  <th className="py-3 px-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50 bg-white">
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-indigo-50/70 transition-all duration-200"
                    >
                      <td className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">
                        {u.name}
                      </td>
                      <td className="py-3 px-4 text-indigo-600 font-semibold whitespace-nowrap">
                        {u.tokenCode}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => confirmDelete(u)}
                          disabled={deletingId === u._id}
                          className={`px-4 py-1.5 rounded-lg font-medium text-white shadow-md transition-all duration-300 ${
                            deletingId === u._id
                              ? "bg-red-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-[1.03]"
                          }`}
                        >
                          {deletingId === u._id ? "Deleting..." : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-8 text-gray-500 font-medium"
                    >
                      No team members yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-indigo-700">Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="font-medium text-gray-700">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="font-medium text-gray-700">Token Code</Form.Label>
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-red-600">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <p className="text-gray-700">
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
                <Spinner animation="border" size="sm" className="me-1" /> Deleting...
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
