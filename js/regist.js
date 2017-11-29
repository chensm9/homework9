window.onload = function() {
  $('#reset').click(function() {
    $('input').val('');
  });

  $('#submit').click(function() {
    var username = $("#username").val();
    var id = $('#studentID').val();
    var phone = $('#phone').val();
    var mail = $('#mail').val();

    if (username == "" || id == ""||
        phone == "" || mail == "") {
      alert("提交失败，您还有部分内容未填写");
      return;
    }

    if (validUsername(username) && validID(id) && 
       validPhone(phone) && validMail(mail)) {
      $.ajax({
        url: "/",
        method: "POST",
        data: {
          username: $('#username').val(),
          id: $('#studentID').val(),
          phone: $('#phone').val(),
          mail: $('#mail').val()
        },
        success: function(data, textStatus, jqXHR) {
          alert(data);
          if (data == "注册成功") {
            window.location.href = "?username="+$("#username").val();
          }
        }
      });
    }
  });
}

function validUsername(username) {
  if (username.length < 6 || username.length > 18) {
    alert("注册失败， 用户名必须由6~18位英文字母、数字或下划线组成");
    return false;
  } else if (!/[a-z|A-Z]/.test(username[0])) {
    alert("注册失败， 用户名必须以英文字母开头");
    return false;
  } else {
    for (var i = 1; i < username.length; i++) {
      if (!/[a-z|A-Z|_|0-9]/.test(username[i])) {
        alert("注册失败， 用户名必须由英文字母、数字或下划线组成");
        return false;
      }
    }
  }
  return true;
}

function validID(id) {
  if (id.length != 8) {
    alert("注册失败，学号由8位数字组成");
    return false;
  } else if (id[0] == '0') {
    alert("注册失败，学号首字母不能为0");
    return false;
  } else {
    for (var i = 0; i < id.length; i++) {
      if (!/[0-9]/.test(id[i])) {
        alert("注册失败，学号必须数字组成");
        return false;
      }
    }
  }
  return true;
}

function validPhone(phone) {
  if (phone.length != 11) {
    alert("注册失败，电话号码须由11位数字组成");
    return false;
  } else if (phone[0] == '0') {
    alert("注册失败，电话号码首字母不能为0");
    return false;
  } else {
    for (var i = 0; i < phone.length; i++) {
      if (!/[0-9]/.test(phone[i])) {
        alert("注册失败，电话号码必须数字组成");
        return false;
      }
    }
  }
  return true;
}

function validMail(mail) {
  if (!/[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/.test(mail)) {
    alert("注册失败， 邮箱格式错误");
    return false;
  }
  return true;
}