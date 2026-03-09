import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_URL || "";
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [editModalUser, setEditModalUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", password: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCompactMenu, setIsCompactMenu] = useState(window.innerWidth <= 1024);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const settingsRef = useRef(null);

  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch {
    user = null;
  }

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.name && String(u.name).toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        navigate("/", { replace: true });
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to load users");
        setUsers([]);
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setError("Unable to load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth <= 1024;
      setIsCompactMenu(compact);
      if (!compact) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCreateError(data.error || "Failed to create user");
        setCreateLoading(false);
        return;
      }
      setForm({ email: "", password: "", name: "" });
      setModalOpen(false);
      setSuccessMessage("User created successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchUsers();
    } catch {
      setCreateError("Unable to create user.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLogout = () => {
    setIsSettingsOpen(false);
    setIsMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editModalUser) return;
    const id = editModalUser._id || editModalUser.id;
    setEditError("");
    setEditLoading(true);
    try {
      const body = { name: editForm.name.trim() || "" };
      if (editForm.password.trim().length >= 6) body.password = editForm.password;
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEditError(data.error || "Failed to update user");
        setEditLoading(false);
        return;
      }
      setEditModalUser(null);
      setEditForm({ name: "", password: "" });
      setSuccessMessage("User updated successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchUsers();
    } catch {
      setEditError("Unable to update user.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    const id = deleteConfirmUser._id || deleteConfirmUser.id;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete user");
      } else {
        setDeleteConfirmUser(null);
        setSuccessMessage("User deleted successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchUsers();
        if (paginatedUsers.length === 1 && currentPage > 1) setPage(currentPage - 1);
      }
    } catch {
      setError("Unable to delete user.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (u) => {
    setEditModalUser(u);
    setEditForm({ name: u.name || "", password: "" });
    setEditError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8f7fc 0%, #f0eef8 50%, #fff 100%)",
      }}
    >
      <style>{`
        .admin-mobile-menu-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .admin-mobile-menu-button span {
          width: 24px;
          height: 2px;
          background: #6022A6;
          transition: all 0.3s;
        }
      `}</style>
      <header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 10px 30px #1629410d",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: "10px",
            }}
            onClick={() => navigate("/")}
          >
            <img
              src="/logo_GE.png"
              alt="GE HealthCare Logo"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          </div>
          {!isCompactMenu ? (
            <div className="nav-menu">
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    style={{
                      marginLeft: "12px",
                      padding: "10px 18px",
                      backgroundColor: "transparent",
                      color: "#6022A6",
                      border: "1px solid #6022A6",
                      borderRadius: "6px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#6022A6";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#6022A6";
                    }}
                  >
                    Home
                  </button>
                </li>
                <li ref={settingsRef} style={{ position: "relative" }}>
                  <button
                    type="button"
                    aria-label="Settings"
                    onClick={() => setIsSettingsOpen((prev) => !prev)}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#6022A6",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.2V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-.4-1.2 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.2-.4H2.72a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.2-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.2V2.72a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 .4 1.2 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .38.22.74.6 1 .34.24.75.38 1.2.4h.08a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.2.4 1.7 1.7 0 0 0-.6 1z" />
                    </svg>
                  </button>
                  {isSettingsOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        minWidth: "240px",
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.12)",
                        zIndex: 120,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 12px",
                          borderBottom: "1px solid #e5e7eb",
                          fontSize: "13px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                          width: "100%",
                          overflowWrap: "anywhere",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {user?.photoURL || user?.avatar ? (
                          <img
                            src={user?.photoURL || user?.avatar}
                            alt="Profile"
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1px solid #d1d5db",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              backgroundColor: "#e2e8f0",
                              color: "#334155",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "600",
                              flexShrink: 0,
                            }}
                          >
                            {(user?.email?.[0] || "U").toUpperCase()}
                          </div>
                        )}
                        <span>{user?.email || "No email"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 12px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "red",
                          fontSize: "14px",
                          fontFamily: "inherit",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="admin-mobile-menu-button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span
                style={{
                  transform: isMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                }}
              />
              <span
                style={{
                  opacity: isMenuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  transform: isMenuOpen ? "rotate(-45deg) translate(7px, -6px)" : "none",
                }}
              />
            </button>
          )}
        </div>
      </header>
      {isCompactMenu && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 99,
              opacity: isMenuOpen ? 1 : 0,
              visibility: isMenuOpen ? "visible" : "hidden",
              transition: "opacity 0.3s, visibility 0.3s",
            }}
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            style={{
              position: "fixed",
              top: "73px",
              right: isMenuOpen ? 0 : "-100%",
              width: "280px",
              height: "calc(100vh - 73px)",
              background: "#ffffff",
              zIndex: 101,
              transition: "right 0.3s",
              boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
              padding: "24px",
              overflowY: "auto",
            }}
          >
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                style={{
                  padding: "0",
                  backgroundColor: "transparent",
                  color: "#6022A6",
                  border: "none",
                  fontSize: "18px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  width: "fit-content",
                  textAlign: "left",
                }}
              >
                Home
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: "0",
                  backgroundColor: "transparent",
                  color: "red",
                  border: "none",
                  fontSize: "18px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  width: "fit-content",
                  textAlign: "left",
                }}
              >
                Logout
              </button>
            </nav>
          </div>
        </>
      )}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.06), 0 1px 3px rgba(96,34,166,0.08)",
            border: "1px solid rgba(96,34,166,0.12)",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#222",
                margin: 0,
              }}
            >
              Users
            </h2>
            <button
            type="button"
            onClick={() => {
              setCreateError("");
              setForm({ email: "", password: "", name: "" });
              setModalOpen(true);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6022A6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Add user
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <input
            type="search"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "10px 14px",
              fontSize: "14px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontFamily: "inherit",
            }}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#475569",
            }}
          >
            Show
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontFamily: "inherit",
              }}
            >
              {ROWS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            per page
          </label>
        </div>

        {successMessage && (
          <p
            style={{
              padding: "12px 16px",
              background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
              color: "#166534",
              borderRadius: "8px",
              marginBottom: "16px",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            {successMessage}
          </p>
        )}

        {error && (
          <p
            style={{
              color: "#dc2626",
              marginBottom: "16px",
              padding: "12px 16px",
              background: "#fef2f2",
              borderRadius: "8px",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </p>
        )}

        {loading ? (
          <div
            style={{
              color: "#6022A6",
              padding: "24px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 24px",
              color: "#64748b",
              background: "linear-gradient(180deg, #f8f7fc 0%, #fff 100%)",
              borderRadius: "12px",
              border: "1px dashed rgba(96,34,166,0.2)",
            }}
          >
            <p style={{ margin: 0, fontSize: "15px" }}>
              No users yet. Add one to get started.
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 24px",
              color: "#64748b",
              background: "linear-gradient(180deg, #f8f7fc 0%, #fff 100%)",
              borderRadius: "12px",
              border: "1px dashed rgba(96,34,166,0.2)",
            }}
          >
            <p style={{ margin: 0, fontSize: "15px" }}>
              No users match your search.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                border: "1px solid rgba(96,34,166,0.15)",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: "linear-gradient(135deg, #6022A6 0%, #7c3aed 100%)",
                      color: "#fff",
                    }}
                  >
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: "600",
                        width: "60px",
                      }}
                    >
                      SR No
                    </th>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      Created
                    </th>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: "600",
                        width: "160px",
                        minWidth: "160px",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((u, idx) => {
                    const srNo = (currentPage - 1) * rowsPerPage + idx + 1;
                    return (
                      <tr
                        key={u._id || u.id}
                        style={{
                          borderTop: "1px solid #e5e7eb",
                          backgroundColor: idx % 2 === 0 ? "#fff" : "#faf9fc",
                        }}
                      >
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: "14px",
                            color: "#64748b",
                          }}
                        >
                          {srNo}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: "15px",
                            color: "#475569",
                          }}
                        >
                          {u.name || "—"}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: "15px",
                            color: "#222",
                          }}
                        >
                          {u.email}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            fontSize: "14px",
                            color: "#64748b",
                          }}
                        >
                          {formatDate(u.createdAt)}
                        </td>
                        <td
                          style={{
                            padding: "10px 16px",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              flexWrap: "nowrap",
                              gap: "8px",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "transparent",
                                color: "#6022A6",
                                border: "1px solid #6022A6",
                                borderRadius: "6px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                flexShrink: 0,
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmUser(u)}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "transparent",
                                color: "#dc2626",
                                border: "1px solid #dc2626",
                                borderRadius: "6px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                flexShrink: 0,
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                Showing {(currentPage - 1) * rowsPerPage + 1}–
                {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length}
              </span>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: currentPage <= 1 ? "#f1f5f9" : "#fff",
                    color: currentPage <= 1 ? "#94a3b8" : "#6022A6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: "14px", color: "#475569" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: currentPage >= totalPages ? "#f1f5f9" : "#fff",
                    color: currentPage >= totalPages ? "#94a3b8" : "#6022A6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
        </div>
      </main>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={() => !createLoading && setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "28px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 16px rgba(96,34,166,0.12)",
              border: "1px solid rgba(96,34,166,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "2px solid #6022A6",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#6022A6",
                  margin: 0,
                }}
              >
                Create user
              </h2>
            </div>
            <form onSubmit={handleCreateUser}>
              {createError && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                >
                  {createError}
                </p>
              )}
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222",
                  marginBottom: "6px",
                }}
              >
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "15px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222",
                  marginBottom: "6px",
                }}
              >
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "15px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222",
                  marginBottom: "6px",
                }}
              >
                Name (optional)
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "15px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={createLoading}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: createLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6022A6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: createLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {createLoading ? "Creating…" : "Create user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={() => !editLoading && setEditModalUser(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "28px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 16px rgba(96,34,166,0.12)",
              border: "1px solid rgba(96,34,166,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "2px solid #6022A6",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#6022A6", margin: 0 }}>
                Edit user
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0" }}>
                {editModalUser.email}
              </p>
            </div>
            <form onSubmit={handleEditUser}>
              {editError && (
                <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>
                  {editError}
                </p>
              )}
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222",
                  marginBottom: "6px",
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "15px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#222",
                  marginBottom: "6px",
                }}
              >
                New password (leave blank to keep current)
              </label>
              <input
                type="password"
                minLength={6}
                placeholder="Optional"
                value={editForm.password}
                onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "15px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  disabled={editLoading}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: editLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6022A6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: editLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {editLoading ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={() => !deleteLoading && setDeleteConfirmUser(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "28px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              border: "1px solid #fecaca",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>
              Delete user?
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
              This will permanently delete <strong>{deleteConfirmUser.email}</strong>. This action
              cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                disabled={deleteLoading}
                style={{
                  padding: "10px 18px",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: deleteLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                style={{
                  padding: "10px 18px",
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: deleteLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminUsers;
