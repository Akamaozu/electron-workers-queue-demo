require('dotenv').config();

console.log('TOTAL JOBS TO RUN: ' + process.env.TOTAL_JOBS );
console.log('DURATION OF EACH JOB: ' + process.env.JOB_DURATION_MS + 'ms' );
console.log('-----' );

var app = require('app');  // Module to control application life.

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

  var workers = require('electron-workers')({
          
    connectionMode: 'ipc',
    pathToScript: './worker.js',
  });

  workers.start( function( startErr ){

    if( startErr ) throw startErr;

    var started = Date.now(),
        completed_jobs = 0;

    for (var i = process.env.TOTAL_JOBS - 1; i >= 0; i--) {
      
       workers.execute( null, function(err, data) {

        if( err ) return console.log( err );

        console.log( 'started: ' + data.started + ' | ended: ' + Date.now() );

        completed_jobs += 1;

        if( completed_jobs + 1 == process.env.TOTAL_JOBS ){

          console.log('-----');
          console.log('EXPECTED DURATION: ' + ( (process.env.TOTAL_JOBS / require('os').cpus().length) * (process.env.JOB_DURATION_MS / 1000) ) + ' secs');
          console.log('ACTUAL DURATION: ' + ( (Date.now() - started) / 1000 ) + ' secs');

          app.quit();
        }
      });
    };
  });
});