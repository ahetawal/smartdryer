var express = require('express');
var cool = require('cool-ascii-faces');
var mailer = require("nodemailer");


var email_sender_id = process.env.email_sender_id;
var email_sender_pass = process.env.email_sender_pass;
var to = process.env.email_to;

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: email_sender_id,
        pass: email_sender_pass
    }
});

var mail = {
               from: "Smart Washer Notifications<smartDryer@gmail.com>",
	            //to: "sutthipong@gmail.com",
			    to: to,
			    subject: "Your Dryer is OFF now",
			    text: "Dryer Notification",
			    html: "<b>Smart Dryer for Smart People !!</b>"
			};


var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var Timeout = function (fn, time) {
    var timer = false;
    this.start = function () {
        if (!this.isRunning()){
        	console.log("Timer starting : " + new Date());
            timer = setTimeout(fn, time);
        } else {
        	this.stop();
        }
    };
    this.stop = function () {
        clearTimeout(timer);
        timer = false;
        console.log("Timer stopped : " + new Date());
    };
    this.isRunning = function () {
        return timer !== false;
    };
};

var sendMail = function() {
	smtpTransport.sendMail(mail, function(error, response1) {
		if (error) {
		 	console.log(error);
		 } else {
	  		console.log("SENDING EMAIL");
	  	}
		i.stop();
	});
};


var i = new Timeout(sendMail, 110000);



app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
      i.start();
      response.send(cool());
});




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


