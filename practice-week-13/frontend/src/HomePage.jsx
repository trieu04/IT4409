import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // State cho form thêm học sinh
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [stuClass, setStuClass] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

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

  const handleEditStudent = (studentId) => {
    navigate(`/edit/${studentId}`)
  }

  // Hàm xóa học sinh
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa học sinh "${studentName}"?`)) {
      return
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/students/${studentId}`)
      console.log(response.data.message)
      
      // Cập nhật danh sách bằng cách loại bỏ học sinh đã xóa
      setStudents(prevList => prevList.filter(s => s._id !== studentId))
      
      // Hiển thị thông báo thành công
      setSuccessMessage(`Đã xóa học sinh "${studentName}" thành công!`)
      setTimeout(() => setSuccessMessage(""), 3000)
      
    } catch (error) {
      console.error("Lỗi khi xóa học sinh:", error)
      alert("Không thể xóa học sinh. Vui lòng thử lại!")
    }
  }

  // Lọc danh sách học sinh theo từ khóa tìm kiếm
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading">Đang tải danh sách học sinh...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="home-page">
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
          <h2>
            Danh Sách Học Sinh 
            ({searchTerm ? `${filteredStudents.length}/${students.length}` : students.length} học sinh
            {searchTerm ? ` - tìm kiếm: "${searchTerm}"` : ''})
          </h2>
          
          {/* Ô tìm kiếm */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm học sinh theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {filteredStudents.length === 0 ? (
            <div className="no-students">
              <p>
                {students.length === 0 
                  ? "Chưa có học sinh nào trong danh sách." 
                  : `Không tìm thấy học sinh nào với từ khóa "${searchTerm}".`
                }
              </p>
            </div>
          ) : (
            <div className="student-table-container">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Họ và Tên</th>
                    <th>Tuổi</th>
                    <th>Lớp</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.age}</td>
                      <td>{student.class}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditStudent(student._id)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteStudent(student._id, student.name)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
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

export default HomePage