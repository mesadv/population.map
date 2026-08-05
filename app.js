onValue(dbRef, (snapshot) => {
    // Tabloyu temizle
    tableBody.innerHTML = "";

    if (snapshot.exists()) {
        const data = snapshot.val();

        // 'veri' altındaki tüm bina nesnelerini dolaş
        for (let binaAdi in data) {
            const row = document.createElement("tr");

            // Sayaç ve adres değerleri (yoksa varsayılan değer)
            const sayacDegeri = data[binaAdi].sayac ?? 0;
            const acikAdres = data[binaAdi].adres ?? "-";

            row.innerHTML = `
                <td><strong>${binaAdi}</strong></td>
                <td>${acikAdres}</td>
                <td>${sayacDegeri}</td>
            `;

            tableBody.appendChild(row);
        }
    } else {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="no-data">
                    Hiç veri bulunamadı. Lütfen Firebase konsolunda ana düğüm adının 'veri' olduğunu doğrulayın.
                </td>
            </tr>
        `;
    }
}, (error) => {
    console.error("Firebase veri okuma hatası:", error);

    tableBody.innerHTML = `
        <tr>
            <td colspan="3" class="no-data" style="color:#ef4444;">
                Veriler alınamadı. Firebase Realtime Database Kurallarını (Rules) kontrol edin!
            </td>
        </tr>
    `;
});
