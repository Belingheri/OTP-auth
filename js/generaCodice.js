import * as OPTService from "./service/OTPService.js";

let interval;

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
function OTPSelezionato(obj) {
  if (interval) clearInterval(interval);
  document.getElementById("id").innerHTML = obj.id;
  if (obj.type === "totp") {
    document.getElementById("count-container").style.display = "none";
    riempiOTPForm(obj);
    interval = setInterval(() => {
      riempiOTPForm(obj);
    }, 500);
  } else {
    document.getElementById("time-container").style.display = "none";
  }
}
function riempiOTPForm(obj) {
  document.getElementById("time-container").style.display = "flex";
  const totp = new jsOTP.totp();
  const timeCode = totp.getOtp(obj.secret);
  const prettyTimeCode = timeCode.substring(0, 3) + " " + timeCode.substring(3);
  const epoch = Math.round(new Date().getTime() / 1000.0);
  const countDown = 30 - (epoch % 30);
  document.getElementById("countDown").innerHTML = `${countDown} sec`;

  const otpCodeEl = document.getElementById("otpcode");
  if (otpCodeEl.value !== prettyTimeCode) otpCodeEl.value = prettyTimeCode;
}

function verificaCodice() {
  const idOTP = document.getElementById("id").innerHTML;
  if (!idOTP) return alert("Seleziona un elemento dalla lista a sinistra");

  const obj = getOTPById(idOTP);
  if (obj.type !== "totp") return alert("OTP counter non ancora implementato");

  const codiceVero = new jsOTP.totp().getOtp(obj.secret);
  const codcieUtenteEl = document.getElementById("verificaCodcie");
  const codcieUtente = codcieUtenteEl.value.replaceAll(" ", "");
  codcieUtenteEl.value = "";

  if (codcieUtente === codiceVero)
    document.getElementById("esito").innerHTML = "Codice Corretto 😊🎉";
  else
    document.getElementById(
      "esito"
    ).innerHTML = `Codice inserito <i>${codcieUtente}</i> Scaduto ⌚ o Errato 🤬`;
}
export { stampaListaOTPSalvati, getOTPById, OTPSelezionato, verificaCodice };
