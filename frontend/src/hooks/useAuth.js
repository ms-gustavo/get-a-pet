// api
import api from "../utils/api";

// hooks
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  const { setFlashMessage } = useFlashMessage();

  async function register(user) {
    let msgText = `Cadastro realizado com sucesso!`;
    let msgType = `success`;

    try {
      const data = await api.post("/users/register", user).then((response) => {
        return response.data;
      });
      console.log(data);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ??
        "Ocorreu um erro no processamento da solicitação.";

      msgText = errorMsg;
      msgType = `error`;
    }

    setFlashMessage(msgText, msgType);
  }
  return { register };
}
