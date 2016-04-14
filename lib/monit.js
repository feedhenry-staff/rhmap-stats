module.exports={
  start:start,
  stop:stop
}
function start(session,type,interval){
  if (!session.monit){
    session.monit={};
  }
  if (session.monit[type]){
    stop(session,type);
  }
  if (session[type] && typeof session[type] === "function"){
    session.monit[type]=setInterval(function(){
        session[type]();
    },interval);
    session[type]();
  }
}


function stop(session,type){
  if (session.monit && session.monit[type]){
    clearInterval(session.monit[type]);
  }
}
