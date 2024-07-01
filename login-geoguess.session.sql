CREATE DATABASE mydatabase;
USE mydatabase;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

USE mydatabase
select * from users 

DELETE FROM users WHERE created_at < '2024-06-29';

ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL;


ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users MODIFY created_at DATE NOT NULL DEFAULT CURRENT_DATE;



ALTER TABLE users DROP COLUMN created_at;

ALTER TABLE users ADD created_at DATE NOT NULL;

ALTER TABLE users ADD created_at DATE NOT NULL DEFAULT CURRENT_DATE;

ALTER TABLE users ADD created_at DATE NOT NULL DEFAULT CURRENT_DATE();


-- Exemplo de atualização para uma data válida, como a data atual
UPDATE users SET created_at = CURRENT_DATE() WHERE created_at = '0000-00-00';

ALTER TABLE users ADD created_at DATE NOT NULL DEFAULT CURRENT_DATE();

UPDATE users SET created_at = CURRENT_DATE();

ALTER TABLE users ADD created_at DATE NOT NULL;