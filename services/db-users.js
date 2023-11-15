

async function dbListAdmins() {
    console.log("Received List Admins request.");
    const admins = {};

    // Retrieve Users list from DB


    let status = 501;
    return {status, admins};
}


async function dbListUsers() {
    console.log("Received List Users request.");
    const users = {};

    // Retrieve Users list from DB
    
    
    let status = 501;
    return {status, users};
}


async function dbGetAdminById(id) {
    console.log("Received request for admin by ID: " + id);
    const admin = {};

    // Retrieve Admin by ID from DB


    let status = 501;
    return {status, admin};
}


async function dbGetUserById(id) {
    console.log("Received request for User by ID: " + id);
    const user = {};

    // Retrieve Admin by ID from DB


    let status = 501;
    return {status, user};
}


async function dbRegisterAdmin(adminParams) {
    console.log("Received Add Admin Request with various data: " +
        adminParams.name + " " + adminParams.email);
    const adminId = "An Admin ID";
    // Add Admin to DB

    // if (ok) {return 201}
    // else {return 500}
    let status = 501;
    return {status, adminId};

}


async function dbAddUser(userParams) {
    console.log("Received Add User Request with various data: " +
        userParams.name + " " + userParams.email);
    const userId = "A User ID";
    // Add User to DB

    // if (ok) {return 201}
    // else {return 500}
    let status = 501;
    return {status, userId};
}


async function dbUpdateAdmin(adminId, updateParams) {
    console.log("Received Update Admin request with plant ID and data: " +
        adminId + " " + updateParams.name + " " + updateParams.email);
    // Update admin (adminID) with provided data
    // if (ok) {return 210}
    // else {return 500}

    return 501;
}


async function dbUpdateUser(userId, updateParams) {
    console.log("Received Update User request with plant ID and data: " +
        userId + " " + updateParams.name + " " + updateParams.email);
    // Update user (userID) with provided data
    // if (ok) {return 210}
    // else {return 500}

    return 501;
}


async function dbRemoveAdmin(adminId) {
    console.log("Admin ID: " + adminId);
    // Remove admin (adminId) from DB

    // if (ok) {return 210}
    // else {return 500}

    return 501;
}


async function dbRemoveUser(userId) {
    console.log("User ID: " + userId);
    // Remove user (userId) from DB

    // if (ok) {return 210}
    // else {return 500}

    return 501;
}



module.exports = { dbListAdmins, dbListUsers, dbGetAdminById, dbGetUserById, dbRegisterAdmin, dbAddUser, dbUpdateAdmin, dbUpdateUser, dbRemoveAdmin, dbRemoveUser };