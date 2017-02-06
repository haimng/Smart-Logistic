## API: User

Name     | Endpoint
---------|------------------------------------------------
Signup   | [POST /api/user/signup](#post_user_signup)
Signin   | [POST /api/user/signin](#post_user_signin)
Signout  | [POST /api/user/signout](#post_user_signout)
Profile  | [GET /api/user/:id](#get_user_profile)
Update   | [PUT /api/user/me](#put_user_me)


### <a name="post_user_signup">POST /api/user/signup</a>

User signup with email and password. 

The success will response with a `sid` value, set it in the cookie name `_sid` for all requests in order to be authorized as a `user`.

**sample request**

```
curl -X POST "https://smartlogistic.info/api/user/signup" \
-H "Content-Type: application/json" \
-d '{
  "email": "a@b.com",
  "password": "password", 
  "first_name": "A", 
  "last_name": "B"
}'
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": {
    "first_name": "A",
    "last_name": "B",
    "display_name": "B A",
    "id": 2,
    "sid": "96c4a9ef-ce14-4d7c-8b59-aee30ff532d7"
  }
}
```


### <a name="post_user_signin">POST /api/user/signin</a>

User signin using email and password.

The success will response with a `sid` value, set it in the cookie name `_sid` for all requests in order to be authorized as a `user`.

**sample request**

```
curl -X POST "https://smartlogistic.info/api/user/signin" \
-H "Content-Type: application/json" \
-d '{
  "email": "a@b.com",
  "password": "password"
}'
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": {
    "id": 2,
    "first_name": "A",
    "last_name": "B",
    "display_name": "B A",
    "avatar": "",
    "cover": "",
    "birthdate": "",
    "sex": 0,
    "city": "",
    "intro": "",
    "site": "",
    "rc": 0,
    "lc": 0,
    "nc": "0",
    "role": "",
    "updated": "Tue Jan 31 2017 04:15:44 GMT+0700 (ICT)",
    "sid": "89f92655-17b5-45f4-9bb8-8014b2e6ff5d"
  }
}
```


### <a name="post_user_signout">POST /api/user/signout</a>

User signout.

**sample request**

```
curl -X POST "https://smartlogistic.info/api/user/signout" \
--cookie "_sid=89f92655-17b5-45f4-9bb8-8014b2e6ff5d"
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": ""
}
```


### <a name="get_user_profile">GET /api/user/:id</a>

Get a user profile.

**sample request**

```
curl -X GET "https://smartlogistic.info/api/user/1"
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": {
    "id": 2,
    "first_name": "A",
    "last_name": "B",
    "display_name": "B A",
    "avatar": null,
    "cover": null,
    "birthdate": null,
    "sex": 0,
    "city": null,
    "intro": null,
    "site": null,
    "rc": 0,
    "lc": 0,
    "nc": 0,
    "role": "",
    "updated": "2017-01-30T21:15:44.000Z"
  }
}
```


### <a name="put_user_me">PUT /api/user/me</a>

Update my profile.

**sample request**

```
curl -X PUT "https://smartlogistic.info/api/user/me" \
--cookie "_sid=96c4a9ef-ce14-4d7c-8b59-aee30ff532d7" \
-H "Content-Type: application/json" \
-d '{
  "prop": "display_name",
  "value": "B T A"
}'

```


**sample response**

```
{
  "status": "SUCCESS",
  "data": ""
}
```


