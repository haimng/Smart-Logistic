## API: Package

Name     | Endpoint
---------|------------------------------------------------
Create   | [POST /api/package](#post_package)
Track    | [GET /api/package/:id](#get_package)
Update   | [PUT /api/package/:id](#put_package)



### <a name="post_package">POST /api/package</a>

Create a package to send. 

The success will response with a security `code` value. `The first 6 characters` of this code will be used for authenticating the package between sender & receiver.

**sample request**

```
curl -X POST "https://smartlogistic.info/api/package" \
--cookie "_sid=59f313af-5e8e-4628-ba92-cbfe19d4803b" \
-H "Content-Type: application/json" \
-d '{
  "rid": "2",
  "title": "Title", 
  "description": "Description", 
  "price": "100000", 
  "size": "1",   
  "weight": "500"
}'
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": {
    "sid": 1,
    "rid": "2",
    "code": "10a357d6-03c8-4543-b82b-0c58a4ce147e",
    "title": "Title",
    "description": "Description",
    "price": "100000",
    "size": "1",
    "weight": "500"
  }
}
```




### <a name="get_package">GET /api/package/:id</a>

Track a package status.

**sample request**

```
curl -X GET "https://smartlogistic.info/api/package/1" \
--cookie "_sid=59f313af-5e8e-4628-ba92-cbfe19d4803b"
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": {
    "id": 1,
    "sid": 1,
    "rid": 2,
    "code": "10a357d6-03c8-4543-b82b-0c58a4ce147e",
    "priority": 0,
    "type": 0,
    "title": "Title",
    "description": "Description",
    "price": 100000,
    "size": 1,
    "weight": 500,
    "status": 0,
    "updated": "2017-02-06T21:17:36.000Z"
  }
}
```


### <a name="put_package">PUT /api/package/1</a>

Update a package. If `role` is user, only `sender` & `receiver` of this package can edit it.

**sample request**

```
curl -X PUT "https://smartlogistic.info/api/package/1" \
--cookie "_sid=59f313af-5e8e-4628-ba92-cbfe19d4803b" \
-H "Content-Type: application/json" \
-d '{
  "prop": "title",
  "value": "Title2"
}'
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": ""
}
```


