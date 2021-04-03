import * as OPTService from "./service/OTPService.js";

/**
 *
 * @param {string} nomeOlElement nome elemento ol dove disegnare la lista
 */
function stampaListaOTPSalvati(nomeOlElement = "listaSalvati", callback) {
  const ol = document.getElementById(nomeOlElement);
  ol.innerHTML = "";
  OPTService.getAll().forEach((e) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.id = e.id;
    ol.appendChild(li);

    const spanTitle = document.createElement("u");
    spanTitle.setAttribute("role", "button");
    spanTitle.innerHTML = e.id;
    spanTitle.onclick = () => {
      callback(e);
    };

    li.appendChild(spanTitle);

    const spanType = document.createElement("span");
    spanType.innerHTML = e.type.toUpperCase();
    spanType.classList.add("badge", "badge-info", "m-1");
    li.appendChild(spanType);

    const spanDel = document.createElement("span");
    spanDel.innerHTML = "X";
    spanDel.classList.add("badge", "badge-danger", "float-right", "my-1");
    spanDel.setAttribute("role", "button");
    spanDel.onclick = rimuoviOTP;
    li.appendChild(spanDel);
  });

  ol.appendChild(document.createElement("hr"));
  const btn = document.createElement("button");
  btn.classList.add("btn", "btn-secondary");
  ol.appendChild(btn);
  const a = document.createElement("a");
  a.href = "./configQr.html";
  a.innerText = "Crea Nuovo";
  a.style.color = "white";
  btn.appendChild(a);
}

function rimuoviOTP({ currentTarget }) {
  OPTService.deleteOne(currentTarget.parentNode.id);
  stampaListaOTPSalvati();
}

function getOTPById(id) {
  return OPTService.get(id);
}

export { stampaListaOTPSalvati, getOTPById };
