## API: Package

Name     | Endpoint
---------|------------------------------------------------
Create   | [POST /api/package](#post_package)
Track    | [GET /api/package/:id](#get_package)
Update   | [PUT /api/package/:id](#put_package)
Update status   | [PUT /api/package/:id/status](#put_package_status)
Package histories   | [GET /api/package/:id/history](#get_package_history)



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


### <a name="put_package">PUT /api/package/:id</a>

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


### <a name="put_package_status">PUT /api/package/:id/status</a>

Update a package's status.

- `new`: New package 
- `src_portal`: Dropped at source portal
- `delivering`: Delivering
- `dest_portal`: Dropped at destination portal
- `delivered`: Delivered

**sample request**

```
curl -X PUT "https://smartlogistic.info/api/package/1/status" \
--cookie "_sid=59f313af-5e8e-4628-ba92-cbfe19d4803b" \
-H "Content-Type: application/json" \
-d '{
  "status": "src_portal",
  "portal_id": 2,
  "note": "Dropped at source portal"
}'
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": ""
}
```


### <a name="get_package_history">GET /api/package/:id/history</a>

Get a package's histories.

**sample request**

```
curl -X GET "https://smartlogistic.info/api/package/1/history" \
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": [ 
   { 
    id: 66,
    pid: 41,
    uid: 41,
    portal_id: null,
    status: 'new',
    note: null,
    updated: '2017-02-16T02:53:53.000Z',
    package: { 
       id: 41,
       sid: 41,
       rid: 2,
       code: '50906194-7c58-4901-996b-98bbb939a9fe',
       priority: 0,
       type: 0,
       title: 'Title2',
       description: 'Description',
       price: 100000,
       size: 1,
       weight: 500,
       status: 'src_portal',
       updated: '2017-02-16T02:53:53.000Z' 
     } 
   },
   { 
    id: 67,
    pid: 41,
    uid: 41,
    portal_id: 41,
    status: 'src_portal',
    note: 'Dropped at source portal',
    updated: '2017-02-16T02:53:53.000Z',
    package: { 
       id: 41,
       sid: 41,
       rid: 2,
       code: '50906194-7c58-4901-996b-98bbb939a9fe',
       priority: 0,
       type: 0,
       title: 'Title2',
       description: 'Description',
       price: 100000,
       size: 1,
       weight: 500,
       status: 'src_portal',
       updated: '2017-02-16T02:53:53.000Z' 
    },
    portal: { 
       id: 41,
       role: '',
       first_name: 'A',
       last_name: 'B',
       display_name: 'A B 2',
       avatar: null,
       birthdate: null,
       sex: 0,
       state: null,
       city: null,
       address: null,
       phone: null,
       intro: null,
       website: null,
       nc: 0,
       capacity: 50,
       status: 0,
       updated: '2017-02-16T02:53:52.000Z' 
    } 
  } 
 ]      
}
```


