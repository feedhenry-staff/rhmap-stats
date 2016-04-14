# RedHat Mobile Application system monitoring and stats lib
This lib is tighly related to RHMAP and can only work with RHMAP.

It is based on `stats-influxdb` lib

#Install
```
npm install --save rhmap-stats
```

#Usage Examples

## Monitor system stats
```js
//in RHMAP node.js app:
var stat=require("rhmap-stats");
var session=stat.init({
  host: "myInfluxDb", //influxdb hostname or ip address ,
  port: 4444 //influxdb udp port
});
stat.monit.start(session,"cpu",1000); //monitor vm cpu usage every 1000 ms
stat.monit.start(session,"mem",1000); //monitor vm mem usage every 1000 ms
stat.monit.start(session,"pidusage",1000); //monitor this process mem and cpu usage every 1000 ms
stat.monit.start(session,"disk",3600*1000); //monitor vm disk usage (/) every hour

```


## Simple Endpoint counter
```js
//as a middleware of a route
route.use(function(req,res,next){
  session.count("my_endpoint");
  next();
});
```
## Endpoint counter with parameters
```js
route.use(function(req,res,next){
  session.count("user_login", 1,["user="+req.query.userName]);
  next();
});
```

## Time elpase statistics
```js
// monitor database response
session.time("list_user_collection");
userCollection.find({},function(err,userList){
  session.timeEnd("list_user_collection");
});
```

#License
```
MIT
```
