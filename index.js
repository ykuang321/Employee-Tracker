// Import library 
const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const logo = require('asciiart-logo');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company_db'
  },
  console.log(
    logo({
        name: 'Welcome',
        font: 'Speed',
        lineChars: 10,
        padding: 2,
        margin: 3,
        borderColor: 'grey',
        logoColor: 'bold-white',
        textColor: 'white',
    })
    .render()
  )
);

// initial function to get user commands
const init = () => {
    inquirer
    .prompt({
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: [
          'View All Departments',
          'View All Employees',
          'View All Roles',
          'View Employees by Manager',
          'View Employees by Department',
          'View Budget by Department',
          'Add Department',
          'Add Employee',
          'Add Role',
          'Update Employee Role',
          'Update Employee Manager',
          'Delete Department',
          'Delete Role',
          'Delete Employees',
          'Quit'
        ]
    })

    .then((data) => {
        //switch command to choose function call
        switch(data.command){

          case "View All Departments":
              viewAllDepartments();
              break;
      
          case "View All Employees":
              viewAllEmployees();
              break;
          
          case "View All Roles":
              viewAllRoles();
              break;

          case "View Employees by Manager":
            viewEmployeesByManager();
            break;

          case "View Employees by Department":
            viewEmployeesByDepartment();
            break;

          case "View Budget by Department":
            viewBudgetByDepartment();
            break;
      
          case "Add Department":
              addDepartment();
              break;
      
          case "Add Employee":
              addEmployee();
              break;
      
          case "Add Role":
              addRole();
              break;

          case "Update Employee Role":
            updateEmployeeRole();
            break;    
        
          case "Update Employee Manager":
              updateEmployeeManager();
              break;

          case "Delete Department":
            deleteDepartment();
            break;

          case "Delete Role":
            deleteRole();
            break;

          case "Delete Employees":
            deleteEmployee();
            break;
          
          case "Quit":
            db.end();
            console.log(
              logo({
                  name: 'Bye-Bye',
                  font: 'Speed',
                  lineChars: 10,
                  padding: 2,
                  margin: 3,
                  borderColor: 'grey',
                  logoColor: 'bold-white',
                  textColor: 'white',
              })
              .render()
            );
              break;
        }
    });
}

// View Departments Information
const viewAllDepartments = () => {

  const sql = `SELECT DISTINCT * FROM department`;

  db.query (sql, (err, result) => {
    if(err) throw err;
    console.log("\n");
    console.log("Department Information:");
    console.table(result);
    init();
  })
}

// View Employee Information
const viewAllEmployees = () => {

  const sql = `
  SELECT DISTINCT
  employee.id, employee.first_name, employee.last_name,
  role.title, role.salary,
  department.department_name,
  CONCAT(e.first_name, " ", e.last_name) AS manager
  FROM employee
  LEFT JOIN role
  ON employee.role_id = role.id
  LEFT JOIN department
  ON role.department_id = department.id
  LEFT JOIN employee AS e
  ON employee.manager_id = e.id
  `;

  db.query(sql, function(err, result){
    if(err) throw err;
    console.log("\n");
    console.log("Employee Information:");
    console.table(result);
    init();
  })
}

// View Roles Information
const viewAllRoles = () => {

  const sql = 'SELECT DISTINCT * FROM role;';

  db.query(sql, function(err,result){
    if(err) throw err;
    console.log("\n");
    console.log("Role Information:")
    console.table(result);
    init();
  })
}

// View Employees by Manager
const viewEmployeesByManager = () => {

  const sql = `
  SELECT DISTINCT
  employee.id, employee.first_name, employee.last_name, employee.manager_id,
  CONCAT(employee.first_name, " ", employee.last_name) AS manager
  FROM employee
  LEFT JOIN employee AS e
  ON employee.manager_id = e.id
  WHERE employee.manager_id IS NULL 
  `;

  db.query(sql, function(err,result){
    if(err) throw err;
    inquirer
    .prompt([
        {
          type: "list",
          name: "manager",
          message: `Which manager's employees would you like to view?`,
          choices: () => result.map((result) => {
            return result.manager;
          })
        }
      ])
    .then((data) => {

      const index = result.findIndex((result) => {
        return data.manager === result.manager
      });

      const sql = `
      SELECT DISTINCT
      employee.id, employee.first_name, employee.last_name,
      role.title, role.salary,
      department.department_name,
      CONCAT(e.first_name, " ", e.last_name) AS manager
      FROM employee
      LEFT JOIN role
      ON employee.role_id = role.id
      LEFT JOIN department
      ON role.department_id = department.id
      LEFT JOIN employee AS e
      ON employee.manager_id = e.id
      WHERE employee.manager_id = ${result[index].id}      
      `;

      db.query(sql, function(err, results){
        if(err) throw err;
        console.log("\n");
        console.log("Employee Information Based on Managers:")
        console.table(results)
        init();
      });
    })
  })
}

// View Employees by Department
const viewEmployeesByDepartment = () => {

  const sql = `SELECT DISTINCT * FROM department`;

  db.query(sql, function(err,result){
    if(err) throw err;
    inquirer
    .prompt([
        {
          type: "list",
          name: "department",
          message: `Which department's employees would you like to view?`,
          choices: () => result.map((result) => {
            return result.department_name;
          })
        }
    ])
    .then((data) => {

      const index = result.findIndex((result) => {
        return data.department === result.department_name
      });

      const sql = `
      SELECT DISTINCT
      employee.id, employee.first_name, employee.last_name,
      role.title, role.salary,
      department.department_name,
      CONCAT(e.first_name, " ", e.last_name) AS manager
      FROM employee
      LEFT JOIN role
      ON employee.role_id = role.id
      LEFT JOIN department
      ON role.department_id = department.id
      LEFT JOIN employee AS e
      ON employee.manager_id = e.id
      WHERE department.id = ${result[index].id}      
      `;

      db.query(sql, function(err, results){
        if(err) throw err;
        console.log("\n");
        console.log("Budget Information Based on Department:")
        console.table(results)
        init();
      });
    })
  })
}

// View Budget by Department
const viewBudgetByDepartment = () => {

  const sql = `SELECT DISTINCT * FROM department`;

  db.query(sql, function(err,result){
    if(err) throw err;
    inquirer
    .prompt([
        {
          type: "list",
          name: "department",
          message: `Which department's employees would you like to view?`,
          choices: () => result.map((result) => {
            return result.department_name;
          })
        }
      ])
      .then((data) => {

        const index = result.findIndex((result) => {
          return data.department === result.department_name
        });

        const sql = `
        SELECT
        SUM(salary), department.department_name
        FROM employee
        LEFT JOIN role
        ON employee.role_id = role.id
        LEFT JOIN department
        ON role.department_id = department.id
        WHERE department.id = ${result[index].id}      
        `;
  
        db.query(sql, function(err, results){
          if(err) throw err;
          console.log("\n");
          console.log("Budget Information Based on Department:")
          console.table(results)
          init();
        });
    })
  })
}

// Add New Department
const addDepartment = () => {
  inquirer
  .prompt([
      {
        type: "input",
        name: "department",
        message: `What is the name of the department?`,
      }
    ])
  .then((data) => {

    const sql = `
          INSERT INTO department(department_name) 
          VALUES ("${data.department}")`

    db.query(sql, function(err, results){
      if(err) throw err;
      viewAllDepartments();
    });
  })
}

// Add New Role
const addRole = () => {

  const select = `SELECT * FROM department`;

  db.query (select, (err, result) => {
    if(err) throw err;
    inquirer
    .prompt([
        {
          type: "input",
          name: "title",
          message: `What is the name of the role?`,
        },
        {
          type: "input",
          name: "salary",
          message: `What is the salary of the role?`,
        },
        {
          type: "list",
          name: "department",
          message: `Which department does this role belong to?`,
          choices: () => result.map((result) => {
            return result.department_name;
          })
        }
      ])

      .then((data) => {

        const departmentIndex = result.findIndex(idIndex = (result) => {
          return data.department === result.department_name
        });

        const addRole = `
              INSERT INTO role(title, salary, department_id) 
              VALUES ("${data.title}",
                      "${data.salary}",
                      ${result[departmentIndex].id})`
    
        db.query(addRole, function(err,results){
          if(err) throw err;
          viewAllRoles();
        });
      })
  }) 
}

// Add New Employee
const addEmployee = () => {

  const firstSql = `
  SELECT DISTINCT * FROM role;
  `;

  db.query(firstSql, (err, roleResult) => { 
    if(err) throw err;  

    const secondSql = `
    SELECT DISTINCT
    employee.id, 
    CONCAT(employee.first_name, " ", employee.last_name) AS manager
    FROM employee
    WHERE employee.manager_id IS NULL
    `;
  
    db.query(secondSql, (err, managerResult) => {
      if(err) throw err;  

      inquirer
      .prompt([
          {
            type: "input",
            name: "first_name",
            message: `What is the employee's first name?`,
          },
          {
            type: "input",
            name: "last_name",
            message: `What is the employee's last name?`,
          },
          {
            type: "list",
            name: "title",
            message: `What is the employee's role?`,
            choices: () => roleResult.map((roleResult) => {
              return roleResult.title;
            })  
          },
          {
            type: "list",
            name: "manager",
            message: `Who is the employee's manager?`,
            choices: () => managerResult.map((managerResult) => {
              return managerResult.manager;
          })
          }
        ])
    
      .then((data) => {
       
        const roleIdIndex = roleResult.findIndex(roleIndex = (roleResult) => {
          return data.title === roleResult.title
        });
  
        const managerIdIndex = managerResult.findIndex(managerIndex = (managerResult) => {
          return data.manager === managerResult.manager
        });
  
        const sql = `
              INSERT INTO employee(first_name, last_name, role_id, manager_id) 
              VALUES ("${data.first_name}",
                      "${data.last_name}",
                      ${roleResult[roleIdIndex].id},
                      ${managerResult[managerIdIndex].id});`
    
        db.query(sql, function(err,results){
          if(err) throw err;
          viewAllEmployees();
        });
      })
    })
  })
}

// Update Employee's Role
const updateEmployeeRole = () => {

  const firstSql = `
  SELECT 
  employee.id, role.title,
  CONCAT(employee.first_name, " ", employee.last_name) AS employee_name
  FROM employee
  LEFT JOIN role
  ON employee.role_id = role.id
  `;

  db.query(firstSql, (err, employeeResult) => { 
    if(err) throw err;    

    const secondSql = `
    SELECT * FROM role
    `;

    db.query(secondSql, function(err,roleResult){
      if(err) throw err;
      inquirer
      .prompt([
          {
            type: "list",
            name: "employee_name",
            message: `Which employee would you like to update?`,
            choices: () => employeeResult.map((employeeResult) => {
              return employeeResult.employee_name;
            })
          },
          {
            type: "list",
            name: "title",
            message: `What is the employee's new role (title)?`,
            choices: () => roleResult.map((roleResult) => {
              return roleResult.title;
            })
          }
      ])
      .then((data) => {

        const employeeIndex = employeeResult.findIndex((employeeResult) => {
          return data.employee_name === employeeResult.employee_name
        });

        const roleIndex = roleResult.findIndex((roleResult) => {
          return data.title === roleResult.title
        });

        const sql = `
        UPDATE employee
        SET employee.role_id = ${roleResult[roleIndex].id}
        WHERE employee.id = ${employeeResult[employeeIndex].id}
        `
        db.query(sql, function(err,results){
          if(err) throw err;
          viewAllEmployees();
        });
      })
    })
  })
}

// Update Employee's Manager
const updateEmployeeManager = () => {

  const firstSql = `
  SELECT DISTINCT
  employee.id,
  CONCAT(employee.first_name, " ", employee.last_name) AS employee_name
  FROM employee
  `;

  db.query(firstSql, (err, employeeResult) => { 
    if(err) throw err;    

    const secondSql = `
    SELECT DISTINCT
    employee.id, 
    CONCAT(employee.first_name, " ", employee.last_name) AS manager_name
    FROM employee
    WHERE employee.manager_id IS NULL
    `;

    db.query(secondSql, function(err,managerResult){
      if(err) throw err;
      inquirer
      .prompt([
          {
            type: "list",
            name: "employee_name",
            message: `Which employee would you like to update?`,
            choices: () => employeeResult.map((employeeResult) => {
              return employeeResult.employee_name;
            })
          },
          {
            type: "list",
            name: "manager_name",
            message: `Who is the employee's new manager?`,
            choices: () => managerResult.map((managerResult) => {
              return managerResult.manager_name;
            })
          }
      ])
      .then((data) => {

        const employeeIndex = employeeResult.findIndex((employeeResult) => {
          return data.employee_name === employeeResult.employee_name
        });

        const managerIndex = managerResult.findIndex((managerResult) => {
          return data.manager_name === managerResult.manager_name
        });

        const sql = `
        UPDATE employee
        SET employee.manager_id = ${managerResult[managerIndex].id}
        WHERE employee.id = ${employeeResult[employeeIndex].id}
        `
        db.query(sql, function(err,results){
          if(err) throw err;
          viewAllEmployees();
        });
      })
    })
  })
}

// Delete Department
const deleteDepartment = () => {

  const sql = `SELECT DISTINCT * FROM department`;

  db.query(sql, function(err,result){
    if(err) throw err;
    inquirer
    .prompt([
        {
          type: "list",
          name: "department",
          message: `Which department would you like to delete?`,
          choices: () => result.map((result) => {
            return result.department_name;
          })
        }
      ])
    .then((data) => {

      const index = result.findIndex((result) => {
        return data.department === result.department_name
      });

      const sql = `
      DELETE FROM department 
      WHERE department.id = ${result[index].id}
      `
      db.query(sql, function(err,results){
        if(err) throw err;
        viewAllDepartments();
      });
    })
  })
}

// Delete Role
const deleteRole = () => {

  const sql = 'SELECT DISTINCT * FROM role;';

  db.query(sql, function(err,result){
    if(err) throw err;
    inquirer
    .prompt([
        {
          type: "list",
          name: "title",
          message: `Which role would you like to delete?`,
          choices: () => result.map((result) => {
            return result.title;
          })
        }
      ])
    .then((data) => {

      const sql = `
      DELETE FROM role
      WHERE role.title = ?
      `
      db.query(sql, data.title, function(err,results){
        if(err) throw err;
        viewAllRoles();
      });
    })
  })
}

// Delete Employee
const deleteEmployee = () => {

  const sql = `
  SELECT
  employee.id, 
  CONCAT(employee.first_name, " ", employee.last_name) AS employee_name
  FROM employee`;

  db.query(sql, function(err,result){
    if(err) throw err;
    inquirer
    .prompt([
        {
          type: "list",
          name: "employee_name",
          message: `Which employee would you like to delete?`,
          choices: () => result.map((result) => {
            return result.employee_name;
          })
        }
      ])
    .then((data) => {

      const index = result.findIndex((result) => {
        return data.employee_name === result.employee_name
      });

      const sql = `
      DELETE FROM employee 
      WHERE employee.id = ${result[index].id}
      `
      db.query(sql, function(err,results){
        if(err) throw err;
        viewAllEmployees();
      });
    })
  })
}

init();