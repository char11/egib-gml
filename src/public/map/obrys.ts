import type { Geometry, Position } from "geojson";

const EPS = 1e-9;
const MITER_LIMIT = 8;

type Point2D = {
	x: number;
	y: number;
};

type Line2D = {
	point: Point2D;
	dir: Point2D;
};

function getPolygons(geometry: Geometry | null): Position[][][] {
	if (!geometry) {
		return [];
	}
	if (geometry.type === "Polygon") {
		return [geometry.coordinates];
	}
	if (geometry.type === "MultiPolygon") {
		return geometry.coordinates;
	}
	return [];
}

function toPoint([lon, lat]: Position, kx: number, ky: number): Point2D {
	return { x: lon * kx, y: lat * ky };
}

function toPosition({ x, y }: Point2D, kx: number, ky: number): Position {
	return [x / kx, y / ky];
}

function signedArea(ring: Point2D[]): number {
	let sum = 0;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		sum += ring[j].x * ring[i].y - ring[i].x * ring[j].y;
	}
	return sum / 2;
}

function getOffsetLines(ring: Point2D[], distance: number, hole: boolean): Line2D[] | null {
	const lines: Line2D[] = [];
	const area = signedArea(ring);
	if (Math.abs(area) < EPS) {
		return null;
	}

	// Pierścienie mogą mieć dowolną orientację. Dla pierścienia zewnętrznego
	// linia przesuwa się w stronę jego wnętrza, dla otworu - w stronę
	// materiału, czyli na zewnątrz otworu.
	let side = area > 0 ? 1 : -1;
	if (hole) {
		side = -side;
	}

	for (let i = 0; i < ring.length; i++) {
		const from = ring[i];
		const to = ring[(i + 1) % ring.length];
		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const length = Math.hypot(dx, dy);
		if (length < EPS) {
			return null;
		}

		const tx = dx / length;
		const ty = dy / length;
		// Normalna w lewo od kierunku krawędzi.
		const nx = -ty * side;
		const ny = tx * side;

		lines.push({
			point: { x: from.x + nx * distance, y: from.y + ny * distance },
			dir: { x: tx, y: ty },
		});
	}

	return lines;
}

function intersectLines(first: Line2D, second: Line2D): Point2D | null {
	const cross = first.dir.x * second.dir.y - first.dir.y * second.dir.x;
	if (Math.abs(cross) < 1e-6) {
		return null;
	}

	const dx = second.point.x - first.point.x;
	const dy = second.point.y - first.point.y;
	const t = (dx * second.dir.y - dy * second.dir.x) / cross;
	return {
		x: first.point.x + first.dir.x * t,
		y: first.point.y + first.dir.y * t,
	};
}

function offsetRing(ring: Point2D[], distance: number, hole: boolean): Point2D[] | null {
	const area = signedArea(ring);
	if (Math.abs(area) < EPS) {
		return null;
	}

	const lines = getOffsetLines(ring, distance, hole);
	if (!lines) {
		return null;
	}

	const result: Point2D[] = [];
	for (let i = 0; i < lines.length; i++) {
		const previous = lines[(i - 1 + lines.length) % lines.length];
		const current = lines[i];
		const point = intersectLines(previous, current) ?? { ...current.point };

		// Zbyt ostry kąt mógłby wygenerować długi kolec zamiast obrysu.
		if (Math.hypot(point.x - ring[i].x, point.y - ring[i].y) > distance * MITER_LIMIT) {
			return null;
		}
		result.push(point);
	}

	const newArea = signedArea(result);
	// Obrys nie może zmienić orientacji ani zniknąć - wtedy znak nie ma sensu.
	if (Math.abs(newArea) < EPS || Math.sign(newArea) !== Math.sign(area)) {
		return null;
	}

	// Przy zbyt małym poligonie przesunięte krawędzie mogłyby się odwrócić
	// lub zniknąć. Wtedy drugiej linii znaku nie rysujemy.
	for (let i = 0; i < result.length; i++) {
		const from = result[i];
		const to = result[(i + 1) % result.length];
		const originalFrom = ring[i];
		const originalTo = ring[(i + 1) % ring.length];

		const dx = to.x - from.x;
		const dy = to.y - from.y;
		if (Math.hypot(dx, dy) < EPS) {
			return null;
		}

		const originalDx = originalTo.x - originalFrom.x;
		const originalDy = originalTo.y - originalFrom.y;
		if (dx * originalDx + dy * originalDy <= 0) {
			return null;
		}
	}

	return result;
}

/**
 * Wyznacza wewnętrzny obrys poligonu, przesunięty do wnętrza o podaną
 * odległość (w metrach). Służy do rysowania znaków umownych złożonych
 * z dwóch linii, np. tarasu, werandy lub wiatrołapu. Odległość wylicza
 * wywołujący na podstawie stałego odstępu na ekranie.
 */
export function getObrysWewnetrzny(geometry: Geometry | null, distance: number): Position[][] {
	const result: Position[][] = [];

	for (const rings of getPolygons(geometry)) {
		if (rings.length === 0) {
			continue;
		}

		const latSum = rings[0].reduce((sum, point) => sum + point[1], 0);
		const lat0 = latSum / rings[0].length;
		// Lokalne przeliczenie stopni na metry - wystarczające dla małych obiektów.
		const kx = 111320 * Math.cos((lat0 * Math.PI) / 180);
		const ky = 110540;

		for (let i = 0; i < rings.length; i++) {
			const projected = rings[i].map((point) => toPoint(point, kx, ky));
			if (projected.length > 1) {
				const first = projected[0];
				const last = projected[projected.length - 1];
				if (first.x === last.x && first.y === last.y) {
					projected.pop();
				}
			}
			if (projected.length < 3) {
				continue;
			}

			const offset = offsetRing(projected, distance, i > 0);
			if (offset) {
				result.push([...offset.map((point) => toPosition(point, kx, ky)), toPosition(offset[0], kx, ky)]);
			}
		}
	}

	return result;
}
