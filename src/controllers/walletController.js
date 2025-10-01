const Wallet = require("../models/Wallet.model");
const User = require("../models/User.model");

// Create Wallet for a new User
exports.createwallet = async (req, res) => {
  try {
    const { userId } = req.body;
    //Checking if user already exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Checking if wallet already exists
    const walletExists = await Wallet.findOne({ user: userId });
    if (walletExists) {
      return res.status(404).json({ message: "Wallet already exists" });
    }

    // Creating a new wallet
    const wallet = new Wallet({ user: userId });
    await wallet.save();
  } catch (err) {
    console.error("Create Wallet Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Wallet Balance
exports.walletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.status(200).json({
      balance: wallet.balance,
      currency: wallet.currency,
    });
  } catch (err) {
    console.error("Create Wallet Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fund a Wallet (Deposit)
exports.fundWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Validate request
    if (!userId || !amount) {
      return res
        .status(400)
        .json({ message: "Valid User ID and amount are required" });
    }

    // Find the user's wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Update wallet balance
    wallet.balance += amount;

    //Log transaction
    wallet.transactions.push({
      type: "deposit",
      amount: amount,
      date: new Date(),
      description: `Wallet funded with ${wallet.currency} ${amount}`,
    });
    await wallet.save();

    res
      .status(200)
      .json({ message: "Wallet funded successfully", balance: wallet.balance });
  } catch (err) {
    console.log("Error Funding Wallet", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Withdraw from Wallet
exports.withdraw = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    // Validate request
    if (!userId || !amount) {
      return res
        .status(400)
        .json({ message: "Valid User ID and amount are required" });
    }

    // Find the user's wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    // Check for sufficient balance
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct from wallet balance
    wallet.balance -= amount;

    //Log transaction
    wallet.transactions.push({
      type: "withdrawal",
      amount: amount,
      date: new Date(),
      description: `Withdrawn ${wallet.currency} ${amount} from wallet`,
    });
    await wallet.save();
    res
      .status(200)
      .json({ message: "Withdrawal successful", balance: wallet.balance });
  } catch (err) {
    console.log("Error Withdrawing from Wallet", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Transfer between Wallets
exports.transfer = async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;
    // Validate request
    if (!senderId || !receiverId || !amount) {
      return res
        .status(400)
        .json({
          message: "Valid Sender ID, Receiver ID and amount are required",
        });
    }

    // Prevent self-transfer
    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot transfer to the same wallet" });
    }

    // Find the sender's and receiver's wallet
    const senderWallet = await Wallet.findOne({ user: senderId });
    const receiverWallet = await Wallet.findOne({ user: receiverId });
    if (!senderWallet || !receiverWallet) {
      return res
        .status(404)
        .json({ message: "Sender or Receiver Wallet not found" });
    }

    // Check for sufficient balance
    if (senderWallet.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in sender wallet" });
    }

    // Perform the transfer
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    // Log transaction
    senderWallet.transactions.push({
      type: "transfer",
      amount: amount,
      date: new Date(),
      description: `Transferred ${senderWallet.currency} ${amount} to ${receiverId}`,
    });
    receiverWallet.transactions.push({
      type: "transfer",
      amount: amount,
      date: new Date(),
      description: `Received ${receiverWallet.currency} ${amount} from ${senderId}`,
    });

    await senderWallet.save();
    await receiverWallet.save();

    res
      .status(200)
      .json({
        message: "Transfer successful",
        senderBalance: senderWallet.balance,
        receiverBalance: receiverWallet.balance,
      });
  } catch (err) {
    console.log("Error Transferring between Wallets", err);
    res.status(500).json({ message: "Server Error" });
  }
};
