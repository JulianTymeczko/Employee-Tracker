const inquirer = require("inquirer");
const db = require("./db.js");
const actions = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
  new inquirer.Separator(),
  "Exit",
];

function askQuestion() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "query",
        message: "Select an action:",
        choices: actions,
      },
    ])
    .then(handleAnswer);
}

async function handleAnswer(ans) {
  const choice = ans.query;
  switch (choice) {
    case actions[0]:
      await db.getDepartments();
      break;
    case actions[1]:
      await db.getRoles();
      break;
    case actions[2]:
      await db.getEmployees();
      break;
    case actions[3]:
      await db.addDepartment();
      break;
    case actions[4]:
      await db.addRole();
      break;
    case actions[5]:
      await db.addEmployee();
      break;
    case actions[6]:
      await db.updateEmployeeRole();
      break;
    case actions[8]:
      db.end();
      return;
  }
  askQuestion();
}

// Start the program
askQuestion();
