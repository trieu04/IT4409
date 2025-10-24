// Lấy các phần tử DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelBtn = document.getElementById('cancelBtn');
const productList = document.getElementById('productList');

// CHỨC NĂNG TÌM KIẾM SẢN PHẨM

// Hàm tìm kiếm sản phẩm
function searchProducts() {
  // Lấy giá trị tìm kiếm và chuyển về chữ thường
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Lấy tất cả các sản phẩm
  const products = document.querySelectorAll('.product-item');

  // Duyệt qua từng sản phẩm
  products.forEach(product => {
    // Lấy tên sản phẩm
    const productName = product.querySelector('.product-name').textContent.toLowerCase();

    // Kiểm tra xem tên có chứa từ khóa tìm kiếm không
    if (productName.includes(searchTerm)) {
      // Hiển thị sản phẩm
      product.style.display = '';
    } else {
      // Ẩn sản phẩm
      product.style.display = 'none';
    }
  });
}

// Gắn sự kiện click cho nút tìm kiếm
searchBtn.addEventListener('click', searchProducts);

// Gắn sự kiện keyup cho ô tìm kiếm (tìm kiếm khi nhấn Enter)
searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchProducts();
  }
});

// Tìm kiếm theo thời gian thực khi gõ (tùy chọn)
searchInput.addEventListener('input', searchProducts);


// CHỨC NĂNG THÊM SẢN PHẨM

// Gắn sự kiện click cho nút "Thêm sản phẩm"
addProductBtn.addEventListener('click', () => addProductForm.classList.toggle('hidden'));


// Xử lý sự kiện submit form thêm sản phẩm
addProductForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Ngăn hành vi mặc định của form
  addProductForm.classList.toggle('hidden'); // Ẩn form sau khi submit
});

// Gắn sự kiện click cho nút "Hủy" trong form
cancelBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Ngăn hành vi mặc định của button
  addProductForm.classList.add('hidden'); // Ẩn form
  addProductForm.reset(); // Reset form về trạng thái ban đầu
});
