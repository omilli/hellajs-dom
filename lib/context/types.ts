import type { EventFn, HNode } from "../types";

export type RootContext = {
	elements: Map<
		string,
		{
			element: HTMLElement | Text | DocumentFragment;
			hNode: HNode;
		}
	>;
	events: {
		delegates: Set<string>;
		listeners: Map<string, Map<string, EventFn>>;
	};
};

export type RootStore = Map<string, RootContext>;

export type ContextState = {
	id: string;
	rootStore: RootStore;
	render: (element: HNode, rootSelector: string) => void;
};

export type GlobalContext = (Window & typeof globalThis) & {
	[key: string]: ContextState;
};
