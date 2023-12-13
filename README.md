# Cabin Reservation App

## How to Run:

1. Clone the project.
2. Navigate to the server folder and rename `.envExample` to `.env`.
3. Create a MySQL database using the `schema.sql` file (located in the server folder).
4. Populate the `.env` file with the necessary information to connect the backend to the database (you can use any value for SECRET_KEY; it's only for password hashing).
5. To run the server and client, open the main folder in the terminal. For the server, execute `cd server` followed by `npm start`. Repeat the process for the client with `cd client` and `npm start`.
