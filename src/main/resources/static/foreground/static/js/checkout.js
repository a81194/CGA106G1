const memNo = 10;
console.log('memNo = ' + memNo);
setMemDataBymemNo(memNo);
showProduct();


//結帳
$('#button_submit').click(e => {
    e.preventDefault();
    // type must be the samew
    Swal.fire({
        title: "是否確定送出?",
        text: "送出後即無法改變內容",
        icon: "warning",
        showCancelButton: true
    }).then(function (result) {
        if (result.value) {
            if (checkForm()) {
                //會員編號10的訂單
                insertOrderBymemNo(memNo);
                shoppingcart.splice(0, shoppingcart.length);
                localStorage.setItem('shoppingcart', JSON.stringify(shoppingcart))
                Swal.fire({
                    title: "感謝您的購買!",
                    icon: "success" //success/info/warning/error/question
                }).then(function (result) {
                    if (result.value) {
                        window.location.href = "/foreground/shop.html"
                    };
                });
            } else {
                checkForm()
                Swal.fire({
                    title: "資料格式未齊全，請重新嘗試!",
                    icon: "error"   //success/info/warning/error/question
                })
            }
        }
    })
});



//獲取會員回饋金
let coupon = 0;
fetch(`/mem/find-one?id=${memNo}`,{
    method:"GET"
}).then(response=>response.json()
).then(data=>{
    coupon = +data.coupon;
})


//回饋金input即時抓取
$("#inputUseCoupon").blur(() => {
    $("#useCoupon").text($("#inputUseCoupon").val());
    sumActulAmount()
});



//前端即時錯誤驗證
$("#recipient").blur(checkRecipient);
$("#recipientAddres").blur(checkRecipientAddres);
$("#recipientPh").blur(checkRecipientPh);
$("#inputUseCoupon").blur(checkUseCoupon);


//信用卡輸入框
$("#ordPayStatus").change(() => {
    if ($("#ordPayStatus").val() === '2') {
        $("#input-creidtCard").show();
    } else {
        $("#input-creidtCard").hide();
    }
})
//到店取貨時，地址定在商家地址並隱藏地址input，並且改變運費金額
$("#ordPick").change(() => {
    if (+$('#ordPick').val() === 0) {
        $("#recipientAddres").val("店面取貨");
        $("#input-addres").hide();
        $("#ordFee").text("0")
        sumActulAmount()
    } else if (+$('#ordPick').val() === 1) {
        $.get(`/mem/find-one?id=${memNo}`, function (result) {
            $("#recipientAddres").val(result.memAddress);
        })
        $("#input-addres").show();
        $("#ordFee").text("75")
        sumActulAmount()
    } else if (+$('#ordPick').val() === 2) {
        $.get(`/mem/find-one?id=${memNo}`, function (result) {
            $("#recipientAddres").val(result.memAddress);
        })
        $("#input-addres").show();
        $("#ordFee").text("100")
        sumActulAmount()
    }
})

// =================== function start =========================

//新增訂單
function insertOrderBymemNo(memNo) {
    const totalAmount = sumTotalAmount();
    const ordFormData = {
        "memNo": +memNo,
        "useCoupon": +$("#useCoupon").text(),
        "ordFee": +$("#ordFee").text(),
        "ordPick": +$("#ordPick").val(),
        "totalAmount": +totalAmount,
        "actualAmount": +$("#actualAmount").text(),
        "recipient": $("#recipient").val(),
        "recipientAddres": $("#recipientAddres").val(),
        "recipientPh": $("#recipientPh").val()
    }
    // Send form data as POST request
    fetch('/ord/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ordFormData),
    }).then((response) => {
        return response.text();
    }).then((ordNo) => {
        for (i = 1; i <= shoppingcart.length; i++) {
            let productMoney = document.querySelector(`#productMoney${i}`).textContent
            let qty = document.querySelector(`#qty${i}`).textContent
            let proPDM = productMoney / qty;
            let pdNo = document.querySelector(`#pdNo${i}`).textContent

            saveOrdList(+ordNo, +pdNo, +qty, +proPDM);
        }
    }).catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });
}



// 新增訂單明細
function saveOrdList(ordNo, pdNo, qty, price) {
    const ordListData = {
        "ordNo": +ordNo,
        "pdNo": +pdNo,
        "qty": +qty,
        "price": +price
    };
    fetch('/ordList/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ordListData),
    }).then(response => {
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

// 驗證收件人姓名
function checkRecipient() {
    const recipientInput = document.getElementById("recipient");
    const recipientError = document.getElementById("recipientError");
    const recipientRegex = /^[(\u4e00-\u9fa5)(a-zA-Z0-9_)]{2,10}$/;

    if (recipientInput.value.trim() === "") {
        recipientError.textContent = "請輸入收件人名稱";
        return false;
    } else if (!recipientRegex.test(recipientInput.value.trim())) {
        recipientError.textContent = "只能是中、英文字母、數字和_ , 且長度必需在2到10之間";
        return false;
    } else {
        recipientError.textContent = "";
        return true;
    }
}

// 驗證收件/超商地址
function checkRecipientAddres() {
    const recipientAddresInput = document.getElementById("recipientAddres");
    const addresError = document.getElementById("addresError");
    if (+$('#ordPick').val() === 0) {
        addresError.textContent = ""
        return true
    }

    if (recipientAddresInput.value.trim() === "") {
        addresError.textContent = "請輸入收件/超商地址";
        return false;
    } else {
        addresError.textContent = "";
        return true;
    }
}

// 驗證收件人電話
function checkRecipientPh() {
    const recipientPhInput = document.getElementById("recipientPh");
    const phError = document.getElementById("PhError");
    const phoneRegex = /^09\d{8}$/;

    if (recipientPhInput.value.trim() === "") {
        phError.textContent = "請輸入收件人電話";
        return false;
    } else if (!phoneRegex.test(recipientPhInput.value.trim())) {
        phError.textContent = "請輸入正確的電話號碼格式 ex:0912345678";
        return false;
    } else {
        phError.textContent = "";
        return true;
    }
}
//驗證回饋金
function checkUseCoupon() {
    const inputUseCoupon = document.getElementById("inputUseCoupon");
    const inputUseCouponError = document.getElementById("inputUseCouponError");
    const inputUseCouponRegex = /^[0-9]+$/;

    if (inputUseCoupon.value.trim() === "") {
        inputUseCouponError.textContent = "請輸入回饋金數量";
        return false;
    } else if (!inputUseCouponRegex.test(inputUseCoupon.value.trim())) {
        inputUseCouponError.textContent = "只能輸入大於等於0的整數數量";
        return false;
    }  else if (inputUseCoupon.value.trim() > coupon)  {
        inputUseCouponError.textContent = "輸入數值請勿超過所擁有的回饋金";
        return false;
    } else {
        inputUseCouponError.textContent = "";
        return true;
    }
}


// 驗證表單
function checkForm() {
    const recipientValid = checkRecipient();
    const recipientAddresValid = checkRecipientAddres();
    const recipientPhValid = checkRecipientPh();
    const useCouponValid = checkUseCoupon();

    return (recipientValid && recipientAddresValid && recipientPhValid && useCouponValid);
}

// 獲取會員資料並放入輸入框
function setMemDataBymemNo(memNo) {
    fetch(`/mem/find-one?id=${+memNo}`, {
        method: 'GET'
    }).then(request => {
        return request.json()
    }).then(memData => {
        $("#recipient").val(memData.memName)
        $("#recipientAddres").val(memData.memAddress);
        $("#recipientPh").val(memData.memPhone);
    })
}

//計算應付金額
function sumActulAmount() {
    const totalAmount = sumTotalAmount();
    $("#actualAmount").text(totalAmount + (+$("#ordFee").text()) - (+$("#useCoupon").text()));
}
//計算產品總金額
function sumTotalAmount() {
    const productMoneyList = $("[id^='productMoney']")
    let totalAmount = 0;
    for (productMoney of productMoneyList) {
        totalAmount += +productMoney.innerText;
    }
    return +totalAmount;
}


//獲取購物車商品
function showProduct() {
    const producttBody = document.querySelector("#productTable")
    let str = '';
    producttBody.innerHTML = '';
    let n = 1;
    for (item of shoppingcart) {
        const qty = item.qty;
        const pdNo = item.pdNo
        fetch(`/product/find-one?id=${pdNo}`, {
            method: "GET"
        }).then(response => response.json()
        ).then(data => {
            str += ` <tr class="cart_item">
                        <td id = "pdNo${n}" style = "display:none">${pdNo}</td>
                        <td class="cart-product-name"><span>${data.pdName}<strong class="product-quantity">× </strong><strong id="qty${n}" class="product-quantity">${qty}</strong></span></td>
                        <td class="cart-product-total text-center">$<span id="productMoney${n++}" class="amount">${qty * data.pdPrice}</span></td>
                    </tr>`;

            producttBody.innerHTML = str;
            sumActulAmount()
        });
    }
}


