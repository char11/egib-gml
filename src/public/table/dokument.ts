import { EGB_RodzajDokumentu } from "../egib/dokumenty";
import { egbFeatures, htmlIDs } from "../egib/features";

function tableGetData(obj: EGB_DokumentType) {
	return obj.dataDokumentu ? new Date(obj.dataDokumentu).toLocaleDateString("pl-PL") : "";
}

function tableGetRodzaj(obj: EGB_DokumentType) {
	let ret = "";
	if (obj.rodzajDokumentu) {
		const rodzajDokumentu = EGB_RodzajDokumentu[obj.rodzajDokumentu];
		if (rodzajDokumentu) {
			ret += rodzajDokumentu;
		}
	}
	return ret;
}

function tableGetTytul(obj: EGB_DokumentType) {
	return obj.tytul ? obj.tytul : "";
}

function tableGetNazwaTworcy(obj: EGB_DokumentType) {
	return obj.nazwaTworcyDokumentu ? obj.nazwaTworcyDokumentu : "";
}

function tableGetOpis(obj: EGB_DokumentType) {
	return obj.opisDokumentu ? obj.opisDokumentu : "";
}

function tableGetSygnatura(obj: EGB_DokumentType) {
	return obj.sygnaturaDokumentu ? obj.sygnaturaDokumentu : "";
}

function tableGetOznKancelaryjne(obj: EGB_DokumentType) {
	return obj.oznKancelaryjneDokumentu ? obj.oznKancelaryjneDokumentu : "";
}

export function tableDokumenty() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Data" +
			"</th><th>" +
			"Rodzaj" +
			"</th><th>" +
			"Tytuł" +
			"</th><th>" +
			"Nazwa twórcy" +
			"</th><th>" +
			"Opis" +
			"</th><th>" +
			"Sygnatura" +
			"</th><th>" +
			"Oznaczenie kancelaryjne" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 12%;">' +
			'<col span="1" style="width: 13%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 30%;">' +
			'<col span="1" style="width: 12%;">' +
			'<col span="1" style="width: 8%;"></colgroup>';
	}
	for (const obj of egbFeatures.dokumenty.values()) {
		const td1 = tableGetData(obj);
		const td2 = tableGetRodzaj(obj);
		const td3 = tableGetTytul(obj);
		const td4 = tableGetNazwaTworcy(obj);
		const td5 = tableGetOpis(obj);
		const td6 = tableGetSygnatura(obj);
		const td7 = tableGetOznKancelaryjne(obj);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter) ||
			td5.toLowerCase().includes(filter) ||
			td6.toLowerCase().includes(filter) ||
			td7.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iDokument +
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
					"</td><td>" +
					td6 +
					"</td><td>" +
					td7 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
