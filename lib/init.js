'use strict';

var env = require('env-var');
var os = require('os');

/**
params
{
host: String, //influxdb host ip or name
port: number //UDP port number
}
*/
var stats=require("stats-influxdb");
module.exports=function(params){
  var tags={
    "domain":env("FH_DOMAIN","unknown"),
    "app_id":env("FH_APPNAME","unknown"),
    "app_name":env("FH_TITLE","unknown"),
    "app_env":env("FH_ENV","unknown"),
    "hostname": os.hostname(),
    "app_type":env("FH_SERVICE_APP","false")=="true"?"service":"cloud",
    "millicore":env("FH_MILLICORE","unknown")
  }
  var session=stats.newSession({
    host:params.host,
    port:params.port,
    tags:tags
  });
  return session;
}
