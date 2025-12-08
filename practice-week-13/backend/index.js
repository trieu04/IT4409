const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Student = require('./Student');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// API Routes
// GET danh sách học sinh
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST thêm học sinh mới
app.post('/api/students', async (req, res) => {
  try {
    const { name, age, class: studentClass } = req.body;
    const newStudent = new Student({
      name,
      age,
      class: studentClass
    });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT cập nhật học sinh theo ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, age, class: studentClass } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, class: studentClass },
      { new: true, runValidators: true }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ error: "Không tìm thấy học sinh" });
    }
    
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET lấy thông tin học sinh theo ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Không tìm thấy học sinh" });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE xóa học sinh theo ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete(id);
    
    if (!deletedStudent) {
      return res.status(404).json({ error: "Không tìm thấy học sinh" });
    }
    
    res.json({ 
      message: "Đã xóa học sinh thành công", 
      id: deletedStudent._id,
      name: deletedStudent.name 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'Student Management API đang hoạt động' });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});