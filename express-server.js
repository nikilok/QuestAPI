var express = require("express"),
 pjson = require('./package.json'),
  app = express(),
  port = parseInt(process.env.PORT, 10) || pjson.config.portno,
  daysToCache = 86400000 * 2; //86400000 = 1 day


app.configure(function () {
  app.use(express.compress());//gZip compression
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public', { maxAge: daysToCache }));
  app.use(app.router);
});



/***-----------HOLDS API ------------***/

var test_map = {
    '1': { "id": 1, "firstName": "Pepper", "lastName": "Thomas" },
    '2': { "id": 2, "firstName": "Vinny", "lastName": "The Poo" },
    '3': { "id": 3, "firstName": "Lorem", "lastName": "Ipsum" },
    '4': { "id": 4, "firstName": "David", "lastName": "And Goliath" },
    '5': { "id": 5, "firstName": "Spider", "lastName": "Man" }
};

var ReferentialStatus = [
{ "Id": 1, "Code": "Abc", "Name": "Test" },
{ "Id": 2, "Code": "Abc 1", "Name": "Test1" },
{ "Id": 3, "Code": "Abc 2", "Name": "Test2" },
{ "Id": 4, "Code": "Abc3", "Name": "Test3" },
{ "Id": 5, "Code": "Abc4", "Name": "Test4" },
{ "Id": 6, "Code": "Abc5", "Name": "Test5" },
{ "Id": 7, "Code": "Abc6", "Name": "Test6" },
{ "Id": 8, "Code": "Abc7", "Name": "Test7" }
];

var RoleList = [
{ "Id": 1, "Code": "Abc", "Name": "Administrator" },
{ "Id": 2, "Code": "DH", "Name": "Discipline" },
{ "Id": 3, "Code": "Abc 2", "Name": "Reader" },
{ "Id": 4, "Code": "Abc 3", "Name": "Site Reader" }
];

var DisciplineList = [
{ "Id": 1, "Code": "Abc", "Name": "Research" },
{ "Id": 2, "Code": "Abc 1", "Name": "SES ME" },
{ "Id": 3, "Code": "Abc 2", "Name": "CMC" },
{ "Id": 4, "Code": "Abc 3", "Name": "Civil" }
];

var ValidateUsers = {"nkuruvilla":true,
"rmohan":false,
"msamir":true
};

var tokens = [];
var authsuccess = {"state":true,"displayName":"Nikil Kuruvilla","token":"USOIFSUOFSLFUJOF"};
var authfail = {"state": false };

var UserList = [
{ "Id": 1, "Name": "Nikil Kuruvilla","Role":"Reader","Disp":"Research & Development"},
{ "Id": 2, "Name": "Sony Abraham", "Role": "Reader" },
{ "Id": 3, "Name": "James Peter", "Role": "Admin" },
{ "Id": 4, "Name": "David Beckham","Role": "Reader","Disp":"Civil Department" },
{ "Id": 5, "Name": "Ronaldo Dave","Role": "Discipline" },
{ "Id": 6, "Name": "Peter Gram", "Role": "Reader","Disp":"SES ME" },
{ "Id": 7, "Name": "Diana Pinto","Role": "Discipline" },
{ "Id": 8, "Name": "Brian David","Role": "Admin" }
];
 var lastID = 8;
/*
app.get('/api/testData', function(req, res) {
    res.send(test_map);
});



app.post('/api/testData', function(req, res) {
  //console.log('POST:'+req.body.firstName);
test_map.Test.push({"firstName":req.body.firstName,"lastName":req.body.lastName});
res.send('ok');
});
*/
 app.all('*', function (req, res, next) {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
     // intercept OPTIONS method
     if ('OPTIONS' == req.method) {
         res.send(200);
     }
     else {
         next();
     }
 });

 function checkToken(req) {
     if (tokens.indexOf(req.header('Authorization')) < 0)
         return false;
     else
         return true;
 }

/*Referential STATUS -API : START*****************************************************************/
//GET ALL DATA
 app.get('/api/Status', function (req, res) {
     if (checkToken(req)) {
         res.send(ReferentialStatus);
     }
     else
         res.send(404);
});

//Add New Item
 app.post('/api/Status', function (req, res) {
     if (checkToken(req)) {
         var temp = {};
         temp.Id = ReferentialStatus.length + 1;
         temp.Code = req.body.Code;
         temp.Name = req.body.Name;
         ReferentialStatus.push(temp);
         res.send('100');
     } else
         res.send(404);
});
//Update Item
 app.put('/api/Status/:Id', function (req, res) {
     if (checkToken(req)) {
         var temp = {};
         temp.Id = req.params.Id;
         temp.Code = req.body.Code;
         temp.Name = req.body.Name;
         //ReferentialStatus[temp.Id] = temp;
         for (item in ReferentialStatus) {
             if (req.params.Id == ReferentialStatus[item].Id)
                 ReferentialStatus[item] = temp;
         }
         res.send('100');
     } else
         res.send(404);
});
//Delete Item
 app.delete('/api/Status/:Id', function (req, res) {
     if (checkToken(req)) {
         //delete ReferentialStatus[req.params.id];
         for (item in ReferentialStatus) {
             if (req.params.Id == ReferentialStatus[item].Id)
                 ReferentialStatus.splice(item, 1);
         }
         res.send('100');
     } else
         res.send(404);
});
/*Referential STATUS -API : END*/

/*USER MANAGEMENT API**********************************************************************/
 app.get('/api/AccessLevel', function (req, res) {
     if (checkToken(req)) {
         res.send(RoleList);
     } else
         res.send(404);
});

 app.get('/api/Discipline', function (req, res) {
     if (checkToken(req)) {
         res.send(DisciplineList);
     } else
         res.send(404);
});


 app.post('/api/users/validateUser', function (req, res) {
     if (checkToken(req)) {
         res.send(ValidateUsers);
     } else
         res.send(404);
});

//GET ALL
 app.get('/api/Users', function (req, res) {
     if (checkToken(req)) {
         res.send(UserList);
     } else
         res.send(404);
});
//Add New Item
 app.post('/api/User', function (req, res) {
     if (checkToken(req)) {
         var temp = {};
         temp.Id = UserList.length + 1;
         temp.Name = req.body.Name;
         temp.UserId = req.body.UserId;
         UserList.push(temp);
         res.send('100');
     } else
         res.send(404);
});
//Update Item
 app.put('/api/Users/:Id', function (req, res) {
     if (checkToken(req)) {
         var temp = {};
         temp.Id = req.params.Id;
         temp.Name = req.body.Name;
         temp.UserId = req.body.UserId;
         //ReferentialStatus[temp.Id] = temp;
         for (item in UserList) {
             if (req.params.Id == UserList[item].Id)
                 UserList[item] = temp;
         }
         res.send('100');
     } else
         res.send(404);
});
//Delete Item
 app.delete('/api/Users/:Id', function (req, res) {
     if (checkToken(req)) {
         //delete ReferentialStatus[req.params.id];
         for (item in UserList) {
             if (req.params.Id == UserList[item].Id)
                 UserList.splice(item, 1);
         }
         res.send('100');
     } else
         res.send(404);
});

/*USER MANAGEMENT API : END*/
/*Authentication API**********************************************************************/
app.post('/api/auth', function (req, res) {
    var user = req.body.UserID;
    var pass = req.body.Password;
    if (user == "cdc_test1" && pass == "Technip08") 
       // res.send(authsuccess);
         res.send(allocateKey());
    else
        res.send(500);
});

app.get('/api/auth/logout', function (req, res) {
    if (checkToken(req)) {
        if (tokens.indexOf(req.header('Authorization')) >= 0) 
            tokens.splice(tokens.indexOf(req.header('Authorization')), 1);
        res.send(200);
    } else
        res.send(404);
});

var guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    }
    return function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };
})();

function allocateKey() {
    var key = guid();
    tokens.push(key);
    var obj = { "state": true, "displayName": "Nikil Kuruvilla", "token": key };
    return obj;
}

/*Authentication API END**********************************************************************/
app.listen(port);

console.log('Now serving the app at http://localhost:' + port + '/');