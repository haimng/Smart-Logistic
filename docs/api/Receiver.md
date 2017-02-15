## API: Receiver

Name     | Endpoint
---------|------------------------------------------------
Create   | [POST /api/receiver](#post_receiver)
List     | [GET /api/receiver/mine](#get_receiver_mine)
Get      | [GET /api/receiver/:id](#get_receiver)
Update   | [PUT /api/receiver/:id](#put_receiver)



### <a name="post_receiver">POST /api/receiver</a>

Create a receiver of a package including recipient information such as name, address and email. 

**sample request**

```
curl -X POST "https://smartlogistic.info/api/receiver" \
--cookie "_sid=59f313af-5e8e-4628-ba92-cbfe19d4803b" \
-H "Content-Type: application/json" \
-d '{
  "first_name": "Hải",
  "last_name": "Nguyễn", 
  "state": "Hà Nội", 
  "city": "Hà Nội", 
  "address": "Số 12, ngõ 172, phố Đội Cấn, quận Ba Đình",   
  "email": "a@b.com",
  "phone": "09012345678"
}'
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": { 
     id: 3,
     sid: 3,
     first_name: 'Hải',
     last_name: 'Nguyễn',
     state: 'Hà Nội',
     city: 'Hà Nội',
     address: 'Số 12, ngõ 172, phố Đội Cấn, quận Ba Đình',
     email: 'a@b.com',
     phone: '09012345678'
   }
}
```



### <a name="get_receiver_mine">GET /api/receiver/mine</a>

Get a list of my receivers.

**sample request**

```
curl -X GET "https://smartlogistic.info/api/receiver/mine" \
--cookie "_sid=59f313af-5e8e-4628-ba92-cbfe19d4803b"
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": [ 
    { 
       id: 4,
       sid: 4,
       first_name: 'Hải',
       last_name: 'Nguyễn',
       state: 'Hà Nội',
       city: 'Hà Nội',
       address: 'Số 12, ngõ 172, phố Đội Cấn, quận Ba Đình',
       email: 'a@b.com',
       phone: '09012345678',
       updated: '2017-02-14T02:02:12.000Z' 
    } 
  ]
}
```



### <a name="get_receiver">GET /api/receiver/:id</a>

Track a receiver status.

**sample request**

```
curl -X GET "https://smartlogistic.info/api/receiver/1" \
--cookie "_sid=59f313af-5e8e-4628-ba92-cbfe19d4803b"
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": { 
     id: 3,
     sid: 3,
     first_name: 'Hải',
     last_name: 'Nguyễn',
     state: 'Hà Nội',
     city: 'Hà Nội',
     address: 'Số 12, ngõ 172, phố Đội Cấn, quận Ba Đình',
     email: 'a@b.com',
     phone: '09012345678'
   }
}
```


### <a name="put_receiver">PUT /api/receiver/1</a>

Update a receiver. If `role` is user, only `sender` who is owner of this receiver can edit it.

**sample request**

```
curl -X PUT "https://smartlogistic.info/api/receiver/1" \
--cookie "_sid=59f313af-5e8e-4628-ba92-cbfe19d4803b" \
-H "Content-Type: application/json" \
-d '{
  "prop": "address",
  "value": "12/172 phố Đội Cấn, quận Ba Đình"
}'
```


**sample response**

```
{
  "status": "SUCCESS",
  "data": ""
}
```


