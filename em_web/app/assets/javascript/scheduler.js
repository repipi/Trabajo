/* https://www.onsip.com/blog/avoiding-javascript-settimeout-and-setinterval-problems */

var Scheduler = (function () {
  var tasks = [];
  var minimum = 10;
  var timeoutVar = null;
  var output = {
    add: function (func, context, timer, once) {
      var iTimer = parseInt(timer);
      context = context &amp;&amp; typeof context === 'object' ? context : null;
      if(typeof func === 'function' &amp;&amp; !isNaN(iTimer) &amp;&amp; iTimer &gt; 0) {
        tasks.push([func, context, iTimer, iTimer * minimum, once]);
      }
    },
    remove: function (func, context) {
      for(var i=0, l=tasks.length; i&lt;l; i++) {
        if(tasks[i][0] === func &amp;&amp; (tasks[i][1] === context || tasks[i][1] == null)) {
          tasks.splice(i, 1);
          return;
        }
      }
    },
    halt: function () {
      if(timeoutVar) {
        clearInterval(timeoutVar);
      }
    }
  };
  var schedule = function () {
    for(var i=0, l=tasks.length; i&lt;l; i++) {
      if(tasks[i] instanceof Array) {
        tasks[i][3] -= minimum;
        if(tasks[i][3] &lt; 0) {
          tasks[i][3] = tasks[i][2] * minimum;
          tasks[i][0].apply(tasks[i][1]);
          if(tasks[i][4]) {
            tasks.splice(i, 1);
          }
        }
      }
    }
  };
  timeoutVar = setInterval(schedule, minimum);
  return output;
})();

module.exports=Scheduler;