```javascript
// 1. Firebase modüllerini CDN üzerinden yüklüyoruz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// 2. Firebase Yapılandırması
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

// 3. Firebase başlatma
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// 4. Tablo gövdesini seç
const tableBody = document.getElementById('data-table-body');

// 5. Firebase veri yolu
const dbRef = ref(database, 'veri');

// 6. Canlı veri dinleme
onValue(dbRef, (snapshot) => {

    tableBody.innerHTML = "";

    if (snapshot.exists()) {

        const data = snapshot.val();

        for (let binaAdi in data) {

            const row = document.createElement('tr');

            const bina = data[binaAdi];

            const adres = bina.adres !== undefined 
                ? bina.adres 
                : "-";

            const sayacDegeri = bina.sayac !== undefined 
                ? bina.sayac 
                : 0;

            row.innerHTML = `
                <td><strong>${binaAdi}</strong></td>
                <td>${adres}</td>
                <td>${sayacDegeri}</td>
            `;

            tableBody.appendChild(row);
        }

    } else {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="no-data">
                    Hiç veri bulunamadı.
                </td>
            </tr>
        `;

    }

}, (error) => {

    console.error("Firebase veri okuma hatası:", error);

    tableBody.innerHTML = `
        <tr>
            <td colspan="3" class="no-data" style="color:#ef4444;">
                Veriler alınamadı. Firebase Rules kontrol edilmeli.
            </td>
        </tr>
    `;

});
```
