import * as OPTService from "./service/OTPService.js";

function salvaDatiQr() {
  const obj = {};
  obj.label = document.getElementById("label").value;
  obj.secret = document.getElementById("secret").value;
  obj.issuer = document.getElementById("issuer").value;
  obj.type = document.getElementById("type").value;
  obj.counter = document.getElementById("counter").value || 0;

  try {
    OPTService.save(obj);
    stampaListaOTPSalvati();
  } catch (error) {
    alert(error.message);
  }
}

/**
 *
 * @param {string} nomeOlElement nome elemento ol dove disegnare la lista
 */
function stampaListaOTPSalvati(nomeOlElement = "listaSalvati") {
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
}

function rimuoviOTP({ currentTarget }) {
  OPTService.deleteOne(currentTarget.parentNode.id);
  stampaListaOTPSalvati();
}

export { salvaDatiQr, stampaListaOTPSalvati };
