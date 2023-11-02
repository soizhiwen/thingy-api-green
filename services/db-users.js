




async function dbListUsers() {
    const users = {};

    // Retrieve Users list from DB
    
    
    let status = 501;
    return {status, users};
}


async function dbRegisterAdmin(adminId, name, id, email) {

    // Add Admin to DB

    // if (ok) {return 201}
    // else {return 500}
    return 501;

}


async function dbAddUser(userId, name, id, email) {

    // Add User to DB

    // if (ok) {return 201}
    // else {return 500}
    return 501;
}


async function dbUpdateUser(userId, data) {

    // Update user (userID) with provided data
    // if (ok) {return 210}
    // else {return 500}

    return 501;
}


async function dbRemoveUser(userId) {

    // Remove user (userId) from DB

    // if (ok) {return 210}
    // else {return 500}

    return 501;
}






module.exports = { dbListUsers, dbRegisterAdmin, dbAddUser, dbUpdateUser, dbRemoveUser };