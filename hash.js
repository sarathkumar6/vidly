const bcrypt = require("bcrypt");

// ToDo: Read about password hashing
// Salt is a random string prefix and postfix a password prevent from any hacking
async function addSalt() {
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash("S@r@th2k20", salt)
    console.log(salt);
    console.log(hash);
}

addSalt();
