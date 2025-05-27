import { egbFeatures, htmlIDs } from "../egib/features";

function tableGetIdObrebu(obj: EGB_ObrebEwidencyjnyType) {
	return obj.idObrebu ? obj.idObrebu : "";
}

function tableGetLokalizacjaObrebu(obj: EGB_ObrebEwidencyjnyType) {
	let ret = "";
	if (obj.lokalizacjaObrebu) {
		const objJedn = egbFeatures.jednostkiEwidencyjne.get(obj.lokalizacjaObrebu._attributes.href);
		if (objJedn) {
			if (objJedn.nazwaWlasna) {
				ret = objJedn.nazwaWlasna;
			}
		}
	}
	return ret;
}

function tableGetNazweObrebu(obj: EGB_ObrebEwidencyjnyType) {
	return obj.nazwaWlasna ? obj.nazwaWlasna : "";
}

function tableGetPunktyGraniczne(obj: EGB_ObrebEwidencyjnyType) {
	let ret: string[] = [];

	if (obj.punktGranicyObrebu.length >= 3) {
		obj.punktGranicyObrebu.forEach((key) => {
			if (key) {
				const objPu = egbFeatures.punktyGraniczne.get(key._attributes.href);
				if (objPu) {
					if (objPu.idPunktu) {
						ret.push(objPu.idPunktu);
					}
				}
			}
		});
	}
	return ret.join(", ");
}

export function tableObrebyEwidencyjne() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<thead><tr><th>" + "Identyfikator" + "</th><th>" + "Lokalizacja" + "</th><th>" + "Nazwa" + "</th><th>" + "Punkty graniczne" + "</th></tr></thead>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 60%;"></colgroup>';
	}
	for (const obj of egbFeatures.obrebyEwidencyjne.values()) {
		const td1 = tableGetIdObrebu(obj);
		const td2 = tableGetLokalizacjaObrebu(obj);
		const td3 = tableGetNazweObrebu(obj);
		const td4 = tableGetPunktyGraniczne(obj);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iObrebEwidencyjny +
					obj._attributes.id +
					'" onclick="tableShowEgbFeature(this.id)">' +
					"<td>" +
					td1 +
					"</td><td>" +
					td2 +
					"</td><td>" +
					td3 +
					"</td><td>" +
					td4 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
