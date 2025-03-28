import type { HNode } from "../types";

export type RenderPropHandler = {
	/**
	 * Handles className properties.
	 * @param className
	 */
	classProp(className: string): void;
	/**
	 * Handles boolean properties (e.g., checked, disabled).
	 * @param key
	 */
	boolProp(key: string): void;
	/**
	 * Handles regular properties (e.g., id, value).
	 * @param key
	 * @param value
	 */
	regularProp(key: string, value: any): void;
};

export type RenderedElement = HTMLElement | Text | DocumentFragment;

export interface RenderedNode {
	/**
	 * The rendered DOM element, which can be an HTMLElement, Text, or DocumentFragment.
	 */
	element: DocumentFragment | HTMLElement | Text;
	/**
	 * The original hierarchical node (HNode) that was rendered.
	 */
	hNode: HNode;
}
