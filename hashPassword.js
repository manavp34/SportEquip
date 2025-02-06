const bcrypt = require("bcryptjs");

const plainPassword = "password123"; // ✅ Change this to the real password
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log("Hashed Password:", hash);
});