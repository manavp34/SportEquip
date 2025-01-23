var express = require('express');
var router = express.Router();
/* GET about page. */
router.get('/', function(req, res, next) {
res.render('contact', { title: 'contact' });
});
/* GET Contact page */
router.get('/', function (req, res, next) {
    res.render('contact', { title: 'Contact' });
  });
  
  /* POST Contact form */
  router.post('/', function (req, res, next) {
    const { name, email, message } = req.body; // Extract form data
    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
  
    // Optionally, save the data or send an email here
  
    // Render the contact page with a success message
    res.render('contact', { title: 'Contact', success: true });
  });
  
module.exports = router;