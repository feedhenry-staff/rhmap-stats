# About
Red Hat Mobile Application Platform (RHMAP) stats is a node.js library which enables RHMAP cloud application to create useful and virtualised statistic data.

# Requirement
This module itself does not do data persistent. The module connects to Influxdb which is a time series based database through UDP based line protocol.

To use this module, following components need to be pre-installed:

* Influxdb 0.9+ with UDP port open
* Grafana ~2.6 connected to the Influxdb

Red Hat mobile consulting team has a pre-built docker-compose file which automatically install the requirements.

# Performance
The module is built with performance in mind. It uses UDP as underlying protocol and optional callbacks.
The purpose is to keep the impact on system resource as minimum as possible.

# Installation
The module is merely a node.js npm package.
In RHMAP cloud applicaiton folder, run:
```
npm install --save rhmap-stats
```

# Use
In cloud application code, init the module with following statement:
```js
var stat=require("rhmap-stats");
var session=stat.init({
  host: "myInfluxDb", //influxdb hostname or ip address ,
  port: 4444 //influxdb udp port
});
```

## Monitor VM CPUs
To monitor all CPU cores of current cloud app running VM, add following line:
```js
stat.monit.start(session,"cpu",1000);
```

The `1000` above is the time interval on how often to collect data.

To reveal the data in Grafana,
* Add a new Graph to a row
* choose `cpu` as measurement
* choose your app name in the `app_name` list. alternatively, you can choose `app_id` as well.
* choose CPU core you want to monitor.

![choose_cpu](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_cpus_img1.png)

You can add multiple cores as multiple queries:

![choose_cpu](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_cpus_img2.png)

Ultimately, it will look like this:

![choose_cpu](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_cpus_img3.png)

## Monitor VM Memory
Same as VM cpus, it is able to monitor the VM memory usage of current VM where cloud app is running. In cloud app, add following line:
```js
stat.monit.start(session,"memory",1000);
```

In grafana,
* Add a new Graph to a row
* choose `mem` as measurement
* choose your app name in the `app_name` list.
* choose either `used` or `used_percent` as value to display. `used` will display absolute memory usage while `used_percent` will display percentage of current VM usage.

![choose_mem](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_mem_img1.png)

The data from module is Megabytes. Therefore, we need change the Unit of Y-Axes to Megabyte.

![choose_mem](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_mem_img2.png)

The graph should look like this

![choose_mem](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_mem_img3.png)

## Monitor VM Disk Usage
To monitor VM disk usage, add following line to cloud app:
```js
stat.monit.start(session,"disk",3600*1000);
```

**It is recommended to keep `Interval` bigger than 10 minutes to avoid unnessary I/O usage.**

In grafana,
* Add a new Graph to a row
* choose `disk` as measurement
* choose your app name in the `app_name` list.
* choose either `used` or `used_percent` as value to display. `used` will display absolute disk usage while `used_percent` will display percentage of current VM usage.

![choose_disk](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_disk_img1.png)

Change the unit to percent(0-100).

The graph should look like this

![choose_disk](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_disk_img2.png)

## Choose Cloud Environment
At most situation, it is needed to monitor a specific Cloud Environment as different environment may use different VMs.

The module will automatically create tag for current environment where cloud app is running.

In grafana, it is able to add `app_env` as `WHERE` clause:

![choose_disk](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_env_img1.png)

## Monitor Process Usage
Other than VM statistics, it is able to monitor CPU and Memory current Node.js process. Add following in to cloud app:
```js
stat.monit.start(session,"pidusage",1000);
```

This line will send current process's cpu and memory usage every 1000ms.

In grafana,
* Add a new Graph to a row
* choose `process` as measurement
* choose your app name in the `app_name` list and a `app_env`.
* choose either `cpu` or `mem` as value to display. `cpu` will display cpu usage in percentage (0-100).`mem` will display absolute app memory usage (in bytes)

![choose_disk](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_app_img1.png)


## Custom stats: counter
`counter` allows creating custom stats of how many times a `label` has been counted.

Some example usages:
* Counter for an endpoit
* Counter for customers
* Counter for user behaviour
* Stats for size of file uploading

### Usage
```js
session.count(<label>, value=1, [tags]);
```
Only the `label` is mandatory.

Examples:

```js
session.count("getQuote");   // add 1 to "getQuote" counter
session.count("user_login",1,["user="+req.query.userName]) // add 1 to "user_login" counter and tag "user" with specific userName. This allows us building query in Grafana
session.count("file_uploaded",fileSize) // an uploaded file received, record the size to "file_uploaded" label.
```

In grafana, there are a lot of ways to show counters:
* Single stat: this can be used to show total/avg/max counts of a label per minute / hour / day / week / month / year etc
* Table: this can be used show counts every half an hour etc.
* Graph: This can be used show a trend of counts over the time.

To build the query,
* Select `count` as measurement
* Choose your app name in `app_name`
* Choose a `label` of counter
* Then choose an appropriate aggregation algorithm according to needs .

![choose_disk](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_counter_img1.png)

A table stats will look as following:

![choose_disk](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_counter_img2.png)

## Custom stats: time elapsed
This module also provides a way to measure time elapsed during an operation.

The example usages are:
* Monitor 3rd party web service (SOAP) response time
* Monitor DB response time

### Usage
```js
session.time(<label>);
//some other options
session.timeEnd(<label>);
```
Example:
```js
session.time("list_user_collection");
userCollection.find({},function(err,userList){
  session.timeEnd("list_user_collection");
});
```

Same as `counter`, there are many ways to visualise time elapsed data in Grafana as well.

To build the query ,
* Select `timeElapsed` as measurement
* Choose your app name in `app_name`
* Choose a `label` of counter
* Then choose an appropriate aggregation algorithm according to needs .

![choose_disk](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_timeelapse_img1.png)

Below is an "endpoint response time punch card" graph:

![choose_disk](https://raw.githubusercontent.com/feedhenry-staff/rhmap-stats/doc/img/use_timeelapse_img2.png)
