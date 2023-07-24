INSERT INTO department (id, name)
VALUES
    (1, 'Human Resources'),
    (2, 'Marketing'),
    (3, 'Finance'),
    (4, 'Operations');

INSERT INTO role (id, title, salary, department_id)
VALUES
    (1, 'HR Manager', 60000.00, 1),
    (2, 'HR Specialist', 45000.00, 1),
    (3, 'Marketing Manager', 65000.00, 2),
    (4, 'Marketing Analyst', 50000.00, 2),
    (5, 'Finance Manager', 70000.00, 3),
    (6, 'Finance Analyst', 55000.00, 3),
    (7, 'Operations Manager', 75000.00, 4),
    (8, 'Operations Specialist', 60000.00, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'John', 'Doe', 1, NULL),
    (2, 'Jane', 'Smith', 2, 1),
    (3, 'Michael', 'Johnson', 2, 1),
    (4, 'Emily', 'Williams', 3, NULL),
    (5, 'David', 'Brown', 4, 3),
    (6, 'Sarah', 'Davis', 5, NULL),
    (7, 'Robert', 'Miller', 6, 5),
    (8, 'Karen', 'Anderson', 7, NULL),
    (9, 'Kevin', 'Wilson', 8, 7);