import { getDokumenty, getOperaty, idIIPtoText } from "./common-functions";
import { egbFeatures } from "./features";

export function getZmiana(id: string) {
	let ret = '<div class="padded bottom-dashed-line"</div>';
	const obj = egbFeatures.zmiany.get(id);
	if (obj) {
		ret += '<div><span class="item">Utw. obiektu: </span>';
		if (obj.startObiekt) {
			ret += new Date(obj.startObiekt).toLocaleString("pl-PL");
		} else {
			ret += '<span class="error-inline">Brak daty utworzenia obiektu</span>';
		}
		if (obj.koniecObiekt) {
			ret += '<span class="item">&nbspKoniec obiektu: </span>' + obj.koniecObiekt;
		}
		ret += "</div>";
		ret += '<div><span class="item">Data przyjęcia zgłoszenia zmiany: </span>';
		if (obj.dataPrzyjeciaZgloszeniaZmiany) {
			ret += new Date(obj.dataPrzyjeciaZgloszeniaZmiany).toLocaleDateString("pl-PL");
		} else {
			ret += '<span class="error-inline">Brak daty przyjęcia zgłoszenia</span>';
		}
		ret += '<span class="item">&nbspData akceptacji zmiany: </span>';
		if (obj.dataAkceptacjiZmiany) {
			ret += new Date(obj.dataAkceptacjiZmiany).toLocaleDateString("pl-PL");
		} else {
			ret += '<span class="error-inline">Brak daty akceptacji</span>';
		}
		ret += "</div>";
		ret += '<div><span class="item">Numer zmiany: </span>';
		if (obj.nrZmiany == null) {
			ret += '<span class="error-inline">Brak numeru</span>';
		} else {
			ret += obj.nrZmiany;
		}
		ret += "</div>";
		ret += '<div><span class="item">Opis zmiany: </span>';
		if (obj.opisZmiany == null) {
			ret += '<span class="error-inline">Brak opisu</span>';
		} else {
			ret += obj.opisZmiany;
		}
		ret += "</div>";
		// dokument
		if (obj.dokument1) {
			ret += '<div class="item">Dokumenty:</div><div class="div-scroll">';
			ret += getDokumenty(obj.dokument1);
			ret += "</div>";
		}
		// operat
		if (obj.operatTechniczny1) {
			ret += '<div class="item">Operaty:</div><div class="div-scroll">';
			ret += getOperaty(obj.operatTechniczny1);
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
		ret += '<div class="error">Brak zmiany o podanym gml id</div>';
	}
	ret += "</div>";
	return ret;
}

export function pokazZmiane(id: string) {
	const wrapper = document.getElementById("main-wrapper");
	if (wrapper) {
		let html = '<div class="div-title"><span class="item">Zmiana: </span></div>';

		html += getZmiana(id);

		const div = document.createElement("div");
		div.innerHTML = html;
		wrapper.appendChild(div);
	}
}
