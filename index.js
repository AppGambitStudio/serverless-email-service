const serverless  = require('serverless-http');
const express     = require('express');
const AWS         = require('aws-sdk');
const bodyParser  = require('body-parser');
const config      = require('./config/' + process.env.STAGE + '.json');

const app         = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const ses = new AWS.SES({
  region: config.region
});

app.get('/', (req, res) => {
  res.send('AWS SES - Email Webservice');
});

/**
 * Create a new SES Template based on the request data
 */
app.post('/template', (req, res) => {
  const { templateName, subject, body } = req.body;

  var params = {
    Template: { 
      TemplateName: templateName, 
      HtmlPart: body,
      SubjectPart: subject      
    }
  };

  ses.createTemplate(params, function(err, data) {
    if (err) {
      res.send(err);
    }else{
      res.send(200);
    }    
  });
});

/**
 * Update an SES Template based on the request data
 */
app.put('/template', (req, res) => {
  const { templateName, subject, body } = req.body;

  var params = {
    Template: { 
      TemplateName: templateName, 
      HtmlPart: body,
      SubjectPart: subject      
    }
  };

  ses.updateTemplate(params, function(err, data) {
    if (err) {
      res.send(err);
    }else{
      res.send(200);
    }    
  });
});

/**
 * Delete an SES Template based on the request data
 */
app.delete('/template', (req, res) => {
  const { templateName } = req.body;

  var params = {
    Template: { 
      TemplateName: templateName
    }
  };

  ses.deleteTemplate(params, function(err, data) {
    if (err) {
      res.send(err);
    }else{
      res.send(200);
    }    
  });
});

/**
 * Send Email via AWS SES using the request Template and data
 */
app.post('/send-email', (req, res) => {
  const { templateName, sendTo } = req.body;

  const params = {
    Template: templateName,
    Destination: { 
      ToAddresses: [
        sendTo
      ]
    },
    Source: config.SENDER_EMAIL,
    TemplateData: JSON.stringify({})
  };

  ses.sendTemplatedEmail(params, function(err, data) {
    if (err) {
      res.send(err);
    }else{
      res.send(200);
    }
  });

});

module.exports.handler = serverless(app);