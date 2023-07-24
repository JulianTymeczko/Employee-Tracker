const mysql = require("mysql2");
const config = require("./config.js");
const inquirer = require("inquirer");

const db = mysql.createConnection(config);

async function selectAll(table) {
  let results;
  await db
    .promise()
    .query("SELECT * FROM ??;", table)
    .then(([rows, fields]) => {
      results = rows;
    });
  return results;
}

async function getDepartments() {
  let data = await selectAll("department");
  console.table(data);
}

async function getRoles() {
  const sql = `SELECT role.id, role.title, role.salary, department.name as department
    FROM role LEFT JOIN department 
    ON role.department_id=department.id`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => console.table(rows));
}

async function getEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, 
  role.title, role.salary, department.name as department, CONCAT(em2.first_name,' ',em2.last_name) as manager
  FROM employee 
  LEFT JOIN role ON employee.role_id=role.id 
  LEFT JOIN department ON role.department_id=department.id
  LEFT JOIN employee as em2 ON employee.manager_id=em2.id;`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => console.table(rows));
}

async function addDepartment() {
  await inquirer
    .prompt({
      type: "input",
      name: "department",
      message: "What is the name of the department?",
    })
    .then(async (ans) => {
      if (!ans.department) return;
      await db
        .promise()
        .query("INSERT INTO department(name) VALUES(?);", ans.department)
        .then(([rows, fields]) => {
          console.log(`Added ${ans.department} to the database`);
        });
    });
}

async function addRole() {
  const departments = await selectAll("department").then((rows) =>
    rows.map((val) => val.name)
  );
  await inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
        validate(val) {
          if (isNaN(val)) {
            return "Please enter a number";
          }
          if (parseFloat(val) < 0) {
            return "Number must be positive";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "department",
        message: "Which department does the role belong to?",
        choices: departments,
      },
    ])
    .then(async (ans) => {
      let department_id;
      let department_sql = "SELECT id FROM department WHERE name=?;";
      await db
        .promise()
        .query(department_sql, ans.department)
        .then(([rows, fields]) => {
          department_id = rows[0].id;
        });

      if (!ans.role || !ans.salary || !ans.department) return;

      let insert_sql =
        "INSERT INTO role(title,salary,department_id) VALUES (?,?,?);";
      let params = [ans.role, parseFloat(ans.salary), department_id];
      await db
        .promise()
        .query(insert_sql, params)
        .then(([rows, fields]) => {
          console.log(`Added ${ans.role} to the database`);
        });
    });
}

async function addEmployee() {
  const roles = await selectAll("role").then((rows) =>
    rows.map((val) => val.title)
  );
  const employees = await selectAll("employee").then((rows) =>
    rows.map((val) => `${val.first_name} ${val.last_name}`)
  );
  await inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "first",
        filter(name) {
          return name.trim();
        },
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "last",
        filter(name) {
          return name.trim();
        },
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "role",
        choices: roles,
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "manager",
        choices: employees,
      },
    ])
    .then(async (ans) => {
      let role_id;
      const role_query = "SELECT id FROM role WHERE title=?";
      await db
        .promise()
        .query(role_query, ans.role)
        .then(([rows, fields]) => {
          role_id = rows[0].id;
        });

      let manager_id;
      if (ans.manager === "None") {
        manager_id = null;
      } else {
        const manager = ans.manager.split(" ");
        const manager_query =
          "SELECT id FROM employee WHERE first_name=? AND last_name=?;";
        await db
          .promise()
          .query(manager_query, manager)
          .then(([rows, fields]) => {
            manager_id = rows[0].id;
          });
      }

      const insert_query =
        "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)";
      const params = [ans.first, ans.last, role_id, manager_id];
      await db
        .promise()
        .query(insert_query, params)
        .then(([rows, fields]) => {
          console.log(`Added ${ans.first} ${ans.last} to the database`);
        });
    });
}

async function updateEmployeeRole() {
  const roles = await selectAll("role").then((rows) =>
    rows.map((val) => val.title)
  );
  const employees = await selectAll("employee").then((rows) =>
    rows.map((val) => `${val.first_name} ${val.last_name}`)
  );
  await inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee's role do you want to update?",
        name: "employee",
        choices: employees,
      },
      {
        type: "list",
        message: "Which role do you want to assign to the selected employee?",
        name: "role",
        choices: roles,
      },
    ])
    .then(async (ans) => {
      let role_id;
      const role_query = "SELECT id FROM role WHERE title=?";
      await db
        .promise()
        .query(role_query, ans.role)
        .then(([rows, fields]) => {
          role_id = rows[0].id;
        });

      let employee_id;
      let employee = ans.employee.split(" ");
      const employee_query =
        "SELECT id FROM employee WHERE first_name=? AND last_name=?;";
      await db
        .promise()
        .query(employee_query, employee)
        .then(([rows, fields]) => {
          manager_id = rows[0].id;
        });

      const update_query = "UPDATE employee SET role_id=? WHERE id=?";
      const params = [role_id, employee_id];
      await db
        .promise()
        .query(update_query, params)
        .then(([rows, fields]) => {
          console.log(`Updated ${ans.employee}'s role`);
        });
    });
}

function end() {
  db.end();
}

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  selectAll,
  addDepartment,
  addEmployee,
  addRole,
  updateEmployeeRole,
  end,
};
