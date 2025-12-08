import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // State cho form thêm học sinh
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [stuClass, setStuClass] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:5000/api/students')
        setStudents(response.data)
        setError(null)
      } catch (error) {
        console.error("Lỗi khi fetch danh sách học sinh:", error)
        setError("Không thể tải danh sách học sinh")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Hàm thêm học sinh mới
  const handleAddStudent = async (e) => {
    e.preventDefault()
    
    if (!name.trim() || !age.trim() || !stuClass.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setIsAdding(true)
    try {
      const newStudent = { 
        name: name.trim(), 
        age: Number(age), 
        class: stuClass.trim() 
      }
      
      const response = await axios.post('http://localhost:5000/api/students', newStudent)
      
      // Cập nhật danh sách học sinh
      setStudents(prev => [...prev, response.data])
      
      // Xóa form
      setName("")
      setAge("")
      setStuClass("")
      
      // Hiển thị thông báo thành công
      setSuccessMessage("Thêm học sinh thành công!")
      setTimeout(() => setSuccessMessage(""), 3000)
      
    } catch (error) {
      console.error("Lỗi khi thêm học sinh:", error)
      alert("Không thể thêm học sinh. Vui lòng thử lại!")
    } finally {
      setIsAdding(false)
    }
  }

  if (loading) {
    return <div className="loading">Đang tải danh sách học sinh...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="app">
      <header>
        <h1>Quản Lý Học Sinh</h1>
      </header>
      
      <main>
        {/* Form thêm học sinh */}
        <section className="add-student-section">
          <h2>Thêm Học Sinh Mới</h2>
          
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleAddStudent} className="add-student-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isAdding}
              />
            </div>
            
            <div className="form-group">
              <input
                type="number"
                placeholder="Tuổi"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="16"
                max="30"
                required
                disabled={isAdding}
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Lớp (ví dụ: IT4409-01)"
                value={stuClass}
                onChange={(e) => setStuClass(e.target.value)}
                required
                disabled={isAdding}
              />
            </div>
            
            <button 
              type="submit" 
              className="add-btn"
              disabled={isAdding}
            >
              {isAdding ? "Đang thêm..." : "Thêm học sinh"}
            </button>
          </form>
        </section>

        {/* Danh sách học sinh */}
        <section className="students-list-section">
          <h2>Danh Sách Học Sinh ({students.length} học sinh)</h2>
          
          {students.length === 0 ? (
          <div className="no-students">
            <p>Chưa có học sinh nào trong danh sách.</p>
          </div>
        ) : (
          <div className="student-table-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Họ và Tên</th>
                  <th>Tuổi</th>
                  <th>Lớp</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </section>
      </main>
    </div>
  )
}

export default App
