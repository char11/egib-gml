import { getDokumenty, idIIPtoText } from "./common-functions";
import { egbFeatures } from "./features";

export const EGB_RodzajDokumentu: { [key: string]: string } = {
	"1": "umowa, akt notarialny", // 1
	"2": "akt własności ziemi", // 2
	"3": "decyzja administracyjna inna niż AWZ", // 3
	"4": "orzeczenie sądu, postanowienie, wyrok", // 4
	"5": "wyciag, odpis z ksiegi wieczystej", // 5
	"6": "wyciag, odpis z ksiegi hipotecznej", // 6
	"7": "odpis, akt KW lub zbioru dokumentu", // 7
	"8": "zawiadomienie z wydziału KW", // 8
	"9": "wniosek w sprawie zmiany", // 9
	"10": "wyciąg z dokumentacji budowy budynku", // 10
	"11": "protokół", // 11
	"12": "ustawa", // 12
	"13": "rozporządzenie", // 13
	"14": "uchwala", // 14
	"15": "zarządzenie", // 15
	"16": "odpis, wyciąg z innego rejestru publicznego", // 16
	"17": "pełnomocnictwo", // 17
	"19": "inny dokument", // 19
	"20": "dokument architektoniczo-budowlany", // 20
	"21": "dokument planistyczny", // 21
	"22": "akt poswiadczenia dziedziczenia", // 22
	"23": "zawiadomienie z PESEL", // 23
	"24": "zgłoszenie zmiany sposobu użytkowania", // 24
};

export function getDokument(id: string) {
	let ret = '<div class="padded bottom-dashed-line">';
	const obj = egbFeatures.dokumenty.get(id);
	if (obj) {
		ret += '<div><span class="item">Utw. obiektu: </span>';
		if (obj.startObiekt) {
			ret += new Date(obj.startObiekt).toLocaleString("pl-PL");
		} else {
			ret += '<span class="error-inline">Brak daty utworzenia obiektu</span>';
		}
		if (obj.koniecObiekt) {
			ret += '<span class="item">&nbspKoniec obiektu: </span>' + new Date(obj.koniecObiekt).toLocaleString("pl-PL");
		}
		ret += "</div>";
		ret += "<div>";
		if (obj.dataDokumentu) {
			ret += '<span class="item">Data dokumentu: </span>';
			ret += new Date(obj.dataDokumentu).toLocaleDateString("pl-PL") + " ";
		}
		ret += '<span class="item">Rodzaj dokumentu: </span>';
		if (obj.rodzajDokumentu) {
			const rodzajDokumentu = EGB_RodzajDokumentu[obj.rodzajDokumentu];
			if (rodzajDokumentu) {
				ret += rodzajDokumentu;
			} else {
				ret += ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
			}
		} else {
			ret += '<span class="error-inline">Brak rodzaju</span>';
		}
		ret += "</div>";
		ret += '<div><span class="item">Tytuł: </span>';
		if (obj.tytul == null) {
			ret += '<span class="error-inline">Brak tytułu</span>';
		} else {
			ret += obj.tytul;
		}
		ret += "</div>";
		ret += '<div><span class="item">Nazwa twórcy dokumentu: </span>';
		if (obj.nazwaTworcyDokumentu == null) {
			ret += '<span class="error-inline">Brak nazwy twórcy</span>';
		} else {
			ret += obj.nazwaTworcyDokumentu;
		}
		ret += "</div>";

		ret += '<div><span class="item">Opis dokumentu: </span>';
		if (obj.opisDokumentu == null) {
			ret += '<span class="error-inline">Brak opisu</span>';
		} else {
			ret += obj.opisDokumentu;
		}
		ret += "</div>";
		ret += '<div><span class="item">Sygnatura dokumentu: </span>';
		if (obj.sygnaturaDokumentu == null) {
			ret += '<span class="error-inline">Brak sygnatury</span>';
		} else {
			ret += obj.sygnaturaDokumentu;
		}
		ret += '<span class="item">&nbspOznaczenie kancelaryjne dokumentu: </span>';
		if (obj.oznKancelaryjneDokumentu == null) {
			ret += '<span class="error-inline">Brak oznaczenia kancelaryjnego</span>';
		} else {
			ret += obj.oznKancelaryjneDokumentu;
		}
		ret += "</div>";
		if (obj.zasobSieciowy) {
			ret += '<div class="item">Zasob sieciowy: </div><div class="div-scroll">';
			if (Array.isArray(obj.zasobSieciowy)) {
				obj.zasobSieciowy.forEach((key) => {
					ret += "<div>" + key.linkage.URL ? key.linkage.URL : "" + "</div>";
				});
			} else {
				ret += "<div>" + obj.zasobSieciowy.linkage.URL ? obj.zasobSieciowy.linkage.URL : "" + "</div>";
			}
			ret += "</div>";
		}
		if (obj.zalacznikDokumentu) {
			ret += '<div class="item">Załącznik dokumentu: </div><div class="div-scroll">';
			ret += getDokumenty(obj.zalacznikDokumentu);
			ret += "</div>";
		}
		ret += '<div><span class="item">IIP: </span>';
		if (obj.idIIP) {
			ret += idIIPtoText(obj.idIIP);
		} else {
			ret += '<span class="error-inline">Brak IIP</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error-inline">Brak dokumentu o podanym gml id</div>';
	}
	ret += "</div>";
	return ret;
}

export function pokazDokument(id: string) {
	const wrapper = document.getElementById("main-wrapper");
	if (wrapper) {
		let html = '<div class="div-title"><span class="item">Dokument: </span></div>';
		html += getDokument(id);

		const div = document.createElement("div");
		div.innerHTML = html;
		wrapper.appendChild(div);
	}
}
