import api from "../../../utils/api";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RoundedImage from "../../layouts/RoundedImage";
// hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

function MyPets() {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/pets/mypets", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPets(response.data.pets);
      });
  }, [token]);

  return (
    <section>
      <div>
        <h1>MyPets</h1>
        <Link to="/pet/add">Cadastrar Pet</Link>
      </div>
      <div>
        {pets.length > 0 && <p>Meus pets cadastrados</p>}
        {pets.length === 0 && <p>Não há Pets cadastrados.</p>}{" "}
      </div>
    </section>
  );
}

export default MyPets;
