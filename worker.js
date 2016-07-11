require('dotenv').config();

var app = require('app'), 
    worker_id = process.env.ELECTRON_WORKER_ID;
 
app.on('ready', function() {
  
  // first you will need to listen the `message` event in the process object 
  process.on('message', function( data ){
    
    if ( !data ) return;
 
    // `electron-workers` will try to verify is your worker is alive sending you a `ping` event 
    if (data.workerEvent === 'ping') {
      // responding the ping call.. this will notify `electron-workers` that your process is alive 
      process.send({ workerEvent: 'pong' });
    } else if (data.workerEvent === 'task') { // when a new task is executed, you will recive a `task` event

      var started = Date.now();

      setTimeout( function(){

        process.send({
          workerEvent: 'taskResponse',
          taskId: data.taskId,
          response: {
            started: started
          }
        });        
      }, process.env.JOB_DURATION_MS );        
    }
  });
});