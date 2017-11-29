window.onload = function () {
  var search = window.location.href.match(/username=.*/);
  $.ajax({
    url: "/info",
    method: "POST",
    data: {
      information: search[0]
    },
    success: function(data) {
      if (data == "no such user") {
        window.location.href = "/";
      }
      var user = JSON.parse(data);
      $("#username").text(user.username);
      $("#id").text(user.id);
      $("#phone").text(user.phone);
      $("#mail").text(user.mail);
    }
  });
}