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


var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
      

    var mail = {
    	from: "Smart Washer Notifications<smartDryer@gmail.com>",
    	//to: "sutthipong@gmail.com",
    	to: to,
    	subject: "Your Dryer if off now",
    	text: "Dryer Notification",
    	html: "<b>Smart Dryer for Smart People !!</b>"
	}

	smtpTransport.sendMail(mail, function(error, response1) {
   	if (error) {
        console.log(error);
        response.send(cool());
   	} else {
        console.log('Message sent');
        response.send(cool());
   }
   });

      
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


