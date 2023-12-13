import express from "express";
import mysql2 from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

dotenv.config();

const app = express();
app.use("/uploads", express.static("public/uploads"));
app.use(cors());

const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(express.json());

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});

app.get("/", (req, res) => {
  res.send("Hello to Cabin API");
});

app.get("/api/cabins", (req, res) => {
  const sql = "SELECT * FROM cabins";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/api/reviews", (req, res) => {
  const sql = "SELECT * FROM reviews";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/reviews", (req, res) => {
  const { cabinId, userId, rating, comment } = req.body;
  const sql =
    "INSERT INTO reviews (cabin_id, user_id, rating, comment) VALUES (?, ?, ?, ?)";
  const values = [cabinId, userId, rating, comment];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting review: " + err);
      res.status(500).send("Failed to submit the review");
    } else {
      const insertedReviewId = result.insertId;
      res.status(200).json({ id: insertedReviewId });
    }
  });
});

app.delete("/api/reviews/:reviewId/:userId", (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.params.userId;

  const sql = `DELETE FROM reviews WHERE id = ${reviewId} AND user_id = ${userId}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete review" });
    } else if (result.affectedRows === 0) {
      res.status(403).json({ error: "Review not found or unauthorized" });
    } else {
      res.status(200).json({ message: "Review deleted successfully" });
    }
  });
});

app.get("/api/cabins/:id", (req, res) => {
  const sql = `SELECT * FROM cabins WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

app.delete("/api/cabins/:id", (req, res) => {
  const sql = `DELETE FROM cabins WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/cabins/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  const image = req.file.filename;

  res.status(201).json({ imageUrl: `http://localhost:8800/uploads/${image}` });
});

app.post("/api/cabins", upload.single("image"), (req, res) => {
  const { name, description, price, location, region, capacity, user_id } =
    req.body;

  const image = req.file ? req.file.filename : null;

  const sql =
    "INSERT INTO cabins (user_id, name, description, price, image, location, region, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    user_id,
    name,
    description,
    price,
    image,
    location,
    region,
    capacity,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to insert cabin" });
    } else {
      const insertedId = result.insertId;
      const insertedCabin = {
        id: insertedId,
        user_id: parseInt(user_id, 10),
        name,
        description,
        price,
        image,
        location,
        region,
        capacity: parseInt(capacity, 10),
      };

      res.status(201).json(insertedCabin);
    }
  });
});

app.put("/api/cabins/:id", upload.single("image"), (req, res) => {
  const cabinId = req.params.id;
  const { name, description, price, location, region, capacity, user_id } =
    req.body;

  const image = req.file ? req.file.filename : req.body.image;

  const sql =
    "UPDATE cabins SET user_id=?, name=?, description=?, price=?, image=?, location=?, region=?, capacity=? WHERE id=?";
  const values = [
    user_id,
    name,
    description,
    price,
    image,
    location,
    region,
    capacity,
    cabinId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to update cabin" });
    } else {
      // Fetch the updated cabin from the database
      const fetchUpdatedCabinSQL = "SELECT * FROM cabins WHERE id = ?";
      db.query(fetchUpdatedCabinSQL, [cabinId], (fetchErr, fetchResult) => {
        if (fetchErr) {
          res.status(500).json({ error: "Failed to fetch updated cabin" });
        } else {
          const updatedCabin = fetchResult[0];
          res.json(updatedCabin);
        }
      });
    }
  });
});
app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;

  const checkUserExistsSQL =
    "SELECT COUNT(*) as count FROM users WHERE username = ? OR email = ?";
  const checkUserExistsValues = [username, email];

  db.query(checkUserExistsSQL, checkUserExistsValues, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result[0].count > 0) {
      return res.status(400).json({ error: "User already exists" });
    }
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const sql =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      const values = [username, email, hash];
      db.query(sql, values, (err, result) => {
        if (err) {
          return res.status(400).json({ error: "Registration failed" });
        }
        res.status(201).json({ message: "Registration successful" });
      });
    });
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql =
    "SELECT id, email, password, username FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (isMatch) {
        const token = jwt.sign(
          {
            userId: user.id,
            username: user.username,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );

        return res.status(200).json({
          message: "Authentication successful",
          token: token,
          user: user,
        });
      } else {
        return res.status(401).json({ error: "Authentication failed" });
      }
    });
  });
});

app.get("/api/login", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

  const userId = decodedToken.userId;

  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const user = result[0];
    res.status(200).json({ user });
  });
});

app.post("/api/favorites/add", (req, res) => {
  const { user_id, cabin_id } = req.body;

  const sql = "INSERT INTO user_favorites (user_id, cabin_id) VALUES (?, ?)";
  db.query(sql, [user_id, cabin_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ message: "Cabin added to favorites" });
  });
});

app.post("/api/favorites/remove", (req, res) => {
  const { user_id, cabin_id } = req.body;

  const sql = "DELETE FROM user_favorites WHERE user_id = ? AND cabin_id = ?";
  db.query(sql, [user_id, cabin_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ message: "Cabin removed from favorites" });
  });
});

app.get("/api/favorites/:userId", (req, res) => {
  const sql = `SELECT cabin_id FROM user_favorites WHERE user_id = ${req.params.userId}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const cabinIds = result.map((row) => row.cabin_id);
    res.status(200).json({ cabinIds });
  });
});

app.get("/api/users/:userId", (req, res) => {
  const sql = `SELECT username FROM users WHERE id = ${req.params.userId}`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const username = result[0].username;
    res.status(200).json({ username });
  });
});

app.post("/api/reservations", (req, res) => {
  const { cabinId, userId, startDate, endDate } = req.body;
  const sql =
    "INSERT INTO reservations (cabin_id, user_id, start_date, end_date) VALUES (?, ?, ?, ?)";
  const values = [cabinId, userId, startDate, endDate];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting reservation: " + err);
      res.status(500).send("Failed to submit the reservation");
    } else {
      const insertedId = result.insertId;
      const insertedReservation = {
        id: insertedId,
        cabin_id: cabinId,
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      };
      res.status(200).json(insertedReservation);
    }
  });
});

app.get("/api/reservations/:cabinId", (req, res) => {
  const sql = `SELECT * FROM reservations WHERE cabin_id = ${req.params.cabinId}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/api/reservations", (req, res) => {
  const sql = "SELECT * FROM reservations";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete("/api/reservations/:reservationId/:userId", (req, res) => {
  const reservationId = req.params.reservationId;
  const userId = req.params.userId;

  const sql = `DELETE FROM reservations WHERE id = ${reservationId} AND user_id = ${userId}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete reservation" });
    } else if (result.affectedRows === 0) {
      res.status(403).json({ error: "Reservation not found or unauthorized" });
    } else {
      res.status(200).json({ message: "Reservation deleted successfully" });
    }
  });
});

app.listen(8800, () => {
  console.log("Backend server is running!");
});
