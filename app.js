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

// 3. Firebase servislerini başlatıyoruz
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// 4. HTML tablo gövdesini seçiyoruz
const tableBody = document.getElementById('data-table-body');

// 5. Firebase'deki veri düğümüne bağlanıyoruz
const dbRef = ref(database, 'veri');

// 6. Canlı veri dinleyici
onValue(dbRef, (snapshot) => {

    // Eski tabloyu temizle
    tableBody.innerHTML = "";

    if (snapshot.exists()) {

        const data = snapshot.val();

        // Bina listesini döngüyle al
        for (let binaAdi in data) {

            const row = document.createElement('tr');

            // Sayaç değerini al
            const sayacDegeri = data[binaAdi].sayac !== undefined 
                ? data[binaAdi].sayac 
                : 0;

            // 2 sütunlu satır oluştur
            row.innerHTML = `
                <td><strong>${binaAdi}</strong></td>
                <td>${sayacDegeri}</td>
            `;

            tableBody.appendChild(row);
        }

    } else {

        tableBody.innerHTML = `
            <tr>
                <td colspan="2" class="no-data">
                    Hiç veri bulunamadı. Lütfen Firebase konsolunda ana düğüm adının 'veri' olduğunu doğrulayın.
                </td>
            </tr>
        `;
    }

}, (error) => {

    console.error("Firebase veri okuma hatası:", error);

    tableBody.innerHTML = `
        <tr>
            <td colspan="2" class="no-data" style="color:#ef4444;">
                Veriler alınamadı. Firebase Realtime Database Kurallarını kontrol edin!
            </td>
        </tr>
    `;
});
