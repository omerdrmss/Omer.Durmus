// Sayfa açılınca sepeti tarayıcının hafızasından (localStorage) çek
var sepet = [];

window.onload = function() {
  var kayitli = localStorage.getItem("sepet");
  if (kayitli) {
    sepet = JSON.parse(kayitli);
  }

  // Sepet sayfasındaysak listeyi ekrana bas
  if (document.getElementById("sepet-listesi")) {
    sepetGoster();
  }

  // Ürün detay sayfasındaysak ürünü URL'den okuyup yükle
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  if (id && document.getElementById("urun-ad")) {
    urunYukle(id);
  }

  // Quiz alanı varsa quizi başlat ve butonları bağla
  if (document.getElementById("quiz-ekrani")) {
    quiziBaslat();
    
    document.getElementById("btn-sonraki").addEventListener("click", sonrakiSoru);
    document.getElementById("btn-yeniden").addEventListener("click", quiziBaslat);
  }
};

// --- SEPET İŞLEMLERİ ---

function sepeteEkle(ad, fiyat) {
  sepet.push({ ad: ad, fiyat: fiyat });
  localStorage.setItem("sepet", JSON.stringify(sepet));
  
  var mesajAlani = document.getElementById("mesaj");
  if (mesajAlani) {
    mesajAlani.textContent = ad + " sepete eklendi!";
  }
}

function sepetGoster() {
  var liste = document.getElementById("sepet-listesi");
  var toplamDiv = document.getElementById("toplam");
  var bosMesaj = document.getElementById("bos-mesaj");
  liste.innerHTML = ""; // Listeyi temizle

  if (sepet.length === 0) {
    bosMesaj.textContent = "Sepetiniz boş.";
    toplamDiv.textContent = "";
    return;
  }

  bosMesaj.textContent = "";
  var toplam = 0;

  for (var i = 0; i < sepet.length; i++) {
    var li = document.createElement("li");

    var adSpan = document.createElement("span");
    adSpan.textContent = sepet[i].ad;

    var fiyatSpan = document.createElement("span");
    fiyatSpan.textContent = sepet[i].fiyat + " TL";
    fiyatSpan.className = "fiyat-span";

    var silBtn = document.createElement("button");
    silBtn.textContent = "Sil";
    silBtn.className = "btn-sil";
    silBtn.setAttribute("data-index", i);
    
    // Silme butonuna tıklanma olayını ekle
    silBtn.onclick = function() {
      sepettenCikar(parseInt(this.getAttribute("data-index")));
    };

    li.appendChild(adSpan);
    li.appendChild(fiyatSpan);
    li.appendChild(silBtn);
    liste.appendChild(li);

    toplam += sepet[i].fiyat;
  }

  toplamDiv.textContent = "Toplam: " + toplam + " TL";
}

function sepettenCikar(index) {
  sepet.splice(index, 1);
  localStorage.setItem("sepet", JSON.stringify(sepet));
  sepetGoster(); // Sepeti güncelle
}

// --- İLETİŞİM FORMU ---

function formuGonder() {
  var ad = document.getElementById("ad").value.trim();
  var eposta = document.getElementById("eposta").value.trim();
  var mesaj = document.getElementById("mesaj-alan").value.trim();
  var sonuc = document.getElementById("form-sonuc");

  if (ad === "" || eposta === "" || mesaj === "") {
    sonuc.textContent = "Lütfen tüm alanları doldurun.";
    sonuc.style.color = "red";
    return;
  }

  sonuc.textContent = "Mesajınız alındı, teşekkür ederiz!";
  sonuc.style.color = "green";
  
  // Formu temizle
  document.getElementById("ad").value = "";
  document.getElementById("eposta").value = "";
  document.getElementById("mesaj-alan").value = "";
}

// --- ÜRÜN DETAY SAYFASI ---
var urunler = {
  "1": { ad: "Profesyonel Futbol Topu", fiyat: 349, resim: "../img/futbol-topu.png", aciklama: "Yüksek dayanıklılık sunan sentetik deri yapısıyla maçlara uygundur." },
  "2": { ad: "Basketbol Topu No:7", fiyat: 420, resim: "../img/basketbol.png", aciklama: "Kapalı ve açık alanlarda kullanıma uygun, 7 numara basketbol topu." },
  "3": { ad: "Tenis Raketi", fiyat: 780, resim: "../img/tenis-raketi.png", aciklama: "Hafif ama sağlam yapıya sahip tenis raketi. Her oyuncu için uygundur." },
  "4": { ad: "Yüzme Gözlüğü", fiyat: 190, resim: "../img/yuzme-gozlugu.png", aciklama: "UV korumalı ve anti-buğu camlara sahip yüzme gözlüğü." },
  "5": { ad: "Bisiklet Kaskı", fiyat: 550, resim: "../img/bisiklet-kaskı.png", aciklama: "Hafif dış kabuk ve havalandırma kanalları sayesinde serin tutar." },
  "6": { ad: "Boks Eldiveni 12 oz", fiyat: 650, resim: "../img/boks-eldiveni.png", aciklama: "Yoğun köpük dolgu ile hazırlanmış 12 oz boks eldiveni." }
};

function urunYukle(id) {
  var u = urunler[id];
  if (!u) return;
  document.getElementById("urun-ad").textContent = u.ad;
  document.getElementById("urun-fiyat").textContent = u.fiyat + " TL";
  document.getElementById("urun-resim").src = u.resim;
  document.getElementById("urun-resim").alt = u.ad;
  document.getElementById("urun-aciklama").textContent = u.aciklama;
  
  document.getElementById("btn-ekle").onclick = function() {
    sepeteEkle(u.ad, u.fiyat);
  };
}

// --- QUIZ UYGULAMASI ---

var sorular = [
  { soru: "Hangi takım 2000 yılında UEFA Kupası'nı kazanarak Türk futbol tarihine geçmiştir?", secenekler: ["Beşiktaş", "Fenerbahçe", "Galatasaray", "Trabzonspor"], cevap: "Galatasaray" },
  { soru: "'Dört Büyükler' olarak bilinen takımlardan hangisinin renkleri Bordo-Mavi'dir?", secenekler: ["Bursaspor", "Trabzonspor", "Göztepe", "Sivasspor"], cevap: "Trabzonspor" },
  { soru: "2002 FIFA Dünya Kupası'nda Türkiye Milli Takımı kaçıncı olmuştur?", secenekler: ["İkinci", "Üçüncü", "Dördüncü", "Çeyrek Final"], cevap: "Üçüncü" },
  { soru: "Fenerbahçe'nin efsanevi Brezilyalı futbolcusu Alex de Souza'nın heykeli İstanbul'un hangi semtindedir?", secenekler: ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar"], cevap: "Kadıköy" },
  { soru: "Türkiye'de 'İmparator' lakabıyla anılan efsane teknik direktör kimdir?", secenekler: ["Şenol Güneş", "Mustafa Denizli", "Fatih Terim", "Ersun Yanal"], cevap: "Fatih Terim" },
  { soru: "'Taçsız Kral' lakaplı, Türk futbolunun efsanevi golcüsü kimdir?", secenekler: ["Lefter Küçükandonyadis", "Hakkı Yeten", "Metin Oktay", "Tanju Çolak"], cevap: "Metin Oktay" },
  { soru: "Hangi Türk futbolcu kariyerinde Barcelona ve Atletico Madrid formaları giymiştir?", secenekler: ["Nihat Kahveci", "Emre Belözoğlu", "Tugay Kerimoğlu", "Arda Turan"], cevap: "Arda Turan" },
  { soru: "EURO 2008 Avrupa Şampiyonası'nda Türkiye Milli Takımı hangi aşamaya kadar yükselmiştir?", secenekler: ["Son 16", "Çeyrek Final", "Yarı Final", "Final"], cevap: "Yarı Final" },
  { soru: "Türkiye Süper Ligi'nda şampiyonluk yaşayan ilk Anadolu takımı hangisidir?", secenekler: ["Bursaspor", "Trabzonspor", "Eskişehirspor", "Kocaelispor"], cevap: "Trabzonspor" },
  { soru: "Süper Lig'de 'namağlup şampiyon' olma unvanına sahip olan tek takım hangisidir?", secenekler: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Başakşehir"], cevap: "Beşiktaş" }
];

var soruIndex = 0;
var dogruSayisi = 0;

function quiziBaslat() {
  soruIndex = 0;
  dogruSayisi = 0;
  document.getElementById("quiz-sonuc-ekrani").style.display = "none";
  document.getElementById("quiz-ekrani").style.display = "block";
  soruGoster();
}

function soruGoster() {
  var s = sorular[soruIndex];
  document.getElementById("soru-metni").textContent = (soruIndex + 1) + ". " + s.soru;
  document.getElementById("quiz-mesaj").textContent = "";
  document.getElementById("btn-sonraki").style.display = "none";

  var alan = document.getElementById("secenekler-alani");
  alan.innerHTML = "";

  for (var i = 0; i < s.secenekler.length; i++) {
    var btn = document.createElement("button");
    btn.textContent = s.secenekler[i];
    btn.className = "btn-secenek";
    btn.setAttribute("data-cevap", s.secenekler[i]);
    btn.onclick = secenekTikla;
    alan.appendChild(btn);
  }
}

function secenekTikla() {
  var secilen = this.getAttribute("data-cevap");
  var dogru = sorular[soruIndex].cevap;
  var mesaj = document.getElementById("quiz-mesaj");
  var butonlar = document.getElementById("secenekler-alani").getElementsByTagName("button");

  // Bir seçenek seçilince diğerlerini pasif yap
  for (var i = 0; i < butonlar.length; i++) {
    butonlar[i].disabled = true;
  }

  if (secilen === dogru) {
    this.classList.add("dogru");
    mesaj.textContent = "Doğru!";
    mesaj.style.color = "green"; 
    dogruSayisi++;
  } else {
    this.classList.add("yanlis");
    mesaj.textContent = "Yanlış. Doğrusu: " + dogru;
    mesaj.style.color = "red"; 
    
    for (var j = 0; j < butonlar.length; j++) {
      if (butonlar[j].getAttribute("data-cevap") === dogru) {
        butonlar[j].classList.add("dogru");
      }
    }
  }

  document.getElementById("btn-sonraki").style.display = "inline-block";
}

function sonrakiSoru() {
  soruIndex++;
  if (soruIndex < sorular.length) {
    soruGoster();
  } else {
    quizBitir();
  }
}

function quizBitir() {
  document.getElementById("quiz-ekrani").style.display = "none";
  document.getElementById("quiz-sonuc-ekrani").style.display = "block";

  var metin = "10 sorudan " + dogruSayisi + " tanesini doğru bildin.<br><br>";

  if (dogruSayisi === 10) {
    metin += "Tebrikler! Tam bir futbol uzmanısın.";
  } else if (dogruSayisi >= 7) {
    metin += "Güzel! Türk futboluna oldukça hakimsin.";
  } else if (dogruSayisi >= 4) {
    metin += "Fena değil, biraz daha çalışmalısın.";
  } else {
    metin += "Futbolla aran pek iyi değil gibi.";
  }

  document.getElementById("skor-metni").innerHTML = metin;
}