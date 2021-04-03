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
    spanTitle.onclick = () => {
      const segreto = document.getElementById("secret");
      document.getElementById("label").value = e.label;
      segreto.value = e.secret;
      document.getElementById("issuer").value = e.issuer;
      document.getElementById("type").value = e.type;
      if (e.counter) document.getElementById("counter").value = e.counter;
      // non funziona l'invocazione all'onchange ....
      //   if (typeof segreto.onchange == "function") {
      //     segreto.onchange.apply(segreto);
      //   }

      // devo fare questa porcheria....
      $("#secret").change();
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
}

function rimuoviOTP({ currentTarget }) {
  OPTService.deleteOne(currentTarget.parentNode.id);
  stampaListaOTPSalvati();
}

function randomString(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { salvaDatiQr, stampaListaOTPSalvati, randomString };
