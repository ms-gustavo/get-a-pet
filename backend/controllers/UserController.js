const createUserToken = require("../helpers/create-user-token");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    // Validations
    if (!name) {
      res.status(422).json({ message: "Por favor, insira um nome." });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "Por favor, insira um email." });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "Por favor, insira um telefone." });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "Por favor, insira uma senha." });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatória" });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({
        message: "A senha e a confirmação de senha precisam ser iguais!",
      });
    }

    // Check if User Exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro e-mail!",
      });
      return;
    }

    // Create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //Create a user
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "Por favor, insira um email." });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "Por favor, insira uma senha." });
      return;
    }

    // Check if User Exists
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ message: `O usuário não existe!` });
      return;
    }

    // Check if password matches with db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: `A senha está inválida!` });
      return;
    }

    await createUserToken(user, req, res);
  }
};
