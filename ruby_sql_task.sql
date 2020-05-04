-- DROP TABLE IF EXISTS project;
-- DROP TABLE IF EXISTS task;
-- 
-- 
CREATE TABLE project (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30) NOT NULL
)ENGINE=INNODB;

CREATE TABLE task (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30) NOT NULL,
status VARCHAR(30) NOT NULL,
project_id INT,
CONSTRAINT fk_project
    FOREIGN KEY (project_id) 
        REFERENCES project(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
)ENGINE=INNODB;


INSERT INTO project(name)
VALUES ('Garage'),('Pytahon'),('C'),('C++'),('C#'),('Ruaby');

INSERT INTO task(name,status,project_id)
VALUES ('A','Done',1),('Nigma','Done',4),('C','Done',5),('D','Done',1),('I','In proccess',6),('F','Begin',4),('G','Begin',1),
	   ('A','Begin',1),('J','In proccess',1),('K','In proccess',5),('Nigma','Done',1),
	   ('A','In proccess',4),('B','Begin',4),('C','Begin',5),('Nigma','In proccess',2),('I','Done',2),('F','Begin',2),('G','Begin',2),
	   ('A','Begin',2),('J','In proccess',4),('Nigma','Done',5),('L','In proccess',2),
	   ('A','Begin',3),('N','Done',3),('C','In proccess',1),('D','Begin',3),('N','Done',6),('F','Begin',3),('G','Begin',3),
	   ('A','In proccess',3),('Nigma','In proccess',1),('N','Done',1),('Nigma','Done',6),
	   
	   ('A','completed',6),('Nigma','completed',6),('N','completed',6),('Nigma','completed',6),('Nigma','completed',6),
		('A','completed',6),('Nigma','completed',6),('N','completed',6),('Nigma','completed',6),('Nigma','completed',6),
		('A','completed',6),('Nigma','completed',6),('N','completed',6),('Nigma','completed',6),('Nigma','completed',6);

SELECT * from task;
SELECT * from project;
-- 1)get all statuses, not repeating, alphabetically ordered
SELECT DISTINCT status FROM task ORDER BY status;
-- 2)get the count of all tasks in each project, order by tasks count descending
SELECT project.id ,  COUNT(task.project_id) 
FROM    project  
        LEFT JOIN task 
            ON task.project_id = project.id 
GROUP   BY  project.id 
ORDER  BY  COUNT(task.project_id) DESC ;

-- 3)get the count of all tasks in each project, order by projects names
SELECT project.id ,  COUNT(task.project_id) 
FROM    project  
        LEFT JOIN task 
            ON task.project_id = project.id 
GROUP   BY  project.id 
ORDER  BY  project.name ;

-- 4)get the tasks for all projects having the name beginning with "N" letter
SELECT task.project_id , task.name
FROM task 
	where task.name LIKE 'N%'

-- 5)get the list of all projects containing the 'a' letter in the middle of the name, 
-- and show the tasks count near each project. Mention that there can exist projects 
-- without tasks and tasks with project_id = NULL.
SELECT project.name,COUNT(task.project_id) 
from project 
left Join task on task.project_id = project.id
Where LENGTH(project.name)%2 <> 0 and SUBSTRING(project.name, CEIL((LENGTH(project.name)/2)), 1) LIKE 'a%'
Group By project.name;

-- 6) get the list of tasks with duplicate names. Order alphabetically
SELECT task.name 
FROM task
Group by task.name 
Having Count(*)>1
Order BY task.name;

-- 7)get list of tasks having several exact matches of both name and status, from the 
-- project 'Garage'. Order by matches count

select task.name, task.status,task.project_id
from task 
where task.project_id = garageId;


-- 8) get the list of project names having more than 10 tasks in status 'completed'. Order by project_id
SELECT project.id , project.name  ,task.project_id 
FROM    project  
        LEFT JOIN task 
            ON task.project_id = project.id 
            WHERE task.status = 'completed'
GROUP   BY  project.name
Having Count(task.status)>10
ORDER  BY  project.id ;

