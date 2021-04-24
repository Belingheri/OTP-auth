const prefisso = "OPT_";

/**
 * trasforma l'id dell'oggetto nell id utilizzato nel localSorage
 * @param {string} id id dell'oggetto
 * @returns {string} id del localStorage
 */
function decodeId(id) {
  return `${prefisso}${id}`;
}

/**
 * salva nella localstorage le informazioni
 * @param obj contenente label,secret,type e opz issuer
 */
function save(obj) {
  if (!obj) throw new Error("nessun valore passato");

  if (!obj.secret || obj.secret.length < 5)
    throw new Error("Secret deve essere lunga almeno 6 caratteri");

  if (!obj.type) throw new Error("Il tipo di OTP deve essere definito");

  if (!obj.label) throw new Error("'label' deve essere definito");

  if (obj.type === "totp") delete obj.counter;

  if (obj.issuer) obj.id = `${obj.issuer}(${obj.label})`;
  else obj.id = obj.label;
  localStorage.setItem(decodeId(obj.id), JSON.stringify(obj));
}

/**
 *
 * @returns {Array<object>} tutti gli OTP salvati
 */
function getAll() {
  return Object.keys(localStorage)
    .filter((v) => v.startsWith(prefisso))
    .map((e) => JSON.parse(localStorage.getItem(e)));
}

/**
 *
 * @param {string} id id dell oggtto che si vuole predere dal local storage
 * @returns {object} oggetto salvato nel localStorage
 */
function get(id) {
  const obj = JSON.parse(localStorage.getItem(decodeId(id)));
  if (obj.hasOwnProperty("counter")) obj.counter = parseInt(obj.counter);
  return obj;
}
/**
 * Rimuove un OTP
 * @param {string} id id dell oggtto che si vuole rimuovere dal local storage
 */
function deleteOne(id) {
  if (!confirm(`Cancellare ${id}?`)) return;
  localStorage.removeItem(decodeId(id));
}

export { get, getAll, save, deleteOne };
