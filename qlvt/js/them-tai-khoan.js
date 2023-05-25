var themVatTu = (function () {
    "use strict";
    var mol = {};

    mol.init = function () {
        var B = $('body');

        B.delegate('.btn-themTaiKhoan', 'click', function() {
            var inputsText = $('#form-createTaiKhoan input');
            const picture = $('#picture')[0];
            const file = picture.files[0];

            let data = inputsText.toArray().reduce((result, current) => {
                result[current.id] = current.value;
                return result;
            }, {});

        
            const id = guid()
            data['user_id'] = id;

            // save image
            if (file) {
                const name = guid();
                saveFile(picture, name);
                data[picture.id] = name + "." + picture.files[0].name.split(".").pop();
            }
            
            // create 
            $.ajax({
                type: 'POST',
                url: 'http://52.76.57.212:6006/db/user/insert',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: 'json',
                success: function(response) {
                    console.log('Success', response);
                    var url = `${location.origin}/qlvt/danh-sach-tai-khoan.html`;
                    $(location).attr("href", url);
                  },
                error: function(error) {
                  console.log('Error', error);
                }
            });

            
          

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
})();
$(document).ready(function () {
    themVatTu.init();

})