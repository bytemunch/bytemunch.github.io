import { XYWH } from "../class/Mondrian";

export function checkCollision(b1:DOMRect|XYWH, b2:DOMRect|XYWH) {
	if (b1.x < b2.x + b2.width && b1.x + b1.width > b2.x &&
		b1.y < b2.y + b2.height && b1.y + b1.height > b2.y) {
		return true;
	}
	return false;
}