var inquirer = require('inquirer');
inquirer
  .prompt([
    /* Pass your questions in here */
    'hi?'
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
  });