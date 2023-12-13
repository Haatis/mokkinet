DROP DATABASE IF EXISTS cabin_db;
CREATE DATABASE cabin_db;
USE cabin_db;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE cabins (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(4, 0) NOT NULL CHECK (price >= 0 AND price <= 9999),
    image VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    capacity INT NOT NULL CHECK (capacity >= 1 AND capacity <= 99),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reviews (
    id INT NOT NULL AUTO_INCREMENT,
    cabin_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 10),
    comment TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (cabin_id) REFERENCES cabins(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_favorites (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    cabin_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_user_cabin (user_id, cabin_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (cabin_id) REFERENCES cabins(id)
);

CREATE TABLE reservations (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    cabin_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (cabin_id) REFERENCES cabins(id)
);


INSERT INTO users (username, email, password)
VALUES
    ('user1', 'user1@example.com', 'password1'),
    ('user2', 'user2@example.com', 'password2');

INSERT INTO cabins (user_id, name, description, price, image, location, region, capacity)
VALUES
    (1, 'Mökki 1', 'Mukava mökki metsässä', 250, 'mokki1.jpg', 'Oulu', 'Pohjois-Pohjanmaa', 5),
    (2, 'Mökki 2', 'Vuoristopako upealla näköalalla', 320, 'mokki2.jpg', 'Helsinki', 'Uusimaa', 10),
    (1, 'Mökki 3', 'Rustiikki mökki järven rannalla', 180, 'mokki3.jpg', 'Ruka', 'Lappi', 8),
    (2, 'Mökki 4', 'Syrjäinen erämökki', 290, 'mokki4.jpg' , 'Kuusamo', 'Lappi', 4),
    (1, 'Mökki 5', 'Viehättävä mökki', 200, 'mokki5.jpg' , 'Kuopio', 'Pohjois-Savo', 15),
     (2, 'Mökki 6', 'Moderni mökki', 240, 'mokki6.jpg' , 'Kalajoki', 'Pohjois-Pohjanmaa', 2);


INSERT INTO reviews (cabin_id, user_id, rating, comment)
VALUES
    (1, 1, 9.00, 'Hyvä mökki! Hieno sijainti'),
    (1, 2, 8.00, 'Mukava mutta, hieman kallis'),
    (2, 1, 9.50, 'Upeat näkymät ja viihtyisä mökki'),
    (3, 2, 7.20, 'Kaunis järvenrantamökki, mutta voisi olla siistimpi'),
    (4, 1, 9.50, 'Täydellinen erämaapaikka!'),
    (5, 2, 8.00, 'Viehättävä mökki pariskunnille'),
    (6, 1, 4.00, 'Liian pieni ja kallis');


INSERT INTO reservations (user_id, cabin_id, start_date, end_date)
VALUES
    (1, 1, '2023-11-15', '2023-11-20'),
    (2, 2, '2023-11-12', '2023-11-14'),
    (1, 5, '2023-11-10', '2023-11-12'),
    (2, 4, '2023-11-22', '2023-11-24'),
    (1, 3, '2023-11-05', '2023-11-07'),
    (2, 6, '2023-12-24', '2023-12-27');