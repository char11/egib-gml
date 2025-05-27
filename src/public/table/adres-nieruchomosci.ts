import { egbFeatures, htmlIDs } from "../egib/features";

function tableGetNazwaMiejscowosci(obj: EGB_AdresNieruchomosciType) {
	return obj.nazwaMiejscowosci ? obj.nazwaMiejscowosci : "";
}

function tableGetNazwaUlicy(obj: EGB_AdresNieruchomosciType) {
	return obj.nazwaUlicy ? obj.nazwaUlicy : "";
}

function tableGetNumery(obj: EGB_AdresNieruchomosciType) {
	let ret = "";
	if (obj.numerPorzadkowy) {
		ret += obj.numerPorzadkowy;
	}
	if (obj.numerLokalu) {
		ret += "/" + obj.numerLokalu;
	}
	return ret;
}

export function tableAdresyNieruchomosci() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Nazwa miejscowości" + "</th><th>" + "Nazwa ulicy" + "</th><th>" + "Nr porządkowy/nr lokalu" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 30%;">' + '<col span="1" style="width: 40%;">' + '<col span="1" style="width: 30%;"></colgroup>';
	}
	for (const obj of egbFeatures.adresyNieruchomosci.values()) {
		const td1 = tableGetNazwaMiejscowosci(obj);
		const td2 = tableGetNazwaUlicy(obj);
		const td3 = tableGetNumery(obj);
		const filter = tableFilter.value.toLowerCase();
		if (!filter || td1.toLowerCase().includes(filter) || td2.toLowerCase().includes(filter) || td3.toLowerCase().includes(filter)) {
			ret.push(
				'<tr id="' +
					htmlIDs.iAdresNieruchomosci +
					obj._attributes.id +
					'" onclick="tableShowEgbFeature(this.id)">' +
					"<td>" +
					td1 +
					"</td><td>" +
					td2 +
					"</td><td>" +
					td3 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
