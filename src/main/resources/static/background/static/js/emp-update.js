const noLookup = {
    'Admin': 1,
    'Manager': 2,
    'Others': 3
};

$(document).ready(() => {

    // get all dom element we need
    const employeeNo = $("#emp-update-no");
    const employeeName = $("#emp-update-name");
    const employeePhone = $("#emp-update-phone");
    const employeeAddress = $("#emp-update-addr");
    const employeeEmail = $("#emp-update-email");
    const employeePassword = $("#emp-update-pwd");
    const msgEmpNo = $('#msg-emp-no');
    const msgEmpName = $('#msg-emp-name');
    const msgEmpEmail = $('#msg-emp-email');
    const msgEmpPWD = $('#msg-emp-pwd');
    const msgEmpPhone = $('#msg-emp-phone');
    const msgEmpAddr = $('#msg-emp-addr');
    const employeeList = document.getElementById("emp-ls-all");

    // list all role
    fetch('/role/ls-all')
        .then(response => response.json()) // Parse the response as JSON
        .then(nameList => {
            let str = ''
            for (let i = 0; i < nameList.length; i++) {
                str += `<option value="${i + 1}">${nameList[i]}</option>`;
            }
            $('#emp-role-select').html('<select id="emp-role" class="default-select form-control wide border-dark">' + str + '</select>');
        });

    // list all employee
    fetch(`/emp/ls-all`)
        .then(response => response.json()) // promise -> data
        .then(employees => {
            findAll(employees);
        })

    /**
     * insert and update sanity checker
     */
    employeeNo.blur(e => {
        if (e.target.value.length == 0) {
            msgEmpNo.text('更新員工編號必填');
            return;
        }
        msgEmpNo.text('');
    })
    employeeName.blur(e => {
        // if (employeeName.val().length == 0) {
        if (e.target.value.length == 0) {
            msgEmpName.text('姓名為必填');
            return;
        }
        msgEmpName.text('');
    });
    employeeEmail.blur(e => {
        const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if(!emailRegex.test(e.target.value)) {
            msgEmpEmail.text('Email 格式不正確');
            return;
        }
        if (e.target.value.length == 0) {
            msgEmpEmail.text('Email 為必填');
            return;
        }

        // check if email is duplicated
        fetch(`/emp/login-check?email=${e.target.value}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(isDuplicate => {
                console.log(isDuplicate);
                if (isDuplicate) {
                    msgEmpEmail.text('此帳號已被使用');
                    return;
                } else {
                    msgEmpEmail.text('');
                }
            })
            .catch(error => {
                msgEmpEmail.text('');
            });
    });

    employeePassword.blur(e => {
        // if (employeeName.val().length == 0) {
        if (e.target.value.length == 0) {
            msgEmpPWD.text('密碼為必填');
            return;
        }
        msgEmpPWD.text('');
    });

    employeePhone.blur( e=> {
        const phoneRegex = /^09\d{8}$/;
        if (e.target.value == '') {
            msgEmpPhone.text("");
            return;
        }
        else if(!phoneRegex.test(e.target.value)) {
            msgEmpPhone.text("電話格式請以 09xx 開頭\nxx 共 8 碼");
            return;
        }
        msgEmpPhone.text("");
    })

    employeeAddress.blur( e => {
        const addressRegex = /.*(市|縣|州|鎮|區|道|路|街|巷)[^市縣區]+(路|街|巷)[^號]+號.*/;
        if (e.target.value == '') {
            msgEmpAddr.text("");
            return;
        } else if(!addressRegex.test(e.target.value)) {
            msgEmpAddr.text("請輸入正確地址");
            return;
        }
        msgEmpAddr.text("");
    })

    /**
     * update to database when submit
     */
    $('#emp-update-submit').click(() => {

        if (!employeeName.val() || !employeePassword.val() || !employeeEmail.val()) {
            return;
        }

        fetch('/emp/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'employeeNo': +employeeNo.val() - 1000, // 型態一定要對到
                'employeeName': employeeName.val(),
                'employeePhone': employeePhone.val(),
                'employeeAddress': employeeAddress.val(),
                'employeeEmail': employeeEmail.val(),
                'employeePassword': employeePassword.val(),
                'roleNo': +$('#emp-role option:selected').val(),
                'employeeStatus': $("#emp-onJob").prop('checked')
            })
        })
            .then(response => response.json())
            .then(ok => {
                const behavior = employeeNo.val().length == 0 ? '新增' : '更新';
                if (ok && msgEmpEmail.text() == '') {
                    swal.fire(behavior + '成功')
                } else {
                    swal.fire(behavior + '失敗')
                }
                // reset input after submit
                resetAllInput()
                fetch(`/emp/ls-all`)
                    .then(response => response.json()) // promise -> data
                    .then(employees => {
                        findAll(employees);
                    })
            })
    });


    /**
     * Edit employee info / auto insert update info to upper part table
     */
    employeeList.addEventListener('click', (e) => {
        const empId = parseInt(e.target.id.split('-')[2]);
        fetch(`/emp/ls-one?id=${empId}`)
            .then(response => response.json()) // promise -> data
            .then(emp => {
                employeeNo.val(emp.employeeNo + 1000);
                employeeName.val(emp.employeeName);
                employeeEmail.val(emp.employeeEmail);
                employeePassword.val(emp.employeePassword);
                employeePhone.val(emp.employeePhone);
                employeeAddress.val(emp.employeeAddress);
                document.querySelector("#emp-role-select select").value = `${emp.roleNo}`;
            })
    }, true);

    /**
     * Choice Add or Update
     */
    $('#emp-item-group').click(e => {
        if (e.target.id === 'btn-emp-add') {
            $('#emp-no-text').text('');
            $('#emp-update-no').attr('placeholder', 'ID generate automatically');
            employeeNo.val('');
            clearErrMsg();

        } else if (e.target.id === 'btn-emp-update') {
            clearErrMsg();
        }
    })

    function clearErrMsg() {
        msgEmpEmail.text('');
        msgEmpName.text('');
        msgEmpPWD.text('');
        msgEmpNo.text('');
    }

    function resetAllInput() {
        employeeNo.val('');
        employeeName.val('');
        employeePhone.val('');
        employeeAddress.val('');
        employeeEmail.val('');
        employeePassword.val('');
    }
})

// list all
function findAll(employees) {
    // let empTable = document.getElementById('emp-ls-all');
    $('#table-example').DataTable().clear().destroy();
    $('#table-example').DataTable().destroy();

    let tdString = "";
    for (const emp of employees) {
        tdString += `<tr >\n\n                    <td ><strong >${1e3 + emp.employeeNo}</strong></td>\n\n                    <td >\n\n                        <div class="d-flex align-items-center">\n\n                            <span class="w-space-no">${emp.employeeName}</span>\n\n                            <img src=""class="rounded-lg me-2"width="24"alt=""/>\n\n                        </div>\n\n                    </td>\n\n                    <td >${emp.employeeEmail}</td>\n\n                    <td >${emp.employeePhone}</td>\n\n                    <td >\n\n                        <div class="d-flex align-items-center">\n\n                            <i class="fa fa-circle ${emp.employeeStatus ? "text-success" : "text-danger"} me-1"></i>\n\n                            ${emp.employeeStatus ? "在職" : "離職"}\n\n                        </div>\n\n                    </td>\n\n                    <td >\n\n                        <div class="d-flex">\n\n                            <a id="emp-edit-${emp.employeeNo}"href="#"class="btn btn-primary shadow btn-xs sharp me-1 emp-edit-btn">\n\n                            <i id="emp-i-${emp.employeeNo}"class="fas fa-pencil-alt"></i></a>\n\n                        </div>\n\n                    </td>\n\n                </tr>`;
    }
    // empTable.innerHTML = tdString;
    $('#emp-ls-all').html(tdString);

    /**
     * add pagination
     * @type {*|jQuery}
     */
    $('#table-example').DataTable({
        paging: true,
        pageLength: 5,
        language: {
            paginate: {
                previous: '<i class="fa fa-chevron-left"></i>',
                next: '<i class="fa fa-chevron-right"></i>'
            }
        }
    });
}
