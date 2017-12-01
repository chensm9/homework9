var path = require('path'),
    fs = require('fs'),
    querystring = require("querystring");

var MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'application/x-jpg'
}

var logger = {
  info: console.log,
  request: function (req, res, error) {
    var date = new Date().toUTCString();
    if (error) {
      logger.info(
        '[%s] "%s %s" Error (%s): "%s"',
        date, req.method, req.url,
        error.status.toString(), error.message
      );
    }
    else {
      logger.info(
        '[%s] "%s %s" "%s"',
        date, req.method, req.url,
        req.headers['user-agent']
      );
    }
  }
};
var user_array = new Array();

var server = require('http').createServer(function (req, res) {
  logger.request(req, res)
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
      var user_search = querystring.parse(req.url.substr(2)), file;
      if (!SearchUser(user_search)) {
        file = path.normalize('./html/index.html');
      } else {
        file = path.normalize('./html/details.html');
      }
      res.writeHead(200, {'Content-Type': MIME[path.extname(file)]});
      var rs = fs.createReadStream(file);
      rs.pipe(res);
    } else {
      var file = '.' + req.url;
      fs.exists(file, function (exists) {
        if (exists && file != "./") {
          console.log(path.extname(file));
          res.writeHead(200, {'Content-Type': MIME[path.extname(file)]});
          var rs = fs.createReadStream(file);
          rs.pipe(res);
        }
        else {
          file = './html/index.html'
          res.writeHead(200, {'Content-Type': MIME[path.extname(file)]});
          var rs = fs.createReadStream(file);
          rs.pipe(res);
        }
      })
    }
  }
});

server.listen(8000, 'localhost', function () {
  logger.info('Starting up server, listen port 8000');
  logger.info('Hit CTRL-C to stop the server');
});

function ifUnique (user, report) {
  for(var i = 0; i < user_array.length; i++) {
    if (user_array[i].username == user.username) {
      report.message = "注册失败，该用户名已被注册";
      return false;
    }
    else if (user_array[i].id == user.id) {
      report.message = "注册失败，该学号已被注册";
      return false;
    }
    else if (user_array[i].phone == user.phone) {
      report.message = "注册失败，该电话已被注册";
      return false;
    }
    else if (user_array[i].mail == user.mail) {
      report.message = "注册失败，该邮箱已被注册";
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

process.on('SIGINT', function () {
  logger.info('\nThe server stopped.');
  process.exit();
});