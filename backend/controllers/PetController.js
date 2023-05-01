const Pet = require("../models/Pet");

//helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class PetController {
  //Errors Message
  static sendError(res, message) {
    return res.status(422).json({ message });
  }

  // Create a pet
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const available = true;

    // images upload

    // validations
    if (!name) {
      return PetController.sendError(res, `O nome é obrigatório!`);
    }
    if (!age) {
      return PetController.sendError(res, `A idade é obrigatória!`);
    }
    if (!weight) {
      return PetController.sendError(res, `O peso é obrigatório!`);
    }
    if (!color) {
      return PetController.sendError(res, `A cor é obrigatória!`);
    }

    // get pet owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    // save a pet
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      image: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: `Pet cadastrado com sucesso!`, newPet });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
