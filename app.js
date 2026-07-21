// 1. Firebase modüllerini CDN üzerinden yüklüyoruz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// 2. Firebase Yapılandırması (Analytics ve Database bilgileri dahil)
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

// 3. Firebase Servislerini Başlatıyoruz
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// 4. HTML'deki tablo gövdesini (tbody) seçiyoruz
const tableBody = document.getElementById('data-table-body');

// 5. Veritabanındaki 'veri' düğümüne referans oluşturuyoruz
const dbRef = ref(database, 'veri');

// 6. Realtime Database Canlı Veri Dinleyici
onValue(dbRef, (snapshot) => {
    // Tabloyu her güncellemede temizle (eski veriler üst üste binmesin)
    tableBody.innerHTML = "";

    if (snapshot.exists()) {
        const data = snapshot.val();

        // 'veri' altındaki tüm bina nesnelerini döngüye alıyoruz
        for (let binaAdi in data) {
            const row = document.createElement('tr');
            
            // Binanın 'sayac' değerini alıyoruz, tanımlı değilse 0 yazıyoruz
            const sayacDegeri = data[binaAdi].sayac !== undefined ? data[binaAdi].sayac : 0;
            
            // Satır HTML yapısı
            row.innerHTML = `
                <td><strong>${binaAdi}</strong></td>
                <td>${sayacDegeri}</td>
            `;
            
            // Satırı tablo gövdesine ekliyoruz
            tableBody.appendChild(row);
        }
    } else {
        tableBody.innerHTML = `<tr><td colspan="2" class="no-data">Hiç veri bulunamadı. Lütfen Firebase konsolunda ana düğüm adının 'veri' olduğunu doğrulayın.</td></tr>`;
    }
}, (error) => {
    console.error("Firebase veri okuma hatası: ", error);
    tableBody.innerHTML = `<tr><td colspan="2" class="no-data" style="color: #ef4444;">Veriler alınamadı. Firebase Realtime Database Kurallarını (Rules) kontrol edin!</td></tr>`;
});
