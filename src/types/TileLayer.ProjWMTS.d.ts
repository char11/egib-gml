import { tileLayer } from "leaflet";

declare module "leaflet" {
	namespace tileLayer {
		export function projwmts(baseUrl: string, options?: options): TileLayer;
	}
}
