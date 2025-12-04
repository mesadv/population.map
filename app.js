// Firebase yapılandırmasını ekleyin
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase'i başlat
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Chart.js ile grafik oluşturmak için
const ctx = document.getElementById('myChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'line', // Çizgi grafik
    data: {
        labels: [], // Zaman etiketleri
        datasets: [{
            label: 'Veri Grafiği',
            data: [], // Grafik için veri
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

// Veriyi Firebase'ten çekme ve grafikte gösterme
function fetchDataAndUpdateChart() {
    const dbRef = database.ref('veriler');  // Firebase verilerinizi bu kısımda tutuyoruz
    dbRef.once('value', (snapshot) => {
        const data = snapshot.val();
        const labels = [];
        const values = [];

        // Veriyi uygun şekilde işleyelim
        for (let key in data) {
            labels.push(key);   // Zaman etiketleri veya tarih
            values.push(data[key].value);   // Veri değeri
        }

        // Grafik verisini güncelle
        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();
    });
}

// İlk veri çekme ve grafiği oluşturma
fetchDataAndUpdateChart();

// 5 saniyede bir veriyi yenile
setInterval(fetchDataAndUpdateChart, 5 * 1000); 
// 5 * 1000 = 5000 milisaniye, yani 5 saniye