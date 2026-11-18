import { idsStack, showEgbFeatureOnMap, showEgbNextFeature, showEgbPrevFeature } from "../egib/features";
import * as txml from "../txml/txml.js";
import { checkFeature } from "../egib/features.js";
import {
	convertEgib19Feature,
	detectEgibSourceVersion,
	findEgib19ConversionProblem,
	pickEgibSourceVersion,
	type Egib19ConversionProblem,
	type EgibSourceVersion,
} from "../parsegml/egib-19-to-111.js";
import { showMap } from "../map/mapview.js";
import { generateSelectOptions } from "../table/table.js";
import { infoDlaDzialki } from "../pdf/informacja-dla-dzialki.js";
import { infoDlaJRG } from "../pdf/informacja-z-JRG.js";

export function showOnMapButton() {
	const showOnMapButton = document.getElementById("show-on-map") as HTMLInputElement;
	showOnMapButton.style.visibility = "visible";
}

export function hideOnMapButton() {
	const showOnMapButton = document.getElementById("show-on-map") as HTMLInputElement;
	showOnMapButton.style.visibility = "hidden";
}

export function showReportButton() {
	const reportButton = document.getElementById("report") as HTMLInputElement;
	reportButton.style.visibility = "visible";
}

export function hideReportButton() {
	const reportButton = document.getElementById("report") as HTMLInputElement;
	reportButton.style.visibility = "hidden";
}

export function showModal() {
	const modal = document.getElementById("modal") as HTMLDialogElement;
	modal.style.display = "block";
}

export function closeModal() {
	const modal = document.getElementById("modal") as HTMLDialogElement;
	modal.style.display = "none";
}

export function setListeners() {
	let isProcessing = false;

	async function handleFile(f: File) {
		const uploadProgress = document.getElementById("upload-progress") as HTMLDivElement;
		uploadProgress.classList.remove("error");
		let bytesRead = 0;
		const stream = f.stream();
		const reader = stream.getReader();
		const decoder = new TextDecoder();

		const featureStart = /<(?:[A-Za-z_][\w.-]*:)?featureMember\b/;
		const featureEnd = /<\/(?:[A-Za-z_][\w.-]*:)?featureMember\s*>/;
		const parseOptions: txml.TParseOptions = { removeNameSpace: true, simplifyLostLess: true };

		let buffer = "";
		let foundFeature = false;
		const conversionState: { problem: Egib19ConversionProblem | null } = { problem: null };
		const versionHints = new Set<EgibSourceVersion>();
		// Obiekty trafiają do map dopiero po sprawdzeniu całego pliku, żeby nie
		// zostawić częściowo wczytanych danych po nieudanej konwersji.
		const pendingFeatures: any[] = [];

		function processBuffer(isFinal: boolean) {
			while (true) {
				const startMatch = featureStart.exec(buffer);
				if (!startMatch) {
					if (isFinal) {
						buffer = "";
					} else {
						// Zachowaj ogon, który może zawierać początek znacznika
						// featureMember podzielonego między fragmenty pliku.
						const lastLt = buffer.lastIndexOf("<");
						buffer = lastLt === -1 ? "" : buffer.slice(lastLt);
					}
					return;
				}

				const start = startMatch.index;
				if (start > 0) {
					buffer = buffer.slice(start);
				}

				const endMatch = featureEnd.exec(buffer);
				if (!endMatch) {
					// Niepełny featureMember - poczekaj na kolejny fragment pliku.
					return;
				}

				const end = endMatch.index + endMatch[0].length;
				const featureXml = buffer.slice(0, end);
				buffer = buffer.slice(end);

				const res: any = txml.parse(featureXml, parseOptions);
				if (res && res.featureMember) {
					foundFeature = true;
					// Pliki EGIB 1.6-1.9 są konwertowane do struktury 1.11 jeszcze przed
					// zapisaniem obiektu, dzięki czemu reszta aplikacji się nie zmienia.
					const version = detectEgibSourceVersion(res.featureMember);
					if (version) versionHints.add(version);
					// Najpierw sprawdzamy, czy konwersja nie spowoduje utraty danych.
					const problem = findEgib19ConversionProblem(res.featureMember);
					if (problem) {
						conversionState.problem = problem;
						buffer = "";
						return;
					}
					pendingFeatures.push(convertEgib19Feature(res.featureMember));
				}
			}
		}

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				buffer += decoder.decode();
				processBuffer(true);
				break;
			}

			bytesRead += value.byteLength;
			buffer += decoder.decode(value, { stream: true });
			processBuffer(false);

			if (conversionState.problem) {
				await reader.cancel();
				break;
			}

			const percent = Math.min(100, Math.round((bytesRead / f.size) * 100));
			uploadProgress.textContent = "Przetwarzanie: " + percent + " %";
			await new Promise((resolve) => setTimeout(resolve, 1));
		}

		if (conversionState.problem) {
			const problem = conversionState.problem;
			const version = pickEgibSourceVersion(versionHints);
			const source = version ? ` EGIB ${version}` : "";
			const id = problem.featureId ? ` o identyfikatorze ${problem.featureId}` : "";
			uploadProgress.classList.add("error");
			uploadProgress.textContent =
				`Nie można skonwertować pliku${source} do formatu EGIB 1.11: obiekt ${problem.featureName}${id} ` +
				`${problem.reason}.`;
			(fileInput as HTMLInputElement).value = "";
			isProcessing = false;
			return;
		}

		for (const feature of pendingFeatures) {
			checkFeature(feature);
		}

		if (!foundFeature) {
			uploadProgress.classList.add("error");
			uploadProgress.textContent = "Nie znaleziono obiektów GML w pliku.";
			isProcessing = false;
			return;
		}

		uploadProgress.textContent = "Generowanie mapy...";
		await new Promise((resolve) => setTimeout(resolve, 10));

		generateSelectOptions();

		const lMap = document.getElementById("map");
		if (lMap) {
			lMap.style.display = "block";
			try {
				showMap();
			} catch (err) {
				console.error("Error:", err);
				uploadProgress.classList.add("error");
				uploadProgress.textContent = "Błąd przy generowaniu mapy!";
				isProcessing = false;
				return;
			}
		}
	}

	const tableDialog = document.getElementById("table-dialog") as HTMLDialogElement;
	const infoDialog = document.getElementById("info-dialog") as HTMLDialogElement;

	const selectFeatures = document.getElementById("select-features") as HTMLSelectElement;
	const selectFeaturesToggle = document.getElementById("select-features-toggle") as HTMLButtonElement;
	const selectFeaturesMenu = document.getElementById("select-features-menu") as HTMLDivElement;
	const selectFeaturesLabel = document.getElementById("select-features-label") as HTMLSpanElement;

	const closeSelectFeatures = () => {
		selectFeaturesMenu.hidden = true;
		selectFeaturesToggle.setAttribute("aria-expanded", "false");
	};

	const openSelectFeatures = () => {
		selectFeaturesMenu.replaceChildren();
		for (const option of Array.from(selectFeatures.options)) {
			const item = document.createElement("button");
			item.type = "button";
			item.className = "select-features-option";
			item.setAttribute("role", "option");
			item.setAttribute("aria-selected", String(option.selected));
			item.textContent = option.text;
			item.addEventListener("click", () => {
				selectFeatures.value = option.value;
				selectFeatures.dispatchEvent(new Event("change"));
				selectFeaturesLabel.textContent = option.text;
				closeSelectFeatures();
				selectFeaturesToggle.focus();
			});
			selectFeaturesMenu.appendChild(item);
		}
		selectFeaturesMenu.hidden = false;
		selectFeaturesToggle.setAttribute("aria-expanded", "true");
	};

	selectFeaturesToggle.addEventListener("click", (e) => {
		e.stopPropagation();
		if (selectFeaturesMenu.hidden) {
			openSelectFeatures();
		} else {
			closeSelectFeatures();
		}
	});

	selectFeatures.addEventListener("change", () => {
		selectFeaturesLabel.textContent = selectFeatures.selectedOptions[0]?.text ?? "";
	});

	document.addEventListener("click", (e) => {
		if (selectFeaturesMenu.hidden) {
			return;
		}
		const target = e.target as Node | null;
		if (target && !selectFeaturesMenu.contains(target) && !selectFeaturesToggle.contains(target)) {
			closeSelectFeatures();
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && !selectFeaturesMenu.hidden) {
			e.preventDefault();
			e.stopPropagation();
			closeSelectFeatures();
			selectFeaturesToggle.focus();
		}
	});

	const showTableButton = document.getElementById("show-table") as HTMLInputElement;
	showTableButton.addEventListener("click", () => {
		closeSelectFeatures();
		tableDialog.showModal();
	});

	const closeTableButton = document.getElementById("close-table") as HTMLInputElement;
	closeTableButton.addEventListener("click", () => {
		tableDialog.close();
	});

	const showInfo = document.getElementById("show-info") as HTMLDivElement;
	const closeInfoButton = document.getElementById("close-info") as HTMLInputElement;

	showInfo.addEventListener("click", () => {
		infoDialog.showModal();
		closeInfoButton.focus();
	});

	closeInfoButton.addEventListener("click", () => {
		infoDialog.close();
	});

	const closeModalButton = document.getElementById("close-modal-button") as HTMLInputElement;
	closeModalButton.addEventListener("click", () => {
		closeModal();
	});

	const leftButton = document.getElementById("left-button") as HTMLInputElement;
	leftButton.addEventListener("click", showEgbPrevFeature);

	const rightButton = document.getElementById("right-button") as HTMLInputElement;
	rightButton.addEventListener("click", showEgbNextFeature);

	const showOnMapButton = document.getElementById("show-on-map") as HTMLInputElement;
	showOnMapButton.addEventListener("click", () => {
		closeModal();
		showEgbFeatureOnMap();
	});

	const pdfButton = document.getElementById("report") as HTMLInputElement;
	pdfButton.addEventListener("click", () => {
		const feature = idsStack.get().slice(0, 2);
		const id = idsStack.get().slice(2);
		if (feature === "de") {
			infoDlaDzialki(id);
		} else if (feature === "rg") {
			infoDlaJRG(id);
		}
	});

	const fileInput = document.getElementById("file-input") as HTMLInputElement;
	const dropArea = document.getElementById("drop-area") as HTMLElement;

	dropArea.addEventListener("drop", async (e) => {
		e.preventDefault();
		if (e.dataTransfer) {
			const files = e.dataTransfer.files;

			if (!isProcessing && files.length === 1) {
				if (files[0].name.split(".").pop()?.toLowerCase() === "gml") {
					(fileInput as HTMLInputElement).files = files;
					isProcessing = true;
					await handleFile(files[0]);
				} else {
					dropArea.classList.remove("drag-over");
				}
			}
		}
	});

	dropArea.addEventListener("click", () => {
		fileInput.click();
	});

	fileInput.addEventListener("change", async (e) => {
		dropArea.classList.add("drag-over");
		const files = (e.target as HTMLInputElement).files;

		if (!isProcessing && files) {
			isProcessing = true;
			//clearFeatures();
			await handleFile(files[0]);
		}
	});

	dropArea.addEventListener("dragover", (e) => {
		e.preventDefault();
		if (!isProcessing) {
			dropArea.classList.add("drag-over");
		}
	});

	dropArea.addEventListener("dragleave", (e) => {
		e.preventDefault();
		if (!isProcessing) {
			dropArea.classList.remove("drag-over");
		}
	});
}
