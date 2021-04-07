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
    return;
  }

  document.getElementById("label").value = "";
  document.getElementById("secret").value = "";
  document.getElementById("issuer").value = "";
}

/**
 *
 * @param {string} nomeOlElement nome elemento ol dove disegnare la lista
 */
function stampaListaOTPSalvati(nomeOlElement = "listaSalvati") {
  const ol = document.getElementById(nomeOlElement);
  ol.innerHTML = "";
  OPTService.getAll().forEach((e) => {
    const li = document.createElement("div");
    li.classList.add("box");
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
      const counterEl = document.getElementById("counter");
      if (e.counter) {
        counterEl.value = e.counter;
        counterEl.style.display = "";
      } else counterEl.style.display = "none";
      $("#secret").change();
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

function generate_uri() {
  const type = document.getElementById("type").value;
  const secret = document
    .getElementById("secret")
    .value.replace(/ /g, "")
    .replace(/\d/g, "");
  document.getElementById("secret").value = secret;
  const label = document.getElementById("label").value;
  const issuer = document.getElementById("issuer").value;
  const advanced_options =
    document.getElementById("advanced_options") &&
    document.getElementById("advanced_options").checked;
  let uri = `otpauth://${type}/${encodeURIComponent(label)}?secret=${secret}`;
  if (issuer != "") {
    uri += `&issuer=${encodeURIComponent(issuer)}`;
  }
  if (type === "hotp") {
    const counter = document.getElementById("counter").value || "0";
    uri += `&counter=${counter}`;
  }
  if (advanced_options) {
    const algorithm = document.getElementById("algorithm").value;
    const digits = document.getElementById("digits").value;
    uri += `&algorithm=${algorithm}&digits=${digits}`;
    if (type == "totp") {
      const period = document.getElementById("period").value || "30";
      uri += `&period=${period}`;
    }
  }
  return uri;
}

export { salvaDatiQr, stampaListaOTPSalvati, randomString, generate_uri };
