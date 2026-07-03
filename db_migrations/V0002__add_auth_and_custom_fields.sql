ALTER TABLE employees ADD COLUMN IF NOT EXISTS login VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT '';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '[]'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_login ON employees (login) WHERE login IS NOT NULL;

UPDATE employees SET login = 'sokolov', password = 'admin123' WHERE email = 'a.sokolov@geomonitor.ru' AND (login IS NULL OR login = '');
UPDATE employees SET login = 'morozova', password = 'pass123' WHERE email = 'e.morozova@geomonitor.ru' AND (login IS NULL OR login = '');
UPDATE employees SET login = 'gavrilov', password = 'pass123' WHERE email = 'd.gavrilov@geomonitor.ru' AND (login IS NULL OR login = '');