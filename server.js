var path = require('path'),
    fs = require('fs'),
    querystring = require("querystring"); 

var user_array = new Array();

require('http').createServer(function (req, res) {
  if (req.method == "POST") {
    if (req.url == "/info") {
      var data = '';
      req.on('data', function (chunk) {
        data += chunk;
      });
      req.on('end', function () {
        data = querystring.parse(data);
        var username = querystring.parse(data.information).username;
        res.end(SearchUserName(username));
      });
    } else {
      var content = '';
      req.on('data', function (chunk) {
        content += chunk;
      });
      req.on('end', function () {
        var user = querystring.parse(content);
        var report = {};
        report["message"] = "";
        ifUnique(user, report);
        res.end(report.message);
      });
    }
  }
  else {
    if (req.url[1] == '?') {
      var user_search = querystring.parse(req.url.substr(2));
      if (!SearchUser(user_search)) {
        var file = path.normalize('./html/index.html');
        res.writeHead(200, {'Content-Type': 'text/html'});
        var rs = fs.createReadStream(file);
        rs.pipe(res);
      }
      else {
        var file = path.normalize('./html/details.html');
        res.writeHead(200, {'Content-Type': 'text/html'});
        var rs = fs.createReadStream(file);
        rs.pipe(res);
      }
    } else if (req.url == "/favicon.ico") {
      res.end();
    } else {
      var file = path.normalize('.'+req.url);
      fs.exists(file, function (exists) {
        if (exists && file != "./") {
          res.writeHead(200);
          var rs = fs.createReadStream(file);
          rs.pipe(res);
        }
        else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          var rs = fs.createReadStream('./html/index.html');
          rs.pipe(res);
        }
      })
    }
  }
}).listen(8000, 'localhost');

function ifUnique (user, report) {
  for(var i = 0; i < user_array.length; i++) {
    if (user_array[i].username == user.username) {
      report.message = "注册失败，名字重复";
      return false;
    }
    else if (user_array[i].id == user.id) {
      report.message = "注册失败，学号重复";
      return false;
    }
    else if (user_array[i].phone == user.phone) {
      report.message = "注册失败，电话重复";
      return false;
    }
    else if (user_array[i].mail == user.mail) {
      report.message = "注册失败，邮箱重复";
      return false;
    }
  }
  report.message = "注册成功";
  user_array.push(user);
  return true;
}

function SearchUser(user) {
  if (user == undefined || user.username == undefined) 
    return false;
  for (var i = 0; i < user_array.length; i++) {
    if (user_array[i].username == user.username)
      return true;
  }
  return false;
}

function SearchUserName(username) {
  if (username == undefined) return "no such user";
  for (var i = 0; i < user_array.length; i++) {
    if (user_array[i].username == username)
      return JSON.stringify(user_array[i]);
  }
  return "no such user";
}