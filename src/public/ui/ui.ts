import { idsStack, showEgbFeatureOnMap, showEgbNextFeature, showEgbPrevFeature } from "../egib/features";
import * as txml from "../txml/txml.js";
import { checkFeature } from "../egib/features.js";
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
		let bytesRead = 0;
		const stream = f.stream();
		const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
		let data = "";

		function handleChunk(chunk: string, offset: number, parseOptions: txml.TParseOptions) {
			//let position = offset || 0;
			let position = 0;
			if (offset) {
				data += chunk.slice(offset);
			} else {
				data += chunk;
			}
			let lastPos = 0;
			do {
				position = data.indexOf("<", position) + 1;

				if (!position) {
					position = lastPos;
					return;
				}
				if (data[position] === "/") {
					position = position + 1;
					lastPos = position;
					continue;
				}
				if (data[position] === "!" && data[position + 1] === "-" && data[position + 2] === "-") {
					const commentEnd = data.indexOf("-->", position + 3);
					if (commentEnd === -1) {
						data = data.slice(lastPos);
						position = 0;
						return;
					}

					//if(parseOptions.keepComments){
					//    this.push(data.substring(position-1, commentEnd+3));
					//}

					position = commentEnd + 1;
					lastPos = commentEnd;
					continue;
				}
				//console.log(data, position);
				let res = txml.parse(data, { ...parseOptions, pos: position - 1, parseNode: true, setPos: true });
				position = res.pos;
				// console.log(res, res.pos);
				if (position > data.length - 1 || position < lastPos) {
					data = data.slice(lastPos);
					//console.log(data.length, position);
					position = 0;
					return;
				} else {
					checkFeature(res.featureMember);
					//console.log(res, res.pos);
					lastPos = position;
				}
			} while (1);
		}

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			bytesRead += value.length;
			const pos = value.indexOf("<gml:featureMember");
			if (pos) {
				//handleChunk(value, pos, { removeNameSpace: true, logicalSimplify: true });
				handleChunk(value, pos, { removeNameSpace: true, simplifyLostLess: true });
				while (true) {
					const { done, value } = await reader.read();
					if (done) {
						//console.log(egbFeatures);

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
						return;
					}
					//handleChunk(value, 0, { removeNameSpace: true, logicalSimplify: true });
					handleChunk(value, 0, { removeNameSpace: true, simplifyLostLess: true });
					bytesRead += value.length;
					const percent = Math.round((bytesRead / f.size) * 100);
					uploadProgress.textContent = "Przetwarzanie: " + percent + " %";
					await new Promise((resolve) => setTimeout(resolve, 1));
				}
			}
		}
	}

	const tableDialog = document.getElementById("table-dialog") as HTMLDialogElement;
	const infoDialog = document.getElementById("info-dialog") as HTMLDialogElement;

	const showTableButton = document.getElementById("show-table") as HTMLInputElement;
	showTableButton.addEventListener("click", () => {
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
