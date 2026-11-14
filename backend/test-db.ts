import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    host: "::1",
    port: 5432,
    user: "user",
    password: "nocron_password_55a0d2b559ac2a38",
    database: "nocron",
});

try {
    const result = await pool.query(
        "SELECT current_user, current_database()"
    );

    console.log("CONNECTED:", result.rows);
} catch (error) {
    console.error("CONNECTION FAILED:", error);
} finally {
    await pool.end();
}