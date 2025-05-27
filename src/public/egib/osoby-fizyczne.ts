import { getAdresPodmiotuSkr } from "./adresy-podmiotu";
import { getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";
import { EGB_StatusPodmiotuEwid } from "./udzialy";

export const EGB_Plec: { [key: string]: string } = {
	"1": "męska", // 1
	"2": "żeńska", // 2
};

export function getOsobaSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.osobyFizyczne.get(id);
	if (obj) {
		// imiona
		if (obj.pierwszeImie == null) {
			ret += '<span class="error-inline">Brak imienia</span>';
		} else {
			ret += obj.pierwszeImie + " ";
		}
		// let tmp = obj.drugieImie;
		// if (tmp) {
		// 	ret += tmp + ' ';
		// }
		// nazwiska
		if (obj.pierwszyCzlonNazwiska == null) {
			ret += '<span class="error-inline">Brak nazwiska</span>';
		} else {
			ret += obj.pierwszyCzlonNazwiska;
		}
		if (obj.drugiCzlonNazwiska) {
			ret += "-" + obj.drugiCzlonNazwiska;
		}
	} else {
		ret += '<span class="error-inline">Brak osoby o podanym gml id</span>';
	}
	return ret;
}

function getImieNazwiskoRodzice(obj: EGB_OsobaFizycznaType) {
	let ret = "<div>";
	ret += '<div><span class="item">Pierwsze imię: </span>';
	if (obj.pierwszeImie == null) {
		ret += '<span class="error-inline">Brak imienia</span>';
	} else {
		ret += obj.pierwszeImie;
	}
	ret += "</div>";
	if (obj.drugieImie) {
		ret += '<div><span class="item">Drugie imię: </span>';
		ret += obj.drugieImie;
		ret += "</div>";
	}
	ret += '<div><span class="item">Pierwszy człon nazwiska: </span>';
	if (obj.pierwszyCzlonNazwiska == null) {
		ret += '<span class="error-inline">Brak nazwiska</span>';
	} else {
		ret += obj.pierwszyCzlonNazwiska;
	}
	ret += "</div>";
	if (obj.drugiCzlonNazwiska) {
		ret += '<div><span class="item">Drugi człon nazwiska: </span>';
		ret += obj.drugiCzlonNazwiska;
		ret += "</div>";
	}
	if (obj.imieOjca) {
		ret += '<div><span class="item">Imię ojca: </span>';
		ret += obj.imieOjca;
		ret += "</div>";
	}
	if (obj.imieMatki) {
		ret += '<div><span class="item">Imię matki: </span>';
		ret += obj.imieMatki;
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getPeselPlecInformacje(obj: EGB_OsobaFizycznaType) {
	let ret = "<div>";
	if (obj.pesel) {
		ret += '<div><span class="item">Pesel: </span>';
		ret += obj.pesel;
		ret += "</div>";
	}
	ret += '<div><span class="item">Płeć: </span>';
	if (obj.plec) {
		const plec = EGB_Plec[obj.plec];
		if (plec) {
			ret += plec;
		} else {
			ret += '<div class="error-inline">Nieprawidłowa wartość</div>';
		}
	} else {
		ret += '<span class="error-inline">Brak płci</span>';
	}
	ret += "</div>";
	if (obj.informacjaOSmierci) {
		ret += '<div><span class="item">Informacja o śmierci: </span>';
		ret += obj.informacjaOSmierci;
		ret += "</div>";
	}
	ret += '<div> <span class="item">Status: </span>';
	if (obj.status) {
		if (obj.status === "1") {
			ret += EGB_StatusPodmiotuEwid[obj.status];
		} else {
			ret += '<div class="error-inline">Nieprawidłowa wartość</div>';
		}
	} else {
		ret += '<span class="error-inline">Brak statusu</span>';
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getAdresy(obj: EGB_OsobaFizycznaType) {
	let ret = "<div>";
	if (obj.adresZameldowania) {
		ret +=
			'<div><span class="item">Adres zameldowania: </span>' +
			'<span class="cursor-pointer" id="' +
			htmlIDs.iAdresPodmiotu +
			obj.adresZameldowania._attributes.href +
			'" onclick="showEgbFeature(this.id)">' +
			getAdresPodmiotuSkr(obj.adresZameldowania._attributes.href) +
			"</span></div>";
	}
	if (obj.adresStalegoPobytu) {
		ret +=
			'<div><span class="item">Adres stałego pobytu: </span>' +
			'<span class="cursor-pointer" id="' +
			htmlIDs.iAdresPodmiotu +
			obj.adresStalegoPobytu._attributes.href +
			'" onclick="showEgbFeature(this.id)">' +
			getAdresPodmiotuSkr(obj.adresStalegoPobytu._attributes.href) +
			"</span></div>";
	}
	ret += "</div>";
	return ret;
}

export function pokazOsobeFizyczna(id: string) {
	const obj = egbFeatures.osobyFizyczne.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Osoba fizyczna: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getImieNazwiskoRodzice(obj);
			html += getPeselPlecInformacje(obj);
			html += getAdresy(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
