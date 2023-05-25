var danhSachTaiKhoan = (function () {
    "use strict";
    var mol = {};
    renderTable();

    mol.init = function () {
        var B = $('body');
        let id;

        B.delegate('.btn-xuatQR', 'click', function() {
            let qr_string = $(this).attr('data-qr');
            id = $(this).attr('data-id');
            qrCode.clear(); // clear the code.
            qrCode.makeCode(qr_string); // make another code.
        })

        B.delegate('.btn-luuQR', 'click', function () {
            const base64 = $('.modal-body img').attr('src');
            const name = 'qr-code-' + id;
            expImageBase64(base64, name, mol.w, mol.h);
        })

        B.delegate('#capNhatTaiKhoan', 'click', function () {
            let inputs = $('#form-updateTaiKhoan input[type="text"]');
            let img = $('#form-updateTaiKhoan img');
            let picture = img.attr('src').split('/')[img.attr('src').split('/').length - 1];
            let user_id = mol.id;

            // Tạo object mới và gán giá trị cho các thuộc tính
            var obj = {
                'picture': picture,
                'user_id': user_id,
                'password': mol.password,
            };

            inputs.map((i, e) => {
                obj[e.id] = e.value;
            })


            const pic = $('#picture')[0];
            const file = pic.files[0];
            if (file) {
                const name = guid();
                saveFile(pic, name);
                obj[pic.id] = name + "." + pic.files[0].name.split(".").pop();
            }
            
            $.ajax({
                method: "POST",
                url: `http://52.76.57.212:6006/db/user/replace`,
                data: JSON.stringify(obj),
                contentType: 'application/json',
                dataType: 'json',
                }).done(function(data) {
                    if (data) {
                        renderTable();
                    }
                })  
        })

        B.delegate('.btn-xoaTaiKhoan', 'click', function () { 
            mol.id = $(this).attr('data-id');
        })

        B.delegate('#xoaTaiKhoan', 'click', function () {
            $.ajax({
                method: "POST",
                url: `http://52.76.57.212:6006/db/user/delete/${mol.id}`,
                data: '',
                }).done(function(data) {
                    if (data) renderTable();
                })
        })

        B.delegate('.btn-suaTaiKhoan', 'click', function () { 
            mol.id = $(this).attr('data-id');
            mol.password = $(this).attr('data-password');
            var inputsText = $('#form-updateTaiKhoan input[type="text"]');
            var img = $('#form-updateTaiKhoan img');
            $.ajax({
                method: "POST",
                url: `http://52.76.57.212:6006/db/user/read/${mol.id}`,
                data: ''
                }).done(function(d) {
                    if (d) {
                        inputsText.map((i, e) => {
                            e.value = d.data[e.id]
                        })
                        img.attr('src', `./assets/img/TaiKhoan/${d.data.picture}`);
                        img.attr('alt', `Picture${d.data.picture}`);
                    };
                })
        })

        B.delegate('.btn-chiTietTaiKhoan', 'click', function () {
            var id = $(this).attr('data-id');
            var modalBody = $('#modalChiTietTaiKhoan .modal-body');
            $.ajax({
                method: "POST",
                url: `http://52.76.57.212:6006/db/user/read/${id}`,
                data: ''
                }).done(function(d) {
                    let html = [];
                    html.push(`
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">ID :</label>
                            <span>${d.user_id}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Username :</label>
                            <span>${d.data.username}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Tên :</label>
                            <span>${d.data.name}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Email:</label>
                            <span>${d.data.email}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Điện thoại :</label>
                            <span>${d.data.phone_number}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Địa chỉ :</label>
                            <span>${d.data.dia_chi}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Bộ phận :</label>
                            <span>${d.data.bo_phan}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Hình ảnh :</label>
                            <img src="./assets/img/taikhoan/${d.data.picture}" alt="Picture ${d.data.name}" width="500" height="300" style="object-fit: cover;">
                        </div>

                        <
                    `)
                    modalBody.html(html.join(''))
                })
        })
    }

    
    return mol;

    function guid() {
        return uuid.v4();
    }
                                                                                                            
    function renderTable () {
        const url = "http://52.76.57.212:6006/db/user/read_all";
        // lay danh sach vat tu
        let th = `<thead><tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên</th>
                    <th scope="col">Tài khoản</th>
                    <th scope="col">Email</th>
                    <th scope="col">Điện thoại</th>
                    <th scope="col">Bộ phận</th>
                    <th scope="col">Địa chỉ</th>
                    <th scope="col">Hành động</th>
                </tr></thead>`;

        $.ajax({
        url: url,
        context: document.body
        }).done(function(data) {
        var tb = [];
        tb = data.map(function(x, i) {
        return `<tr>
                <td scope="row">${i+1}</td>
                <td>${x.data.name}</td>
                <td>${x.data.username}</td>
                <td>${x.data.email}</td>
                <td>${x.data.phone_number}</td>
                <td>${x.data.bo_phan}</td>
                <td>${x.data.dia_chi}</td>
                <td>
                    <button type="button" data-id='${x.user_id}' data-password='${x.data.password}' class="btn btn-warning btn-suaTaiKhoan" data-bs-toggle="modal" data-bs-target="#modalSuaTaiKhoan">Sửa</button>
                    <button type="button" data-id='${x.user_id}' class="btn btn-danger btn-xoaTaiKhoan" data-bs-toggle="modal" data-bs-target="#modalXoaTaiKhoan">
                        Xóa
                    </button>
                    <button type="button" data-id='${x.user_id}' class="btn btn-secondary btn-chiTietTaiKhoan" data-bs-toggle="modal" data-bs-target="#modalChiTietTaiKhoan">
                        Chi tiết
                    </button>
                </td>
            </tr>`
        })

        $('#datatable').html(`${th}        <tbody>${tb.join('')}</tbody>        `)
        }).fail(function() {
        window.location.replace("./401.html");
        });
    }                                                                                                 
  
})();
$(document).ready(function () {
    danhSachTaiKhoan.init();
})