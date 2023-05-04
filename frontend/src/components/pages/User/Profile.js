import { useEffect, useState } from "react";
import api from "../../../utils/api";
//css
import formStyles from "../../forms/Form.module.css";
import styles from "./Profile.module.css";

import Input from "../../../components/forms/Input";

function Profile() {
  const [user, setUser] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");

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

  function onFileChange(e) {}
  function handleOnChange(e) {}
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <section>
      <div className={styles.profile_container}>
        <h1>Perfil</h1>
        <p>Preview de Imagem</p>
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
