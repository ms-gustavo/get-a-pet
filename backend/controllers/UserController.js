const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

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
      return;
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

  static async checkUser(req, res) {
    let currentUser;
    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({
        message: `Usuário não encontrado`,
      });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const id = req.params.id;

    //check if user exists
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;
    let image = "";

    if (req.file) {
      user.image = req.file.filename;
    }

    // validations
    if (!name) {
      res.status(422).json({ message: "Por favor, insira um nome." });
      return;
    }
    user.name = name;
    if (!email) {
      res.status(422).json({ message: "Por favor, insira um email." });
      return;
    }

    // check if email has already taken
    const userExists = await User.findOne({ email: email });
    if (user.email !== email && userExists) {
      res.status(422).json({
        message: `Email já cadastrado!`,
      });
      return;
    }
    user.email = email;

    if (!phone) {
      res.status(422).json({ message: "Por favor, insira um telefone." });
      return;
    }
    user.phone = phone;

    if (password !== confirmpassword) {
      res.status(422).json({ message: `As senhas não conferem.` });
      return;
    } else if (password && password === confirmpassword) {
      // creating password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }
    try {
      // returns user updated data
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.status(200).json({
        message: `Usuário atualizado com sucesso!`,
      });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }
};
