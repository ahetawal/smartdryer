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
			    subject: "Your Dryer if off now",
			    text: "Dryer Notification",
			    html: "<b>Smart Dryer for Smart People !!</b>"
			};


var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var memjs = require('memjs');
var storage = memjs.Client.create();


storage.set('receivedAt', JSON.stringify(new Date()));


app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
      
    var queryParam = request.query.state;
    console.log("Query param is : " + queryParam);
    
    storage.get('receivedAt', function(err, data){
	    if(err) {
			console.log("Error getting data from cache");
			console.log(err);
	    } else {
			var dateAt = new Date(JSON.parse(data));
			console.log("From cache : " + dateAt);
			sendMail(response);
	    }
    });
});

var sendMail = function(response) {
	smtpTransport.sendMail(mail, function(error, response1) {
		if (error) {
		 	console.log(error);
		 	response.send(error);
		} else {
	  		console.log('Message sent');
	  		response.send(cool());
		}
	});
};


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


