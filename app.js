<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Population Map - Bina Listesi</title>
    
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .container {
            width: 90%;
            max-width: 600px;
            background: white;
            padding: 30px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            box-sizing: border-box;
        }
        h1 {
            text-align: center;
            color: #1f2937;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }
        /* Tablo Tasarımı */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background-color: #fff;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background-color: #4CAF50; /* Yeşil Tema */
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
        }
        tr:hover {
            background-color: #f9fafb;
        }
        .loading {
            text-align: center;
            color: #6b7280;
            font-style: italic;
            padding: 20px;
        }
        .no-data {
            text-align: center;
            color: #9ca3af;
            padding: 20px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Binalar Güncel Sayaç Listesi</h1>
        
        <table>
            <thead>
                <tr>
                    <th>Bina Adı</th>
                    <th>Sayaç / Nüfus</th>
                </tr>
            </thead>
            <tbody id="data-table-body">
                <tr>
                    <td colspan="2" class="loading">Veriler Firebase'den yükleniyor...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
        // Canlı (Real-time) dinleme için onValue modülünü kullanıyoruz
        import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

        // Firebase Yapılandırması
        const firebaseConfig = {
            apiKey: "AIzaSyCVp9jSagLcb8v6Ei2dhmpQrJAWSYxgZ48",
            authDomain: "populationmap-48dd0.firebaseapp.com",
            databaseURL: "https://populationmap-48dd0-default-rtdb.firebaseio.com",
            projectId: "populationmap-48dd0",
            storageBucket: "populationmap-48dd0.firebasestorage.app",
            messagingSenderId: "387203070252",
            appId: "1:387203070252:web:b0ed4f1ff520f6f2bc5489"
        };

        // Firebase'i Başlat
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);

        // Tablo gövdesini seçiyoruz
        const tableBody = document.getElementById('data-table-body');

        // DOĞRU YOL: 'veriler' yerine doğrudan 'binalar' düğümünü dinliyoruz
        const dbRef = ref(database, 'binalar');
        
        // onValue kullanarak 5 saniyede bir beklemek yerine, Firebase'de veri değiştiği an tabloyu güncelliyoruz
        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                
                // Tabloyu her güncellemede temizle
                tableBody.innerHTML = "";

                // 'binalar' altındaki tüm alt düğümleri (Bina 1, Bina 2 vb.) döngüye sokuyoruz
                Object.keys(data).forEach((binaAdi) => {
                    const row = document.createElement('tr');
                    
                    // DOĞRU DEĞİŞKEN: data[binaAdi].value yerine data[binaAdi].sayac okuyoruz
                    const sayacDegeri = data[binaAdi].sayac !== undefined ? data[binaAdi].sayac : 0;
                    
                    row.innerHTML = `
                        <td><strong>${binaAdi}</strong></td>
                        <td>${sayacDegeri}</td>
                    `;
                    
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="2" class="no-data">Hiç bina bulunamadı. Veritabanınızı kontrol edin.</td></tr>`;
            }
        }, (error) => {
            console.error("Firebase veri okuma hatası: ", error);
            tableBody.innerHTML = `<tr><td colspan="2" class="no-data" style="color: #ef4444;">Veriler alınamadı. Rules (Kurallar) sekmesini kontrol edin!</td></tr>`;
        });

    </script>
</body>
</html>
