import * as OPTService from "./service/OTPService.js";

function salvaDatiQr() {
  const obj = {};
  obj.label = document.getElementById("label").value;
  obj.secret = document.getElementById("secret").value;
  obj.issuer = document.getElementById("issuer").value;
  obj.type = document.getElementById("type").value;

  try {
    OPTService.save(obj);
  } catch (error) {
    alert(error.message);
  }
}

export { salvaDatiQr };
