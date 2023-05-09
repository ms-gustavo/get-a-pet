import api from "../../../utils/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//hooks
import useFlashMessage from "../../../hooks/useFlashMessage";
//css
import styles from "./AddPet.module.css";
// Component
import PetForm from "../../forms/PetForm";

function AddPet() {
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  // async function registerPet(pet) {
  //   try {
  //     const formData = new FormData();
  //     for (const [key, value] of Object.entries(pet)) {
  //       if (key === "images") {
  //         for (const image of value) {
  //           formData.append("images", image);
  //         }
  //       } else {
  //         formData.append(key, value);
  //       }
  //     }

  //     const response = await api.post("pets/create", formData, {
  //       headers: {
  //         Authorization: `Bearer ${JSON.parse(token)}`,
  //         "Content-type": "multipart/form-data",
  //       },
  //     });
  //     setFlashMessage(response.data.message, "success");
  //     navigate("/pets/mypets");
  //   } catch (err) {
  //     setFlashMessage(err.response.data.message, "error");
  //   }
  // }

  async function registerPet(pet) {
    let msgType = "success";

    const formData = new FormData();
    await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append("images", pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    const data = await api
      .post("pets/create", formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
    if (msgType !== "error") {
      navigate("/pets/mypets");
    }
  }

  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção</p>
      </div>
      <span>
        <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet" />
      </span>
    </section>
  );
}

export default AddPet;
