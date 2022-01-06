INSERT INTO departments (name)
VALUES
('company'), -- 1
('engineering'), -- 2
('sales'), -- 3
('human_resources'); -- 4

INSERT INTO roles (title, salary, department_id)
VALUES
('manager', 180000, 1), -- 1
('junior_developer', 80000, 2), -- 2
('senior_developer', 110000, 2), -- 3
('team_leader', 140000, 2), -- 4
('salesperson', 100000, 3), -- 5
('lead_salesperson', 130000, 3), -- 6
('benefits_specialist', 90000, 4), -- 7
('policy_specialist', 95000, 4), -- 8
('safety_officer', 105000, 4); -- 9

INSERT INTO employees (first_name, last_name, role_id, manager_id, department_id)
VALUES
('Jenna', 'Saleh', 1, NULL, 2), -- dev manager
('Mike', 'Saleh', 1, NULL, 3), -- sales manager
('Mary', 'Saleh', 1, NULL, 4), -- HR manager
('David', 'Steiner', 2, 1, 2),
('Nick', 'Saleh', 3, 1, 2),
('Armin', 'NoIdeaHowToSpellIt', 4, 1, 2),
('Carter', 'Steiner', 5, 2, 2),
('Zac', 'Saleh', 6, 2, 3),
('Christina', 'Saleh', 7, 3, 3),
('Dana', 'Saleh', 8, 3, 4),
('Nate','Potter', 9, 3, 4);
