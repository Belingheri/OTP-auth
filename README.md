# OTP-auth
Semplice appplicazione che lavora e salva i dati localmente per:
- Generazione dei QR di configurazione per le APP di OTP
- Generazione codice OTP
- Verifica correto allineamento codici OTP

Veloce [demo](https://belingheri.altervista.org/OTP-auth-master/)

L'applicazione lavora localmente, tutta la parte "intelligente" avvine in `Javascript` all'interno del tuo browser, e i dati vengona salvati nella [localStorage](https://developer.mozilla.org/it/docs/Web/API/Window/localStorage) del tuo browser.

Parte del codice utilizzato è stato preso da:
- stefansundin [github page](https://github.com/stefansundin/2fa-qr) generazione QR
- jiangts [github page](https://github.com/jiangts/JS-OTP) generazione codice controllo
