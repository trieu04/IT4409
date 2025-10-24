// Lấy các phần tử DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelBtn = document.getElementById('cancelBtn');
const productList = document.getElementById('productList');
const errorMsg = document.getElementById('errorMsg');

// Khóa để lưu trữ dữ liệu trong LocalStorage
const STORAGE_KEY = 'products';

// Hàm lấy danh sách sản phẩm từ LocalStorage
function getProductsFromStorage() {
  const productsJSON = localStorage.getItem(STORAGE_KEY);
  if (productsJSON) {
    try {
      return JSON.parse(productsJSON);
    } catch (e) {
      console.error('Lỗi khi parse dữ liệu từ LocalStorage:', e);
      return null;
    }
  }
  return null;
}

// Hàm lưu danh sách sản phẩm vào LocalStorage
function saveProductsToStorage(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (e) {
    console.error('Lỗi khi lưu dữ liệu vào LocalStorage:', e);
    return false;
  }
}

// Hàm khởi tạo dữ liệu mẫu ban đầu
function initializeDefaultProducts() {
  const defaultProducts = [
    {
      name: 'Lập trình Web từ cơ bản đến nâng cao',
      price: 250000,
      description: 'Cuốn sách hướng dẫn chi tiết về HTML, CSS, JavaScript và các framework hiện đại. Phù hợp cho người mới bắt đầu.',
      imageUrl: 'https://placehold.co/200x300?text=Lap+trinh+Web'
    },
    {
      name: 'Đắc Nhân Tâm',
      price: 150000,
      description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử trong cuộc sống. Một tác phẩm không thể bỏ qua!',
      imageUrl: 'https://placehold.co/200x300?text=Dac+Nhan+Tam'
    },
    {
      name: 'Harry Potter và Hòn đá Phù thủy',
      price: 180000,
      description: 'Tập đầu tiên trong series Harry Potter nổi tiếng. Thế giới phép thuật đầy màu sắc dành cho mọi lứa tuổi.',
      imageUrl: 'https://placehold.co/200x300?text=Harry+Potter'
    }
  ];
  
  saveProductsToStorage(defaultProducts);
  return defaultProducts;
}

// CHỨC NĂNG TÌM KIẾM SẢN PHẨM

// Hàm tìm kiếm sản phẩm
function searchProducts() {
  // Lấy giá trị tìm kiếm và chuyển về chữ thường
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Lấy tất cả các sản phẩm (cập nhật mỗi lần tìm kiếm để bao gồm cả sản phẩm mới)
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
addProductBtn.addEventListener('click', () => {
  addProductForm.classList.toggle('hidden');
  // Xóa thông báo lỗi khi mở form
  errorMsg.textContent = '';
});

// Hàm format giá theo định dạng Việt Nam
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price);
}

// Hàm validate dữ liệu form
function validateProductData(name, price, description, imageUrl) {
  // Kiểm tra tên sản phẩm
  if (!name || name.trim() === '') {
    return { valid: false, message: 'Vui lòng nhập tên sản phẩm!' };
  }

  if (name.trim().length < 3) {
    return { valid: false, message: 'Tên sản phẩm phải có ít nhất 3 ký tự!' };
  }

  // Kiểm tra giá
  if (!price || price.trim() === '') {
    return { valid: false, message: 'Vui lòng nhập giá sản phẩm!' };
  }

  const priceNumber = Number(price);
  if (isNaN(priceNumber) || priceNumber <= 0) {
    return { valid: false, message: 'Giá sản phẩm phải là số dương hợp lệ!' };
  }

  // Kiểm tra mô tả
  if (!description || description.trim() === '') {
    return { valid: false, message: 'Vui lòng nhập mô tả sản phẩm!' };
  }

  if (description.trim().length < 10) {
    return { valid: false, message: 'Mô tả sản phẩm phải có ít nhất 10 ký tự!' };
  }

  // Kiểm tra URL hình ảnh (tùy chọn)
  if (imageUrl && imageUrl.trim() !== '') {
    try {
      new URL(imageUrl);
    } catch (e) {
      return { valid: false, message: 'URL hình ảnh không hợp lệ!' };
    }
  }

  return { valid: true };
}

// Hàm tạo phần tử sản phẩm mới
function createProductElement(name, price, description, imageUrl) {
  // Tạo phần tử article
  const newProduct = document.createElement('article');
  newProduct.className = 'product-item';

  // Tạo URL hình ảnh mặc định nếu không có
  const defaultImageUrl = imageUrl && imageUrl.trim() !== '' 
    ? imageUrl 
    : `https://placehold.co/200x300?text=${encodeURIComponent(name.substring(0, 20))}`;

  // Tạo nội dung HTML cho sản phẩm
  newProduct.innerHTML = `
    <h3 class="product-name">${name}</h3>
    <img src="${defaultImageUrl}" alt="${name}">
    <p>${description}</p>
    <p><strong>Giá: ${formatPrice(price)} VNĐ</strong></p>
  `;

  return newProduct;
}

// Hàm render tất cả sản phẩm từ mảng
function renderProducts(products) {
  // Xóa tất cả sản phẩm hiện tại
  productList.innerHTML = '';
  
  // Tạo và thêm các phần tử sản phẩm mới
  products.forEach(product => {
    const productElement = createProductElement(
      product.name,
      product.price,
      product.description,
      product.imageUrl
    );
    productList.appendChild(productElement);
  });
}

// Hàm khởi tạo trang khi load
function initializePage() {
  // Lấy dữ liệu từ LocalStorage
  let products = getProductsFromStorage();
  
  // Nếu chưa có dữ liệu, khởi tạo với sản phẩm mẫu
  if (!products || products.length === 0) {
    products = initializeDefaultProducts();
  }
  
  // Render danh sách sản phẩm
  renderProducts(products);
}


// Xử lý sự kiện submit form thêm sản phẩm
addProductForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Ngăn hành vi mặc định của form

  // Lấy giá trị từ các trường input
  const name = document.getElementById('productName').value.trim();
  const price = document.getElementById('productPrice').value.trim();
  const description = document.getElementById('productDescription').value.trim();
  const imageUrl = document.getElementById('productImage').value.trim();

  // Validate dữ liệu
  const validation = validateProductData(name, price, description, imageUrl);

  if (!validation.valid) {
    // Hiển thị thông báo lỗi
    errorMsg.textContent = validation.message;
    return; // Dừng việc thêm sản phẩm
  }

  // Xóa thông báo lỗi nếu dữ liệu hợp lệ
  errorMsg.textContent = '';

  // Lấy danh sách sản phẩm hiện tại từ LocalStorage
  let products = getProductsFromStorage() || [];

  // Tạo đối tượng sản phẩm mới
  const newProductData = {
    name: name,
    price: Number(price),
    description: description,
    imageUrl: imageUrl || `https://placehold.co/200x300?text=${encodeURIComponent(name.substring(0, 20))}`
  };

  // Thêm sản phẩm mới vào đầu mảng
  products.unshift(newProductData);

  // Lưu vào LocalStorage
  const saved = saveProductsToStorage(products);

  if (saved) {
    // Tạo phần tử sản phẩm mới
    const newProduct = createProductElement(name, price, description, imageUrl);

    // Thêm sản phẩm mới vào đầu danh sách
    productList.prepend(newProduct);

    // Thêm hiệu ứng xuất hiện cho sản phẩm mới
    newProduct.style.animation = 'fadeIn 0.5s ease';

    // Reset form
    addProductForm.reset();

    // Ẩn form
    addProductForm.classList.add('hidden');

    // Nếu đang có tìm kiếm, cập nhật lại danh sách
    if (searchInput.value.trim() !== '') {
      searchProducts();
    }
  } else {
    errorMsg.textContent = 'Lỗi khi lưu sản phẩm. Vui lòng thử lại!';
  }
});

// Gắn sự kiện click cho nút "Hủy" trong form
cancelBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Ngăn hành vi mặc định của button
  addProductForm.classList.add('hidden'); // Ẩn form
  addProductForm.reset(); // Reset form về trạng thái ban đầu
  errorMsg.textContent = ''; // Xóa thông báo lỗi
});

initializePage();
