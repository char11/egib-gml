import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_KodStabilizacji, EGB_SpelnienieWarunkowDokladnosciowych, EGB_SposobPozyskania } from "../egib/punkty-graniczne";

function tableGetId(obj: EGB_PunktGranicznyType) {
	return obj.idPunktu ? obj.idPunktu : "";
}

function tableGetPozyskanie(obj: EGB_PunktGranicznyType) {
	let ret = "";
	if (obj.sposobPozyskania) {
		const sposobPozyskania = EGB_SposobPozyskania[obj.sposobPozyskania];
		if (sposobPozyskania) {
			ret += sposobPozyskania;
		}
	}
	return ret;
}

function tableGetDokladnosc(obj: EGB_PunktGranicznyType) {
	let ret = "";
	if (obj.spelnienieWarunkowDokl) {
		const spelnienieWarunkowDokl = EGB_SpelnienieWarunkowDokladnosciowych[obj.spelnienieWarunkowDokl];
		if (spelnienieWarunkowDokl) {
			ret += spelnienieWarunkowDokl;
		}
	}
	return ret;
}

function tableGetStabilizacja(obj: EGB_PunktGranicznyType) {
	let ret = "";
	if (obj.rodzajStabilizacji) {
		const rodzajStabilizacji = EGB_KodStabilizacji[obj.rodzajStabilizacji];
		if (rodzajStabilizacji) {
			ret += rodzajStabilizacji;
		}
	}
	return ret;
}

function tableGetOznaczenie(obj: EGB_PunktGranicznyType) {
	return obj.oznWMaterialeZrodlowym ? obj.oznWMaterialeZrodlowym : "";
}
function tableGetOperat(obj: EGB_PunktGranicznyType) {
	return obj.numerOperatuTechnicznego ? obj.numerOperatuTechnicznego : "";
}

export function tablePunktyGraniczne() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;

	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Identyfikator" +
			"</th><th>" +
			"Sposób pozyskania" +
			"</th><th>" +
			"Spełnienie warunków dokładnościowych" +
			"</th><th>" +
			"Rodzaj stabilizacji" +
			"</th><th>" +
			"Oznaczenie w materiale źródłowym" +
			"</th><th>" +
			"Nr operatu technicznego" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 20%;"></colgroup>';
	}

	for (const obj of egbFeatures.punktyGraniczne.values()) {
		const td1 = tableGetId(obj);
		const td2 = tableGetPozyskanie(obj);
		const td3 = tableGetDokladnosc(obj);
		const td4 = tableGetStabilizacja(obj);
		const td5 = tableGetOznaczenie(obj);
		const td6 = tableGetOperat(obj);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter) ||
			td5.toLowerCase().includes(filter) ||
			td6.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iPunktGraniczny +
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
					"</td></tr>",
			);
		}
	}
	return ret;
}
