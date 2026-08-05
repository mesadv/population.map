import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
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
const analytics = getAnalytics(app);


const tableBody = document.getElementById("data-table-body");

const dbRef = ref(database, "veri");


onValue(dbRef, (snapshot) => {

    tableBody.innerHTML = "";


    if (!snapshot.exists()) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="no-data">
                    Hiç bina bulunamadı.
                </td>
            </tr>
        `;

        return;
    }


    const data = snapshot.val();


    for (let binaAdi in data) {

        const bina = data[binaAdi];


        const adres =
            bina.adres ??
            bina.acikAdres ??
            bina["açıkAdres"] ??
            "-";


        const sayac =
            bina.sayac ??
            bina["sayaç"] ??
            bina.kisiSayisi ??
            0;


        const row = document.createElement("tr");


        row.innerHTML = `
            <td><strong>${binaAdi}</strong></td>
            <td>${adres}</td>
            <td>${sayac}</td>
        `;


        tableBody.appendChild(row);
    }


}, (error) => {

    console.error("Firebase okuma hatası:", error);


    tableBody.innerHTML = `
        <tr>
            <td colspan="3" class="no-data" style="color:red;">
                Firebase verisi okunamadı.
            </td>
        </tr>
    `;

});
