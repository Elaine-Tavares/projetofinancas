import axios from "axios";

const modo = "producao";
let api = null;

if(modo == "producao"){
    api = axios.create({
        baseURL: "https://elainetavaresweb.com/projetofinancas/backend"
    });
}

else if (modo == "local"){
    api = axios.create({
        baseURL: "http://localhost:8000"
    });
}

export default api;