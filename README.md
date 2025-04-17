# Raamatute Haldamise API

See projekt on **Raamatute Haldamise API**, mille eesmärk on hallata raamatute, autorite, kommentaaride ja logide haldamist. API võimaldab registreerimist, sisselogimist, raamatute lisamist, kommenteerimist, autorite haldamist ja tegevuste logimist.

## Funktsioonid

- **Registreerimine ja sisselogimine**: Kasutajad saavad registreerida ja sisse logida.
- **Raamatute haldamine**: Lisada uusi raamatuid, kustutada olemasolevaid ja uuendada.
- **Kommentaaride lisamine ja kustutamine**: Kasutajad saavad lisada kommentaare raamatutele ja administratsioon saab neid kustutada.
- **Autorite haldamine**: Uute autorite lisamine ja olemasolevate autorite kuvamine.
- **Logimine**: Kõik tegevused salvestatakse logidesse.

## Installimine

1. Kloonige projekt oma masinasse:

   ```bash
   git clone https-link https://github.com/EMasterGIT/BookManagementApp.git
2. Liikuge projekti kausta:
   ```bash
   cd BookManagementApp
3. Installige vajalikud sõltuvused:
   ```bash
   npm install
4. Täitke .env fail, mis sisaldab järgmisi keskkonnamuutujaid:
   ```bash
   DB_HOST=localhost
   DB_USER=teie-kasutajanimi
   DB_PASSWORD=teie-parool
   DB_NAME=raamatud
   JWT_SECRET=supersecret
   DIALECT=andmebaas(nt postgres)
 
5. Käivitamiseks:
    ```bash
   node src/app.js 
