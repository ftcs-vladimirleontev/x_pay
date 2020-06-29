
####Registration
```http request
POST /registration HTTP/1.1
Origin: http://host
Content-Type: application/json

{
  "user": {
    "email": "thinker.ne@gmailcom",
    "plainPassword": "qwerty1"
  }
}
```

####Verification
 ```http request
GET /user/verification HTTP/1.1
Authorization: Bearer <token>
```

####Login
 ```http request
POST /login HTTP/1.1
Content-Type: application/json

{
  "email": "thinker.ne@gmail.com",
  "password": "qwerty123"
}
```