INSERT INTO departments (name)
VALUES
('engineering'), -- 1
('sales'), -- 2
('human_resources'); -- 3

INSERT INTO roles (title, salary, department_id)
VALUES
('manager', 180000, NULL), -- 1
('junior_developer', 80000, 1), -- 2
('senior_developer', 110000, 1), -- 3
('team_leader', 140000, 1), -- 4
('salesperson', 100000, 2), -- 5
('lead_salesperson', 130000, 2), -- 6
('benefits_specialist', 90000, 3), -- 7
('policy_specialist', 95000, 3), -- 8
('safety_officer', 105000, 3); -- 9

INSERT INTO employees (first_name, last_name, role_id, manager_id, department_id, employee_salary)
VALUES
('Jenna', 'Saleh', 1, NULL, 1, 180000), -- dev manager
('Mike', 'Saleh', 1, NULL, 2, 180000), -- sales manager
('Mary', 'Saleh', 1, NULL, 3, 180000), -- HR manager
('David', 'Steiner', 2, 1, 1, 80000),
('Nick', 'Saleh', 3, 1, 1, 110000),
('Armin', 'NoIdeaHowToSpellIt', 4, 1, 1, 140000),
('Carter', 'Steiner', 5, 2, 1, 100000),
('Zac', 'Saleh', 6, 2, 2, 130000),
('Christina', 'Saleh', 7, 3, 2, 90000),
('Dana', 'Saleh', 8, 3, 3, 95000),
('Nate','Potter', 9, 3, 3, 105000);
