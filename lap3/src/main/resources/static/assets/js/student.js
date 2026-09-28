const API_URL = "http://localhost:8080/api/students";
let studentModal;
let viewModal;
let globalStudents = [];
let searchTimeout;

document.addEventListener("DOMContentLoaded", () => {
    studentModal = new bootstrap.Modal(document.getElementById('studentModal'));
    viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    loadStudents();
});

// THÔNG BÁO TOAST NHỎ GỌN + HIỆU ỨNG MƯỢT MA
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();
    
    const isSuccess = type === 'success';
    const bgClass = isSuccess ? 'bg-success' : 'bg-danger';
    const iconClass = isSuccess ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill';

    const toastHTML = `
        <div id="${toastId}" class="toast custom-toast align-items-center text-white ${bgClass} border-0 show" role="alert">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi ${iconClass} fs-6"></i>
                    <span>${message}</span>
                </div>
                <button type="button" class="btn-close btn-close-white ms-3" data-bs-dismiss="toast" style="font-size: 10px;"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);

    // Tự biến mất sau 2.5 giây
    setTimeout(() => {
        toastElement.style.opacity = '0';
        toastElement.style.transform = 'translateX(100%)';
        setTimeout(() => toastElement.remove(), 300);
    }, 2500);
}

// 1. TẢI DANH SÁCH SINH VIÊN (GET)
async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Lỗi tải danh sách sinh viên");
        
        globalStudents = await response.json();
        applyFilterSortAndRender();
    } catch (error) {
        console.error("Lỗi:", error);
        document.getElementById("studentTableBody").innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-3">Lỗi tải dữ liệu từ máy chủ!</td>
            </tr>
        `;
    }
}

// 2. TÌM KIẾM + SẮP XẾP + RENDER
function applyFilterSortAndRender() {
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    const sortVal = document.getElementById("sortSelect").value;

    let filtered = globalStudents.filter(s => {
        if (!keyword) return true;
        const code = (s.studentCode || '').toLowerCase();
        const name = (s.fullName || '').toLowerCase();
        const email = (s.email || '').toLowerCase();
        const phone = (s.phone || '').toLowerCase();
        const className = (s.className || '').toLowerCase();

        return code.includes(keyword) || 
               name.includes(keyword) || 
               email.includes(keyword) || 
               phone.includes(keyword) || 
               className.includes(keyword);
    });

    filtered.sort((a, b) => {
        if (sortVal === "id-asc") {
            return (a.studentCode || '').localeCompare(b.studentCode || '');
        } else if (sortVal === "id-desc") {
            return (b.studentCode || '').localeCompare(a.studentCode || '');
        } else if (sortVal === "name-asc") {
            return getLastName(a.fullName).localeCompare(getLastName(b.fullName), 'vi');
        } else if (sortVal === "name-desc") {
            return getLastName(b.fullName).localeCompare(getLastName(a.fullName), 'vi');
        }
        return 0;
    });

    renderStudents(filtered);
}

function getLastName(fullName = '') {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1];
}

function renderStudents(students) {
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    if (!students || students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-3">Không tìm thấy sinh viên nào.</td>
            </tr>
        `;
        return;
    }

    students.forEach((student, index) => {
        const row = `
            <tr>
                <td class="text-muted">${index + 1}</td>
                <td><span class="badge bg-light text-dark border">${student.studentCode || ''}</span></td>
                <td class="fw-bold text-primary">${student.fullName || ''}</td>
                <td>${student.email || ''}</td>
                <td>${student.phone || ''}</td>
                <td>${student.className || ''}</td>
                <td class="text-center">
                    <div class="d-inline-flex gap-1">
                        <button class="btn btn-info btn-custom-action text-white" onclick="viewStudent('${student.id}')" title="Xem">
                            <i class="bi bi-info-circle me-1"></i>Chi tiết
                        </button>
                        <button class="btn btn-warning btn-custom-action text-white" onclick="openEditModal('${student.id}')" title="Sửa">
                            <i class="bi bi-pencil-square me-1"></i>Sửa
                        </button>
                        <button class="btn btn-danger btn-custom-action" onclick="deleteStudent('${student.id}')" title="Xóa">
                            <i class="bi bi-trash me-1"></i>Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Lọc vừa gõ vừa bấm nút tìm kiếm đều được
function handleInstantSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilterSortAndRender();
    }, 150);
}

function searchStudents() {
    applyFilterSortAndRender();
}

function handleSearchKeyup(event) {
    if (event.key === "Enter") {
        searchStudents();
    }
}

function resetSearch() {
    document.getElementById("searchInput").value = "";
    applyFilterSortAndRender();
}

function changeSortOption() {
    applyFilterSortAndRender();
}

function sortByHeader(type) {
    const select = document.getElementById("sortSelect");
    if (type === 'id') {
        select.value = select.value === 'id-asc' ? 'id-desc' : 'id-asc';
    } else if (type === 'name') {
        select.value = select.value === 'name-asc' ? 'name-desc' : 'name-asc';
    }
    applyFilterSortAndRender();
}

// 3. MỞ MODAL THÊM
function openAddModal() {
    document.getElementById("modalTitle").innerText = "Thêm sinh viên mới";
    document.getElementById("studentForm").reset();
    document.getElementById("studentId").value = "";
    studentModal.show();
}

// 4. MỞ MODAL SỬA
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Không lấy được thông tin sinh viên");
        
        const student = await response.json();
        
        document.getElementById("modalTitle").innerText = "Sửa thông tin sinh viên";
        document.getElementById("studentId").value = student.id;
        document.getElementById("studentCode").value = student.studentCode || "";
        document.getElementById("fullName").value = student.fullName || "";
        document.getElementById("email").value = student.email || "";
        document.getElementById("phone").value = student.phone || "";
        document.getElementById("className").value = student.className || "";
        
        studentModal.show();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 5. LƯU SINH VIÊN (POST/PUT)
async function saveStudent() {
    const id = document.getElementById("studentId").value;
    const studentData = {
        studentCode: document.getElementById("studentCode").value.trim(),
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        className: document.getElementById("className").value.trim()
    };

    if (!studentData.studentCode || !studentData.fullName || !studentData.email) {
        showToast("Vui lòng nhập đủ thông tin bắt buộc!", "error");
        return;
    }

    const isEdit = id !== "";
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            studentModal.hide();
            showToast(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!", "success");
            loadStudents();
        } else {
            showToast("Thất bại! Kiểm tra trùng Mã SV / Email.", "error");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        showToast("Lỗi kết nối máy chủ!", "error");
    }
}

// 6. XÓA SINH VIÊN (DELETE)
async function deleteStudent(id) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (response.ok) {
                showToast("Đã xóa sinh viên!", "success");
                loadStudents();
            } else {
                showToast("Xóa thất bại!", "error");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            showToast("Lỗi kết nối máy chủ!", "error");
        }
    }
}

// 7. XEM CHI TIẾT
async function viewStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Không thể tải thông tin sinh viên");
        
        const student = await response.json();
        
        document.getElementById("viewModalBody").innerHTML = `
            <div class="mb-2"><strong>Mã sinh viên:</strong> <span class="badge bg-primary">${student.studentCode || ''}</span></div>
            <div class="mb-2"><strong>Họ và tên:</strong> ${student.fullName || ''}</div>
            <div class="mb-2"><strong>Email:</strong> ${student.email || ''}</div>
            <div class="mb-2"><strong>Số điện thoại:</strong> ${student.phone || ''}</div>
            <div class="mb-2"><strong>Lớp:</strong> ${student.className || ''}</div>
        `;
        viewModal.show();
    } catch (error) {
        showToast(error.message, 'error');
    }
}