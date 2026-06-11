// 1. Gerekli modülleri CDN üzerinden içe aktarıyoruz (onValue eklendi)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 2. Firebase projenizin yapılandırma bilgileri
const firebaseConfig = {
    apiKey: "AIzaSyCVp9jSagLcb8v6Ei2dhmpQrJAWSYxgZ48", 
    authDomain: "populationmap-48dd0.firebaseapp.com",
    databaseURL: "https://populationmap-48dd0-default-rtdb.firebaseio.com",
    projectId: "populationmap-48dd0",
    storageBucket: "populationmap-48dd0.firebasestorage.app",
    messagingSenderId: "387203070252",
    appId: "1:387203070252:web:b0ed4f1ff520f6f2bc5489"
};

// 3. Firebase'i başlatıyoruz
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// HTML'deki tablo gövdesini (tbody) seçiyoruz
const tableBody = document.getElementById('data-table-body');

// 4. Veriyi 'veri' düğümünden CANLI (Real-time) olarak çekiyoruz
const dbRef = ref(database, 'veri'); // İstediğin gibi düğüm adı 'veri' yapıldı

onValue(dbRef, (snapshot) => {
    // Tabloyu her güncellemede temizle (eski veriler üst üste binmesin)
    tableBody.innerHTML = "";

    if (snapshot.exists()) {
        const data = snapshot.val();

        // 'veri' düğümünün altındaki tüm binaları (Bina 1, Bina 2 vb.) döngüye alıyoruz
        for (let binaAdi in data) {
            const row = document.createElement('tr');
            
            // Binanın içindeki 'sayac' değerini okuyoruz, eğer boşsa 0 yazıyoruz
            const sayacDegeri = data[binaAdi].sayac !== undefined ? data[binaAdi].sayac : 0;
            
            // Tablo satırını oluşturuyoruz
            row.innerHTML = `
                <td><strong>${binaAdi}</strong></td>
                <td>${sayacDegeri}</td>
            `;
            
            // Satırı tabloya ekliyoruz
            tableBody.appendChild(row);
        }
    } else {
        // Eğer Firebase'de 'veri' adında bir düğüm yoksa veya içi boşsa
        tableBody.innerHTML = `<tr><td colspan="2" class="no-data">Hiç veri bulunamadı. Lütfen Firebase'de ana düğüm adının 'veri' olduğunu kontrol edin.</td></tr>`;
    }
}, (error) => {
    // Bağlantı veya yetki (Rules) hatası oluşursa
    console.error("Firebase veri okuma hatası: ", error);
    tableBody.innerHTML = `<tr><td colspan="2" class="no-data" style="color: #ef4444;">Veriler alınamadı. Firebase Realtime Database Kurallarını (Rules) kontrol edin!</td></tr>`;
});
