CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL DEFAULT 'Специалист',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    email VARCHAR(255) DEFAULT '',
    phone VARCHAR(100) DEFAULT '',
    birth_date DATE,
    hired_at DATE,
    location VARCHAR(255) DEFAULT '',
    about TEXT DEFAULT '',
    avatar_color VARCHAR(100) DEFAULT 'from-emerald-500 to-teal-700',
    tasks_done INTEGER DEFAULT 0,
    tasks_in_progress INTEGER DEFAULT 0,
    reports INTEGER DEFAULT 0,
    efficiency INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (full_name, position, status, email, phone, birth_date, hired_at, location, about, avatar_color, tasks_done, tasks_in_progress, reports, efficiency) VALUES
('Соколов Андрей Викторович', 'Начальник отдела', 'active', 'a.sokolov@geomonitor.ru', '+7 (495) 120-45-01', '1976-03-14', '2009-06-01', 'Москва, каб. 401', 'Руководит отделом, отвечает за стратегию мониторинга геологической информации и взаимодействие с профильными ведомствами.', 'from-emerald-500 to-teal-700', 214, 6, 48, 96),
('Морозова Елена Сергеевна', 'Заместитель начальника отдела', 'business_trip', 'e.morozova@geomonitor.ru', '+7 (495) 120-45-02', '1982-09-27', '2012-02-15', 'Москва, каб. 402', 'Координирует оперативную работу специалистов, контролирует качество и сроки подготовки аналитических отчётов.', 'from-sky-500 to-indigo-700', 187, 9, 41, 92),
('Гаврилов Дмитрий Олегович', 'Главный специалист', 'active', 'd.gavrilov@geomonitor.ru', '+7 (495) 120-45-03', '1988-11-05', '2015-09-10', 'Москва, каб. 405', 'Ведёт сбор и первичную обработку данных геологического мониторинга, отвечает за аналитику по региональным участкам.', 'from-amber-500 to-orange-700', 156, 11, 33, 89);