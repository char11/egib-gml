import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { egbFeatures } from "../egib/features";
import { tableGetAdres, tableGetJRG, tableGetPoleEwidencyjne } from "../table/dzialka-ewidencyjna";
import { tableGetArea } from "../table/table";
import { EGB_RodzajDokumentu } from "../egib/dokumenty";
import { pdfGetJE, pdfGetOE, pdfGetWlasnosciWladania } from "./pdf";

export function infoDlaDzialki(id: string) {
	const obj = egbFeatures.dzialkiEwidencyjne.get(id);
	if (obj) {
		const addFooters = () => {
			const pageCount = doc.getNumberOfPages();
			const pageSize = doc.internal.pageSize;
			const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
			doc.setFontSize(8);
			for (let i = 1; i <= pageCount; i++) {
				doc.setPage(i);
				doc.text(String(i) + " / " + String(pageCount), doc.internal.pageSize.getWidth() / 2, pageHeight - 8, { align: "center" });
			}
		};

		const doc = new jsPDF("p", "mm", "a4");
		doc.addFont("fonts/Lato-Regular.ttf", "sans", "normal");
		doc.setFont("sans", "normal");

		doc.text("Informacja dla działki", doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });

		doc.setFontSize(10);

		let table = pdfGetLokalizacja(obj);

		let data = tableGetJRG(obj).split(".").pop();
		if (data) {
			table.push(["JRG:", data]);
		}

		data = tableGetPoleEwidencyjne(obj);
		if (data) {
			table.push(["Pole ewidencyjne:", data]);
		}

		data = pdfGetDokWlasnosci(obj);
		if (data) {
			table.push(["Dokumenty własności:", data]);
		}

		data = pdfGetKW(obj);
		if (data) {
			table.push(["KW:", data]);
		}

		data = tableGetAdres(obj);
		if (data) {
			table.push(["Adres:", data]);
		}

		autoTable(doc, {
			// head: [],
			body: table,
			styles: {
				font: "sans",
				fontStyle: "normal",
				fontSize: 10,
				// minCellHeight: 0,
				cellPadding: { bottom: 1 },
			},
			theme: "plain",
			columnStyles: {
				0: { cellWidth: 42 },
			},
		});

		doc.text("Klasoużytki:", 14, (doc as any).lastAutoTable.finalY + 5);

		table = pdfGetKlasouzytki(obj);
		autoTable(doc, {
			head: [["Klasoużytek", "Powierzchnia"]],
			body: table,
			startY: (doc as any).lastAutoTable.finalY + 6,
			styles: {
				font: "sans",
				fontStyle: "normal",
				fontSize: 10,
				// minCellHeight: 0,
				cellPadding: 0.5,
			},
			// theme: "plain",
			columnStyles: {
				// 0: { cellWidth: 42 },
			},
			headStyles: { fillColor: [80, 80, 80] },
		});

		if (obj.dokument2) {
			doc.text("Dokumenty:", 14, (doc as any).lastAutoTable.finalY + 5);

			table = pdfGetDokumenty(obj);
			autoTable(doc, {
				head: [["Data", "Rodzaj", "Twórca", "Sygnatura", "Oznaczenie", "Opis"]],
				body: table,
				startY: (doc as any).lastAutoTable.finalY + 6,
				styles: {
					font: "sans",
					fontStyle: "normal",
					fontSize: 10,
					// minCellHeight: 0,
					cellPadding: 0.5,
				},
				// theme: "plain",
				columnStyles: {
					// 0: { cellWidth: 42 },
				},
				headStyles: { fillColor: [80, 80, 80] },
			});
		}

		if (obj.JRG2) {
			doc.text("Udziały:", 14, (doc as any).lastAutoTable.finalY + 5);

			table = pdfGetWlasnosciWladania(obj.JRG2._attributes.href);
			autoTable(doc, {
				head: [["Udział", "Podmiot"]],
				body: table,
				startY: (doc as any).lastAutoTable.finalY + 6,
				styles: {
					font: "sans",
					fontStyle: "normal",
					fontSize: 10,
					// minCellHeight: 0,
					cellPadding: 0.5,
				},
				// theme: "plain",
				columnStyles: {
					// 0: { cellWidth: 42 },
				},
				headStyles: { fillColor: [80, 80, 80] },
			});
		}

		addFooters();
		doc.save("informacja dla działki.pdf");
	}
}

function pdfGetLokalizacja(obj: EGB_DzialkaEwidencyjnaType) {
	let je = ["Jednostka ewidencyjna:"];
	let oe = ["Obręb ewidencyjny:"];
	let nd = ["Numer działki:"];
	if (obj.lokalizacjaDzialki) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaDzialki._attributes.href);
		if (objObr) {
			je.push(pdfGetJE(objObr));
			oe.push(pdfGetOE(objObr));
		}
	}
	if (obj.idDzialki) {
		let nr = obj.idDzialki.split(".").pop();
		nd.push(nr ? nr : "");
	}
	return [je, oe, nd];
}

export function pdfGetDokWlasnosci(obj: EGB_DzialkaEwidencyjnaType) {
	let ret: string[] = [];
	if (obj.dokumentWlasnosci) {
		if (Array.isArray(obj.dokumentWlasnosci)) {
			obj.dokumentWlasnosci.forEach((key) => {
				ret.push(key);
			});
		} else ret.push(obj.dokumentWlasnosci);
	}
	return ret.join(", ");
}

export function pdfGetKW(obj: EGB_DzialkaEwidencyjnaType) {
	let ret: string[] = [];
	if (obj.numerKW) {
		if (Array.isArray(obj.numerKW)) {
			obj.numerKW.forEach((key) => {
				ret.push(key);
			});
		} else ret.push(obj.numerKW);
	}
	return ret.join(", ");
}

function pdfGetKlasouzytki(obj: EGB_DzialkaEwidencyjnaType) {
	let ret: string[][] = [];

	if (obj.klasouzytek) {
		if (Array.isArray(obj.klasouzytek)) {
			obj.klasouzytek.forEach((key) => {
				if (key.EGB_Klasouzytek) {
					ret.push(pdfGetKlasouzytek(key.EGB_Klasouzytek));
				}
			});
		} else {
			if (obj.klasouzytek.EGB_Klasouzytek) {
				ret.push(pdfGetKlasouzytek(obj.klasouzytek.EGB_Klasouzytek));
			}
		}
	}
	return ret;
}

function pdfGetKlasouzytek(obj: EGB_KlasouzytekType) {
	let kl = obj.OFU ? obj.OFU : "";
	if (obj.OZU) {
		if (obj.OZU.valueOf() !== obj.OFU?.valueOf()) {
			kl += "-" + obj.OZU;
		}
	}
	kl += obj.OZK ? obj.OZK : "";

	let pow = obj.powierzchnia ? " " + tableGetArea(obj.powierzchnia) : "";
	return [kl, pow];
}

function pdfGetDokumenty(obj: EGB_OgolnyObiektType) {
	let ret: string[][] = [];
	if (obj.dokument2) {
		if (Array.isArray(obj.dokument2)) {
			obj.dokument2.forEach((key) => {
				if (key) {
					ret.push(pdfGetDokument(key._attributes.href));
				}
			});
		} else {
			ret.push(pdfGetDokument(obj.dokument2._attributes.href));
		}
	}
	return ret;
}

function pdfGetDokument(id: string) {
	let data = "";
	let rodzaj = "";
	let tworca = "";
	let sygnatura = "";
	let oznaczenie = "";
	let opis = "";
	const obj = egbFeatures.dokumenty.get(id);
	if (obj) {
		if (obj.dataDokumentu) {
			data = new Date(obj.dataDokumentu).toLocaleDateString("pl-PL");
		}
		if (obj.rodzajDokumentu) {
			const rodzajDokumentu = EGB_RodzajDokumentu[obj.rodzajDokumentu];
			if (rodzajDokumentu) {
				rodzaj = rodzajDokumentu;
			}
		}
		if (obj.nazwaTworcyDokumentu) {
			tworca = obj.nazwaTworcyDokumentu;
		}
		if (obj.sygnaturaDokumentu) {
			sygnatura = obj.sygnaturaDokumentu;
		}
		if (obj.oznKancelaryjneDokumentu) {
			oznaczenie = obj.oznKancelaryjneDokumentu;
		}
		if (obj.opisDokumentu) {
			opis = obj.opisDokumentu;
		}
	}
	return [data, rodzaj, tworca, sygnatura, oznaczenie, opis];
}
