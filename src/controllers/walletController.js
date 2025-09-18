const Wallet = require("../models/Wallet.model");
const User = require("../models/User.model");

// Create Wallet for a new User
exports.createwallet = async (req, res) => {
    try {
        const { userId } = req.body

        //Checking if user already exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Checking if wallet already exists
        const walletExists = await Wallet.findOne({ user: userId });
        if (walletExists) {
            return res.status(404).json({ message: 'Wallet already exists' });
        }

        // Creating a new wallet
        const wallet = new Wallet({ user: userId });
        await wallet.save();
    } catch (err) {
        console.error('Create Wallet Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Get Wallet Balance
exports.walletBalance = async (req, res) => {
    try {
        const { userId } = req.param
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.status(200).json({
            balance: wallet.balance,
            currency: wallet.currency
        })
    } catch (err) {
        console.error('Create Wallet Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Fund a Wallet 
exports.fundWallet = async (req, res) => {
    try {

    } catch (err) {
        console.log("Error Funding Wallet", err)
        res.status(500).json({ message: 'Server Error'})
    }
}