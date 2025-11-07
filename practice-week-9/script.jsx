// Component: SearchForm
function SearchForm({ onChangeValue }) {
  return (
    <div className="search-section">
      <input
        type="text"
        placeholder="Tìm theo name, username..."
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  );
}

// Component: AddUser
function AddUser({ onAdd }) {
  const [adding, setAdding] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "",
    username: "",
    email: "",
    address: { city: "" },
    phone: "",
    website: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["city"].includes(id)) {
      setUser({ ...user, address: { ...user.address, [id]: value } });
    } else {
      setUser({ ...user, [id]: value });
    }
  };

  const handleAdd = () => {
    if (user.name === "" || user.username === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    onAdd(user);
    setUser({
      name: "",
      username: "",
      email: "",
      address: { city: "" },
      phone: "",
      website: ""
    });
    setAdding(false);
  };

  return (
    <div className="add-section">
      <button className="btn-add" onClick={() => setAdding(true)}>
        Thêm người dùng
      </button>

      {adding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Thêm người dùng</h4>

            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={user.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                value={user.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input
                id="city"
                type="text"
                value={user.address.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                id="phone"
                type="text"
                value={user.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website:</label>
              <input
                id="website"
                type="text"
                value={user.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setAdding(false)}>
                Hủy
              </button>
              <button className="btn-save" onClick={handleAdd}>
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hiển thị, lọc, sửa, xóa người dùng
function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(null);

  // Tải dữ liệu 1 lần khi component mount
  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  // Thêm người dùng mới vào danh sách
  React.useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      onAdded();
    }
  }, [user]);

  // Lọc danh sách theo keyword
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  // Xóa người dùng
  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  // Sửa người dùng - Deep copy để tránh thay đổi dữ liệu gốc
  function editUser(user) {
    setEditing({ ...user, address: { ...user.address } });
  }

  // Xử lý thay đổi khi chỉnh sửa
  function handleEditChange(field, value) {
    if (["city"].includes(field)) {
      setEditing({ ...editing, address: { ...editing.address, [field]: value } });
    } else {
      setEditing({ ...editing, [field]: value });
    }
  }

  // Lưu sau khi chỉnh sửa
  function saveUser() {
    if (editing.name === "" || editing.username === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
    setEditing(null);
  }

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.address.city}</td>
                <td>
                  <button className="btn-edit" onClick={() => editUser(u)}>
                    Sửa
                  </button>
                  <button className="btn-delete" onClick={() => removeUser(u.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-results">
                Không tìm thấy người dùng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal chỉnh sửa */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Chỉnh sửa người dùng</h4>

            <div className="form-group">
              <label htmlFor="edit-name">Name:</label>
              <input
                id="edit-name"
                type="text"
                value={editing.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-username">Username:</label>
              <input
                id="edit-username"
                type="text"
                value={editing.username}
                onChange={(e) => handleEditChange("username", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">Email:</label>
              <input
                id="edit-email"
                type="email"
                value={editing.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-city">City:</label>
              <input
                id="edit-city"
                type="text"
                value={editing.address.city}
                onChange={(e) => handleEditChange("city", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-phone">Phone:</label>
              <input
                id="edit-phone"
                type="text"
                value={editing.phone}
                onChange={(e) => handleEditChange("phone", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-website">Website:</label>
              <input
                id="edit-website"
                type="text"
                value={editing.website}
                onChange={(e) => handleEditChange("website", e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setEditing(null)}>
                Hủy
              </button>
              <button className="btn-save" onClick={saveUser}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component: App - Component gốc quản lý toàn bộ state
function App() {
  const [kw, setKeyword] = React.useState("");
  const [newUser, setNewUser] = React.useState(null);

  return (
    <div className="container">
      <h1>Quản lý người dùng</h1>
      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUser} />
      <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
    </div>
  );
}

// Render ứng dụng
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
