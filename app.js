import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVp9jSagLcb8v6Ei2dhmpQrJAWSYxgZ48",
    authDomain: "populationmap-48dd0.firebaseapp.com",
    databaseURL: "https://populationmap-48dd0-default-rtdb.firebaseio.com",
    projectId: "populationmap-48dd0",
    storageBucket: "populationmap-48dd0.firebasestorage.app",
    messagingSenderId: "387203070252",
    appId: "1:387203070252:web:b0ed4f1ff520f6f2bc5489",
    measurementId: "G-1SSDYP5N25"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
getAnalytics(app);

const sitesContainer = document.getElementById("sites-container");
const apartmentsTable = document.getElementById("apartments-table-body");

const dbRef = ref(database, "veri");

onValue(dbRef, (snapshot) => {

    sitesContainer.innerHTML = "";
    apartmentsTable.innerHTML = "";

    if (!snapshot.exists()) {

        apartmentsTable.innerHTML = `
            <tr>
                <td colspan="3" class="no-data">
                    Veri bulunamadı.
                </td>
            </tr>
        `;

        return;
    }

    const data = snapshot.val();

    /* ---------------- APARTMANLAR ---------------- */

    if (data.apartmanlar) {

        Object.entries(data.apartmanlar).forEach(([isim, bina]) => {

            const adres =
                bina.adres ??
                bina.acikAdres ??
                bina["açıkAdres"] ??
                "-";

            const kisi =
                bina.kisiSayisi ??
                bina["kişiSayisi"] ??
                bina.sayac ??
                bina["sayaç"] ??
                0;

            apartmentsTable.innerHTML += `
                <tr>
                    <td><strong>${isim}</strong></td>
                    <td>${adres}</td>
                    <td>${kisi}</td>
                </tr>
            `;

        });

    } else {

        apartmentsTable.innerHTML = `
            <tr>
                <td colspan="3" class="no-data">
                    Apartman bulunamadı.
                </td>
            </tr>
        `;

    }

    /* ---------------- SİTELER ---------------- */

    if (data.siteler) {

        Object.entries(data.siteler).forEach(([siteAdi, binalar]) => {

            let toplam = 0;

            const siteBox = document.createElement("div");
            siteBox.className = "site-box";

            const siteHeader = document.createElement("div");
            siteHeader.className = "site-header";
            siteHeader.textContent = "▶ " + siteAdi;

            const siteContent = document.createElement("div");
            siteContent.className = "site-content";

            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Bina</th>
                            <th>Adres</th>
                            <th>Kişi</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            Object.entries(binalar).forEach(([binaAdi, bina]) => {

                const adres =
                    bina.adres ??
                    bina.acikAdres ??
                    bina["açıkAdres"] ??
                    "-";

                const kisi =
                    bina.kisiSayisi ??
                    bina["kişiSayisi"] ??
                    bina.sayac ??
                    bina["sayaç"] ??
                    0;

                toplam += Number(kisi);

                html += `
                    <tr>
                        <td><strong>${binaAdi}</strong></td>
                        <td>${adres}</td>
                        <td>${kisi}</td>
                    </tr>
                `;

            });

            html += `
                    </tbody>
                </table>
            `;

            siteContent.innerHTML = html;

            siteHeader.onclick = () => {

                siteBox.classList.toggle("open");

                if(siteBox.classList.contains("open")){
                    siteHeader.textContent =
                        "▼ " + siteAdi + " (" + toplam + " kişi)";
                }else{
                    siteHeader.textContent =
                        "▶ " + siteAdi;
                }

            };

            siteBox.appendChild(siteHeader);
            siteBox.appendChild(siteContent);

            sitesContainer.appendChild(siteBox);

        });

    }

}, (error)=>{

    console.error(error);

});
