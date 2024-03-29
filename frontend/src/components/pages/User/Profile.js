import { useEffect, useState } from "react";
import api from "../../../utils/api";
//css
import formStyles from "../../forms/Form.module.css";
import styles from "./Profile.module.css";

import Input from "../../../components/forms/Input";
import useFlashMessage from "../../../hooks/useFlashMessage";
import RoundedImage from "../../layouts/RoundedImage";

function Profile() {
  const { setFlashMessage } = useFlashMessage();
  const [user, setUser] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: "Bearer " + JSON.parse(token),
        },
      })
      .then((response) => {
        setUser(response.data);
      });
  }, [token]);

  function onFileChange(e) {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }
  function handleOnChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let msgType = "success";

    const formData = new FormData();
    await Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });
    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
        headers: {
          Authorization: "Bearer " + JSON.parse(token),
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
  }

  return (
    <section>
      <div className={styles.profile_container}>
        <h1>Perfil</h1>
        {(user.image || preview) && (
          <RoundedImage
            src={
              preview
                ? URL.createObjectURL(preview)
                : `${process.env.REACT_APP_API}images/users/${user.image}`
            }
            alt={user.name}
          />
        )}
      </div>
      <form className={formStyles.form_container} onSubmit={handleSubmit}>
        <Input
          text="Imagem"
          type="file"
          name="image"
          handleOnChange={onFileChange}
        />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o seu e-mail"
          handleOnChange={handleOnChange}
          value={user.email || ""}
        />
        <Input
          text="Nome"
          type="name"
          name="name"
          placeholder="Digite o seu nome"
          handleOnChange={handleOnChange}
          value={user.name || ""}
        />
        <Input
          text="Telefone"
          type="phone"
          name="phone"
          placeholder="Digite o seu telefone"
          handleOnChange={handleOnChange}
          value={user.phone || ""}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua nova senha"
          handleOnChange={handleOnChange}
        />

        <Input
          text="Senha"
          type="password"
          name="confirmpassword"
          placeholder="Confirme a sua nova senha"
          handleOnChange={handleOnChange}
        />
        <input type="submit" value="Editar" />
      </form>
    </section>
  );
}

export default Profile;
