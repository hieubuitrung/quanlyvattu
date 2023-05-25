var danhSachVatTu = (function () {
    "use strict";
    var mol = {};
    mol.w = 450;
    mol.h = 450;
    renderTable();

    mol.init = function () {
        var B = $('body');
        let id, nf;
        var qrCode = createQRCode('show-qrcode', '', mol.w, mol.h);

        B.delegate('.btn-xuatQR', 'click', function() {
            let qr_string = $(this).attr('data-qr');
            id = $(this).attr('data-id');
            nf = $(this).attr('data-nf');
            qrCode.clear(); // clear the code.
            qrCode.makeCode(qr_string); // make another code.
        })

        B.delegate('.btn-luuQR', 'click', function () {
            const base64 = $('.modal-body img').attr('src');
            const name = nf;
            expImageBase64(base64, name, mol.w, mol.h);
        })

        B.delegate('#capNhatVatTu', 'click', function () {
            let inputs = $('#form-updateVatTu input[type="text"]');
            let img = $('#form-updateVatTu img');
            let picture = img.attr('src').split('/')[img.attr('src').split('/').length - 1];
            let qr_id = mol.id;

            // Tạo object mới và gán giá trị cho các thuộc tính
            var obj = {
                'picture': picture,
                'qr_id': qr_id
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
                url: `http://52.76.57.212:6006/db/item/replace`,
                data: JSON.stringify(obj),
                contentType: 'application/json',
                dataType: 'json',
                }).done(function(data) {
                    if (data) {
                        renderTable();
                    }
                })  
        })

        B.delegate('.btn-xoaVatTu', 'click', function () { 
            mol.id = $(this).attr('data-id');
        })

        B.delegate('#xoaVatTu', 'click', function () {
            $.ajax({
                method: "POST",
                url: `http://52.76.57.212:6006/db/item/delete/${mol.id}`,
                data: '',
                }).done(function(data) {
                    if (data) renderTable();
                })
        })

        B.delegate('.btn-suaVatTu', 'click', function () { 
            mol.id = $(this).attr('data-id');
            var inputsText = $('#form-updateVatTu input[type="text"]');
            var img = $('#form-updateVatTu img');
            $.ajax({
                method: "POST",
                url: `http://52.76.57.212:6006/db/item/read/${mol.id}`,
                data: ''
                }).done(function(d) {
                    if (d) {
                        inputsText.map((i, e) => {
                            e.value = d.data[e.id]
                        })
                        img.attr('src', `./assets/img/vattu/${d.data.picture}`);
                        img.attr('alt', `Picture${d.data.picture}`);
                    };
                })
        })

        B.delegate('.btn-chiTietVatTu', 'click', function () {
            var id = $(this).attr('data-id');
            var modalBody = $('#modalChiTietVatTu .modal-body');
            $.ajax({
                method: "POST",
                url: `http://52.76.57.212:6006/db/item/read/${id}`,
                data: ''
                }).done(function(d) {
                    let html = [];
                    html.push(`
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">ID :</label>
                            <span>${d.qr_id}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Tên vật tư :</label>
                            <span>${d.data.name}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Bộ phận :</label>
                            <span>${d.data.bo_phan}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Chuỗi QR Code :</label>
                            <span>${d.data.qr_string}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Giá :</label>
                            <span>${d.data.gia}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Thời gian :</label>
                            <span>${d.data.date}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Quản lý :</label>
                            <span>${d.data.quan_ly}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Chi tiết:</label>
                            <span>${d.data.chi_tiet}</span>
                        </div>
                        <div class="mb-1">
                            <label class="col-sm-3 col-form-label fw-bold">Hình ảnh :</label>
                            <img src="./assets/img/vattu/${d.data.picture}" alt="Picture ${d.data.name}" width="500" height="300" style="object-fit: cover;">
                        </div>
                    `)
                    modalBody.html(html.join(''))
                })
        })
    }

    
    return mol;

    function guid() {
        return uuid.v4();
    }
                                                                                                            
    function saveFile(input, name) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function() {
            const dataURL = reader.result;
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = name;
            a.style.display = 'none'; // Ẩn thẻ <a> trên trang web
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a); // Xóa thẻ <a> khỏi trang web
                window.URL.revokeObjectURL(dataURL); // Giải phóng bộ nhớ
            }, 100);
        };
        reader.readAsDataURL(file);
        return true;
    }

    function renderTable () {
        const url = "http://52.76.57.212:6006/db/item/read_all";
        // lay danh sach vat tu
        let th = `<thead><tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên vật tư</th>
                    <th scope="col">Bộ phận</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Quản lý</th>
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
                <td>${x.data.bo_phan}</td>
                <td>${x.data.gia}</td>
                <td>${x.data.date}</td>
                <td>${x.data.quan_ly}</td>
                <td>
                    <button type="button" data-id='${x.qr_id}' data-nf='${x.data.date.replace(/\//g, "")}_${x.data.name}_${x.qr_id}' data-qr='${x.data.qr_string}' class="btn btn-primary btn-xuatQR" data-bs-toggle="modal" data-bs-target="#modalXuatQR">
                        Xuất QR
                    </button>
                    <button type="button" data-id='${x.qr_id}' class="btn btn-warning btn-suaVatTu" data-bs-toggle="modal" data-bs-target="#modalSuaVatTu">Sửa</button>
                    <button type="button" data-id='${x.qr_id}' class="btn btn-danger btn-xoaVatTu" data-bs-toggle="modal" data-bs-target="#modalXoaVatTu">
                        Xóa
                    </button>
                    <button type="button" data-id='${x.qr_id}' class="btn btn-secondary btn-chiTietVatTu" data-bs-toggle="modal" data-bs-target="#modalChiTietVatTu">
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

    // Tạo mã QR từ chuỗi văn bản
    function createQRCode(elm, text, width, height) {
        return new QRCode(elm, {
            text: text,
            width: width,
            height: height,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } 

    function expImageBase64(base64, name, width, height) {
        const base64_string = base64;
        const img = new Image();
        img.src = base64_string;
        img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = name;
        link.setAttribute('target', '_blank'); // Để hiển thị thông báo tải xuống
        link.setAttribute('rel', 'noopener noreferrer'); // Để bảo mật khi mở tệp
        link.click();
        };
    }


                                                                                                            
  
})();
$(document).ready(function () {
    danhSachVatTu.init();
})