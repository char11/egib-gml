import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_StatusPodmiotuEwid } from "../egib/udzialy";
import { tableGetAdresPodmiotu, tableGetInstytucjaSkr, tableGetMalzenstwoSkr, tableGetOsobaSkr } from "./table";

function tableGetNazwa(obj: EGB_PodmiotGrupowyType) {
	return obj.nazwaPelna ? obj.nazwaPelna : "";
}

function tableGetRegon(obj: EGB_PodmiotGrupowyType) {
	return obj.regon ? obj.regon : "";
}

function tableGetStatus(obj: EGB_PodmiotGrupowyType) {
	let ret = "";
	if (obj.status) {
		if (obj.status === "32" || obj.status === "33") {
			ret = EGB_StatusPodmiotuEwid[obj.status];
		}
	}
	return ret;
}

function tableGetSklad(obj: EGB_PodmiotGrupowyType) {
	let ret: string[] = [];
	if (obj.instytucja) {
		if (Array.isArray(obj.instytucja)) {
			obj.instytucja.forEach((key) => {
				if (key) {
					ret.push(tableGetInstytucjaSkr(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetInstytucjaSkr(obj.instytucja._attributes.href));
		}
	}
	if (obj.osobaFizyczna4) {
		if (Array.isArray(obj.osobaFizyczna4)) {
			obj.osobaFizyczna4.forEach((key) => {
				if (key) {
					ret.push(tableGetOsobaSkr(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetOsobaSkr(obj.osobaFizyczna4._attributes.href));
		}
	}
	if (obj.malzenstwo3) {
		if (Array.isArray(obj.malzenstwo3)) {
			obj.malzenstwo3.forEach((key) => {
				if (key) {
					ret.push(tableGetMalzenstwoSkr(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetMalzenstwoSkr(obj.malzenstwo3._attributes.href));
		}
	}
	return ret.length ? ret.join(", ") : "";
}

function tableGetAdresPodmiotuGrupowego(obj: EGB_PodmiotGrupowyType) {
	return obj.adresSiedziby ? tableGetAdresPodmiotu(obj.adresSiedziby._attributes.href) : "";
}

export function tablePodmiotyGrupowe() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Nazwa" + "</th><th>" + "Regon" + "</th><th>" + "Status" + "</th><th>" + "Skład" + "</th><th>" + "Adres" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 25%;">' +
			'<col span="1" style="width: 20%;"></colgroup>';
	}
	for (const obj of egbFeatures.podmiotyGrupowe.values()) {
		const td1 = tableGetNazwa(obj);
		const td2 = tableGetRegon(obj);
		const td3 = tableGetStatus(obj);
		const td4 = tableGetSklad(obj);
		const td5 = tableGetAdresPodmiotuGrupowego(obj);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter) ||
			td5.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iPodmiotGrupowy +
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
					"</td><td>" +
					td5 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
