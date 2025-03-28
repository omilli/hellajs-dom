import type { Context, RootContext } from "../../context";
import { delegateEvents } from "../events";
import type { HNode } from "../types";
import { generateKey } from "../utils";
import { diffChildren } from "./children";
import { updateProps } from "./props";

/**
 * Updates a DOM element based on a virtual node representation (HNode).
 *
 * This function modifies the provided DOM element by:
 * 1. Updating its properties
 * 2. Attaching event handlers
 * 3. Processing and updating child elements
 *
 * @param element - The DOM element to update
 * @param hNode - Virtual node representation containing props and children
 * @param rootContext - The root context of the component tree
 * @param rootSelector - CSS selector string identifying the root element
 * @param context - Current context for rendering
 * @returns The updated DOM element
 */
export function updateElement(
	element: HTMLElement,
	hNode: HNode,
	rootContext: RootContext,
	rootSelector: string,
	context: Context,
): HTMLElement {
	const { props = {}, children = [] } = hNode;

	updateProps(element, props);

	handleEvents(hNode, element, rootSelector);

	handleChildren(children, element, rootSelector, context, rootContext);

	return element;
}

/**
 * Handles event properties for a virtual DOM node by setting up event delegation.
 *
 * This function checks if the node has any properties starting with "on" (event handlers),
 * and if so, assigns a unique event key to the element and sets up event delegation.
 *
 * @param hNode - The virtual DOM node containing properties
 * @param element - The actual DOM element to attach events to
 * @param rootSelector - CSS selector for the root element used for event delegation
 *
 * @remarks
 * The function uses character codes (111 for 'o', 110 for 'n') to efficiently detect event handlers.
 * If event properties are found, it ensures the element has a unique "eKey" data attribute
 * and delegates the events through the delegateEvents function.
 */
function handleEvents(
	hNode: HNode,
	element: HTMLElement,
	rootSelector: string,
) {
	const { props = {} } = hNode;

	const keys = Object.keys(props);
	let hasEventProps = false;

	// check for 'on' prefix using charCodeAt
	for (let i = 0, len = keys.length; i < len; i++) {
		const key = keys[i];
		if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
			hasEventProps = true;
			break;
		}
	}

	if (hasEventProps) {
		element.dataset["eKey"] ??= generateKey();
		delegateEvents(hNode, rootSelector, element.dataset["eKey"]);
	}
}

/**
 * Handles diffing and updating of children nodes in a DOM element.
 *
 * @param children - Virtual nodes representing the desired children state
 * @param element - The parent DOM element whose children need to be updated
 * @param rootSelector - CSS selector identifying the root element of the component
 * @param context - Current context for the component rendering
 * @param rootContext - Root context for the entire component tree
 *
 * @remarks
 * This function extracts the current DOM children from the element,
 * then calls diffChildren to reconcile the differences between the current
 * DOM state and the desired virtual node state.
 */
function handleChildren(
	children: HNode["children"] = [],
	element: HTMLElement,
	rootSelector: string,
	context: Context,
	rootContext: RootContext,
) {
	const childCount = element.childNodes.length;
	const domChildren = new Array(childCount);
	for (let i = 0; i < childCount; i++) {
		domChildren[i] = element.childNodes[i] as HTMLElement | Text;
	}

	diffChildren(
		domChildren,
		children || [],
		element,
		rootContext,
		rootSelector,
		context,
	);
}
