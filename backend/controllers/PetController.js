const Pet = require("../models/Pet");

//helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  //Errors Message
  static sendError(res, message) {
    return res.status(422).json({ message });
  }

  // Create a pet
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const available = true;
    const images = req.files;

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

    if (!images.length === 0) {
      return PetController.sendError(res, `A imagem é obrigatória!`);
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
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: `Pet cadastrado com sucesso!`, newPet });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getAllUserPets(req, res) {
    // get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getAllUserAdoptions(req, res) {
    // get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getPetById(req, res) {
    const id = req.params.id;
    // check if ID is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({
        message: `ID inválido!`,
      });
      return;
    }

    // check if pet exists
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({
        message: `O pet não existe!`,
      });
      return;
    }

    res.status(200).json({
      pet,
    });
  }

  static async deletePetById(req, res) {
    const id = req.params.id;

    // check if ID is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({
        message: `ID inválido!`,
      });
      return;
    }

    // check if pet exits
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({
        message: `Pet inexistente`,
      });
      return;
    }

    // check if logged user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message: `Houve um problema em processar a sua solicitação! Tente novamente mais tarde.`,
      });
      return;
    }

    await Pet.findByIdAndRemove(id);
    res.status(200).json({
      message: `Pet excluído com sucesso!`,
    });
  }

  static async updatePet(req, res) {
    const id = req.params.id;
    const { name, age, weight, color, available } = req.body;
    const images = req.files;

    const updatedData = {};

    // check if ID is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({
        message: `ID inválido!`,
      });
      return;
    }

    // check if pet exists
    const pet = await Pet.findOne({ _id: new ObjectId(id) });
    if (!pet) {
      res.status(404).json({
        message: `Pet inexistente`,
      });
      return;
    }

    // check if logged user registered the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message: `Houve um problema em processar a sua solicitação! Tente novamente mais tarde.`,
      });
      return;
    }

    // validations
    if (!name) {
      return PetController.sendError(res, `O nome é obrigatório!`);
    } else {
      updatedData.name = name;
    }
    if (!age) {
      return PetController.sendError(res, `A idade é obrigatória!`);
    } else {
      updatedData.age = age;
    }
    if (!weight) {
      return PetController.sendError(res, `O peso é obrigatório!`);
    } else {
      updatedData.weight = weight;
    }
    if (!color) {
      return PetController.sendError(res, `A cor é obrigatória!`);
    } else {
      updatedData.color = color;
    }

    if (images.length === 0) {
      return PetController.sendError(res, `A imagem é obrigatória!`);
    } else {
      updatedData.images = [];
      images.map((image) => {
        updatedData.images.push(image.filename);
      });
    }

    await Pet.findByIdAndUpdate(id, updatedData);
    res.status(200).json({
      message: `O pet foi atualizado!`,
    });
  }
};
