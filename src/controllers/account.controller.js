const accountModel = require("../models/account.model");

async function createAccount(req, res) {
    const user = req.user;

    console.log(user);

    const account = await accountModel.create({
        user: user._id,
    });

    res.status(201).json({
        account
    });
}

module.exports = {
    createAccount
}