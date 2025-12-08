import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        <h2>Danh Sách Học Sinh</h2>
        
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
      </main>
    </div>
  )
}

export default App
