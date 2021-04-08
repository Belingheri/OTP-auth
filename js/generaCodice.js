import * as OPTService from "./service/OTPService.js";

/**
 *
 * @param {string} nomeOlElement nome elemento ol dove disegnare la lista
 */
function stampaListaOTPSalvati(nomeOlElement = "listaSalvati", callback) {
  const ol = document.getElementById(nomeOlElement);
  ol.innerHTML = "";
  OPTService.getAll().forEach((e) => {
    const li = document.createElement("div");
    li.classList.add("box");
    li.id = e.id;
    ol.appendChild(li);

    const spanTitle = document.createElement("u");
    spanTitle.setAttribute("role", "button");
    spanTitle.classList.add("pointer");
    spanTitle.innerHTML = e.id;
    spanTitle.onclick = () => {
      callback(e);
    };

    li.appendChild(spanTitle);

    const spanType = document.createElement("span");
    spanType.innerHTML = e.type.toUpperCase();
    spanType.classList.add("tag", "is-info", "mx-1");
    li.appendChild(spanType);

    const spanDel = document.createElement("span");
    spanDel.classList.add("tag", "is-danger", "delete");
    spanDel.style.float = "right";
    spanDel.setAttribute("role", "button");
    spanDel.onclick = (e) => rimuoviOTP(e, nomeOlElement, callback);
    li.appendChild(spanDel);
  });

  ol.appendChild(document.createElement("hr"));
  const btn = document.createElement("button");
  btn.classList.add("button", "is-link");
  ol.appendChild(btn);
  const a = document.createElement("a");
  a.href = "./configQr.html";
  a.innerText = "Crea Nuovo";
  a.style.color = "white";
  btn.appendChild(a);
}

function rimuoviOTP({ currentTarget }, nomeOlElement, callback) {
  OPTService.deleteOne(currentTarget.parentNode.id);
  stampaListaOTPSalvati(nomeOlElement, callback);
}

function getOTPById(id) {
  return OPTService.get(id);
}

export { stampaListaOTPSalvati, getOTPById };
