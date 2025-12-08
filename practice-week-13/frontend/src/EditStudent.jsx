import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './EditStudent.css'

function EditStudent() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [stuClass, setStuClass] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/api/students/${id}`)
        const student = response.data
        
        setName(student.name)
        setAge(student.age.toString())
        setStuClass(student.class)
        setError(null)
      } catch (error) {
        console.error("Lỗi khi tải thông tin học sinh:", error)
        setError("Không thể tải thông tin học sinh")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchStudent()
    }
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    if (!name.trim() || !age.trim() || !stuClass.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setSaving(true)
    try {
      const updatedStudent = {
        name: name.trim(),
        age: Number(age),
        class: stuClass.trim()
      }
      
      await axios.put(`http://localhost:5000/api/students/${id}`, updatedStudent)
      
      alert("Cập nhật học sinh thành công!")
      navigate("/")
      
    } catch (error) {
      console.error("Lỗi khi cập nhật học sinh:", error)
      alert("Không thể cập nhật học sinh. Vui lòng thử lại!")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate("/")
  }

  if (loading) {
    return <div className="loading">Đang tải thông tin học sinh...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={handleCancel} className="back-btn">
          Quay về danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="edit-student-container">
      <header>
        <h1>Chỉnh Sửa Thông Tin Học Sinh</h1>
      </header>
      
      <div className="edit-form-container">
        <form onSubmit={handleUpdate} className="edit-student-form">
          <div className="form-group">
            <label htmlFor="name">Họ và Tên:</label>
            <input
              id="name"
              type="text"
              placeholder="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Tuổi:</label>
            <input
              id="age"
              type="number"
              placeholder="Tuổi"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="16"
              max="30"
              required
              disabled={saving}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="class">Lớp:</label>
            <input
              id="class"
              type="text"
              placeholder="Lớp (ví dụ: IT4409-01)"
              value={stuClass}
              onChange={(e) => setStuClass(e.target.value)}
              required
              disabled={saving}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-btn"
              disabled={saving}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditStudent