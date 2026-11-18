import type { Geometry, Position } from "geojson";

// Generowanie wypełnień znaków umownych złożonych z regularnej siatki
// punktów. Współrzędne są przeliczane na piksele ekranu, dzięki czemu
// rozstaw wzoru pozostaje stały niezależnie od skali mapy.

type Point2D = {
	x: number;
	y: number;
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

function ringContains(point: Point2D, ring: Point2D[]): boolean {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const a = ring[i];
		const b = ring[j];
		if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) {
			inside = !inside;
		}
	}
	return inside;
}

function polygonContains(point: Point2D, rings: Point2D[][]): boolean {
	if (rings.length === 0 || !ringContains(point, rings[0])) {
		return false;
	}
	// Otwory w poligonie nie są wypełniane.
	for (let i = 1; i < rings.length; i++) {
		if (ringContains(point, rings[i])) {
			return false;
		}
	}
	return true;
}

/**
 * Zwraca pozycje kropek siatki mieszczące się wewnątrz poligonu.
 * Wiersze są rozmieszczone co `stepY`, a kropki w wierszu co `stepX`.
 * Co drugi wiersz jest przesunięty o połowę rozstawu poziomego, co daje
 * charakterystyczny wzór wjazdu do podziemia.
 */
export function getKropkiWzoru(
	geometry: Geometry | null,
	toScreen: (position: Position) => Point2D,
	toPosition: (point: Point2D) => Position,
	stepX: number,
	stepY: number,
): Position[] {
	const polygons = getPolygons(geometry);
	const result: Position[] = [];
	if (polygons.length === 0) {
		return result;
	}

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	const screenPolygons = polygons.map((rings) =>
		rings.map((ring) =>
			ring.map((position) => {
				const point = toScreen(position);
				minX = Math.min(minX, point.x);
				minY = Math.min(minY, point.y);
				maxX = Math.max(maxX, point.x);
				maxY = Math.max(maxY, point.y);
				return point;
			}),
		),
	);

	if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
		return result;
	}

	const colStep = Math.max(1, stepX);
	const rowStep = Math.max(1, stepY);
	const firstRow = Math.floor(minY / rowStep);

	for (let row = firstRow; row * rowStep <= maxY; row++) {
		const y = row * rowStep;
		const offset = row % 2 === 0 ? 0 : colStep / 2;
		const firstCol = Math.floor((minX - offset) / colStep);

		for (let col = firstCol; col * colStep + offset <= maxX; col++) {
			const point = { x: col * colStep + offset, y };
			if (screenPolygons.some((rings) => polygonContains(point, rings))) {
				result.push(toPosition(point));
			}
		}
	}

	// Kropki na skraju zakresu mogą wypaść minimalnie poza obszar.
	return result;
}
