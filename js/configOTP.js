import * as OPTService from "./service/OTPService.js";

function salvaDatiQr() {
  const obj = {};
  obj.label = document.getElementById("label").value;
  obj.secret = document.getElementById("secret").value;
  obj.issuer = document.getElementById("issuer").value;
  obj.type = document.getElementById("type").value;

  try {
    OPTService.save(obj);
    stampaListaOTPSalvati("listaSalvati");
  } catch (error) {
    alert(error.message);
  }
}

/**
 *
 * @param {string} nomeOlElement nome elemento ol dove disegnare la lista
 */
function stampaListaOTPSalvati(nomeOlElement) {
  const ol = document.getElementById(nomeOlElement);
  ol.innerHTML = "";
  OPTService.getAll().forEach((e) => {
    const li = document.createElement("li", e);
    li.classList.add("list-group-item");
    li.innerHTML = e.id;
    ol.appendChild(li);
  });
}

export { salvaDatiQr, stampaListaOTPSalvati };
