import * as OPTService from "./service/OTPService.js";

let timeout;

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

/**
 * @return attuale OTP obj con i dati aggiornati
 */
function getActualOTP() {
  return getOTPById(document.getElementById("id").innerHTML);
}

/**
 * Formatta il valore del codice da visualizzare
 * @param {string} value
 * @returns {string} valore formattoato
 */
function formatValue(value) {
  return value.substring(0, 3) + " " + value.substring(3);
}

function OTPSelezionato(obj) {
  if (timeout) clearTimeout(timeout);
  document.getElementById("id").innerHTML = obj.id;

  riempiOTPForm(obj);
}

function riempiOTPForm(obj) {
  // aggiorno i dati
  const objAgg = OPTService.get(obj.id);
  if (objAgg.type === "totp") riempiTimeOTPForm(objAgg);
  else riempiCounterOTPForm(objAgg);
  gestPlusMinusEnable();
}

function riempiTimeOTPForm(obj) {
  document.getElementById("count-container").style.display = "none";
  document.getElementById("time-container").style.display = "flex";
  const prettyTimeCode = formatValue(OPTService.getAuthCode(obj));
  const epoch = Math.round(new Date().getTime() / 1000.0);
  const countDown = 30 - (epoch % 30);
  document.getElementById("countDown").innerHTML = `${countDown} sec`;

  const otpCodeEl = document.getElementById("otpcode");
  if (otpCodeEl.value !== prettyTimeCode) otpCodeEl.value = prettyTimeCode;
  timeout = setTimeout(() => {
    riempiOTPForm(obj);
  }, 500);
}

function riempiCounterOTPForm(obj) {
  document.getElementById("time-container").style.display = "none";
  document.getElementById("count-container").style.display = "flex";
  const prettyCountCode = formatValue(OPTService.getAuthCode(obj));
  document.getElementById("countNum").innerHTML = obj.counter;

  const otpCodeEl = document.getElementById("otpcode-count");
  if (otpCodeEl.value !== prettyCountCode) otpCodeEl.value = prettyCountCode;
}

function verificaCodice() {
  const idOTP = document.getElementById("id").innerHTML;
  if (!idOTP) return alert("Seleziona un elemento dalla lista a sinistra");

  const obj = getOTPById(idOTP);
  if (obj.type !== "totp") return alert("OTP counter non ancora implementato");

  const codiceVero = OPTService.getAuthCode(obj.secret);
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

function handlePlusMinus({ currentTarget: t }) {
  if (t.getAttribute("disabled") !== null) return;
  const counterEl = document.getElementById("counter");

  const authObj = getActualOTP();
  if (t.id === "plus") authObj.counter++;
  else authObj.counter--;
  OPTService.save(authObj);
  riempiCounterOTPForm(authObj);

  gestPlusMinusEnable();
}

/**
 * disabilita i bottoni di piu' o meno legati al counter auth
 */
function gestPlusMinusEnable() {
  const plusBtn = document.getElementById("plus");
  const minusBtn = document.getElementById("minus");
  const authObj = getActualOTP();
  if (authObj.type === "totp") {
    minusBtn.setAttribute("disabled", true);
    plusBtn.setAttribute("disabled", true);
  } else {
    plusBtn.removeAttribute("disabled");
    if (authObj.counter === 0) minusBtn.setAttribute("disabled", true);
    else minusBtn.removeAttribute("disabled");
  }
}

export {
  stampaListaOTPSalvati,
  getOTPById,
  OTPSelezionato,
  verificaCodice,
  handlePlusMinus,
};
