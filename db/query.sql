-- View Employee Query
-- SELECT 
-- employee.id, employee.first_name, employee.last_name,
-- role.title, role.salary,
-- department.department_name,
-- CONCAT(e.first_name, " ", e.last_name) AS manager
-- FROM employee
-- LEFT JOIN role
-- ON employee.role_id = role.id
-- LEFT JOIN department
-- ON role.department_id = department.id
-- LEFT JOIN employee AS e
-- ON employee.manager_id = e.id



-- Add Employee Query
-- SELECT 
-- employee.id, employee.first_name, employee.last_name, employee.manager_id,
-- role.id AS role_id, role.title, role.salary,
-- department.department_name,
-- CONCAT(employee.first_name, " ", employee.last_name) AS manager
-- FROM employee
-- LEFT JOIN role
-- ON employee.role_id = role.id
-- LEFT JOIN department
-- ON role.department_id = department.id
-- LEFT JOIN employee AS e
-- ON employee.manager_id = e.id


-- Select Manager Query
-- SELECT 
-- employee.id, employee.first_name, employee.last_name, employee.manager_id,
-- CONCAT(employee.first_name, " ", employee.last_name) AS manager
-- FROM employee
-- LEFT JOIN employee AS e
-- ON employee.manager_id = e.id
-- WHERE employee.manager_id IS NULL


-- View Employee by Manager
-- SELECT 
-- employee.id, employee.first_name, employee.last_name,
-- role.title, role.salary,
-- department.department_name,
-- CONCAT(e.first_name, " ", e.last_name) AS manager
-- FROM employee
-- LEFT JOIN role
-- ON employee.role_id = role.id
-- LEFT JOIN department
-- ON role.department_id = department.id
-- LEFT JOIN employee AS e
-- ON employee.manager_id = e.id
-- WHERE employee.manager_id = 1



-- View Employee by Department
-- SELECT 
-- employee.id, employee.first_name, employee.last_name,
-- role.title, role.salary,
-- department.department_name,
-- CONCAT(e.first_name, " ", e.last_name) AS manager
-- FROM employee
-- LEFT JOIN role
-- ON employee.role_id = role.id
-- LEFT JOIN department
-- ON role.department_id = department.id
-- LEFT JOIN employee AS e
-- ON employee.manager_id = e.id
-- WHERE department.id = 1


-- View Employee by Budget
-- SELECT
-- SUM(salary), department.department_name
-- FROM employee
-- LEFT JOIN role
-- ON employee.role_id = role.id
-- LEFT JOIN department
-- ON role.department_id = department.id
-- WHERE department.id = 1


-- Delete Department
-- DELETE FROM department 
-- WHERE department.id = 10

-- Select From Employee
-- SELECT DISTINCT
-- employee.id, 
-- CONCAT(employee.first_name, " ", employee.last_name) AS manager_name
-- FROM employee
-- WHERE employee.manager_id IS NULL

-- Delete From Employee
-- DELETE FROM employee 
-- WHERE employee.id = 1

-- Update Manager
-- UPDATE employee
-- SET employee.manager_id = 3
-- WHERE employee.id = 2


-- Update Role
-- UPDATE employee
-- SET employee.manager_id = 3
-- WHERE employee.id = 2


--
-- SELECT 
-- employee.id, employee.first_name, employee.last_name,
-- role.title
-- FROM employee
-- LEFT JOIN role
-- ON employee.role_id = role.id

    -- SELECT DISTINCT
    -- employee.id, 
    -- CONCAT(employee.first_name, " ", employee.last_name) AS manager_name
    -- FROM employee
    -- WHERE employee.manager_id IS NULL




