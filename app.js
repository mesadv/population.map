// 1. Gerekli modülleri CDN üzerinden içe aktarıyoruz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 2. Projenizin yapılandırma bilgileri (Sadece API Key ve App ID eksik)
const firebaseConfig = {
    apiKey: "AIzaSyCVp9jSagLcb8v6Ei2dhmpQrJAWSYxgZ48", // Firebase konsolundan alacağınız Web API Anahtarı
    authDomain: "populationmap-48dd0.firebaseapp.com",
    databaseURL: "https://populationmap-48dd0-default-rtdb.firebaseio.com",
    projectId: "populationmap-48dd0",
    storageBucket: "populationmap-48dd0.firebasestorage.app",
    messagingSenderId: "387203070252",
    appId: "1:387203070252:web:b0ed4f1ff520f6f2bc5489" // Firebase konsolundan alacağınız Web App ID
};

// 3. Firebase'i başlatıyoruz
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Chart.js ile grafik oluşturma kısmı (Değişmedi)
const ctx = document.getElementById('myChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Veri Grafiği',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            x: { beginAtZero: true }
        }
    }
});

// 4. Veriyi modüler yapıya uygun şekilde çekiyoruz (get ve ref kullanarak) [2]
function fetchDataAndUpdateChart() {
    const dbRef = ref(database, 'veriler');  // Modüler 'ref' fonksiyonu [2]
    
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const labels = [];
            const values = [];

            // Veriyi işleyelim
            for (let key in data) {
                labels.push(key); 
                values.push(data[key].value);
            }

            // Grafik verisini güncelle
            chart.data.labels = labels;
            chart.data.datasets[0].data = values;
            chart.update();
        } else {
            console.log("Veri bulunamadı.");
        }
    }).catch((error) => {
        console.error("Veri çekme hatası: ", error);
    });
}

// İlk veri çekme ve grafiği oluşturma
fetchDataAndUpdateChart();

// 5 saniyede bir veriyi yenile
setInterval(fetchDataAndUpdateChart, 5 * 1000); 
