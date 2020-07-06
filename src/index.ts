import { context, rerender } from '@st-lib/render'

const cache = new WeakMap()

function initState(ref: object, init: any) {
	if (!cache.has(ref)) {
		cache.set(ref, init)
		return init
	}
	return cache.get(ref)
}
function setState() { }
export function withState<R extends Element, T>(init: T, content: (state: T, setState: (state: T) => void, ref: R | null) => void) {
	return function renderer(ref: R) {
		if (ref) {
			const state = initState(ref, init)
			content(state, function setState(state) {
				cache.set(ref, state)
				rerender(ref)
			}, ref)
		} else {
			content(init, setState, ref)
		}
	}
}

const counter = new WeakMap<object, number>()
const usedStates = new WeakMap<object, Record<number, any>>()

function count(ref: object) {
	if (!counter.has(ref)) {
		counter.set(ref, 0)
	} else {
		counter.set(ref, counter.get(ref)! + 1)
	}
	return counter.get(ref)!
}

function reset(ref: object) {
	counter.delete(ref)
}

export type UseState<T> = [
	T,
	(newState: T) => void,
]
/**
 * use element node state
 * @param init initial state value
 * @param when state guard
 */
export function useState<T>(init: T, when?: (newValue: T, oldValue: T) => any): UseState<T> {
	const ctx = context.peek()
	if (!ctx || !ctx.target) {
		return [init, setState]
	}
	const { target } = ctx
	const index = count(target)
	let stateRec
	if (usedStates.has(target)) {
		stateRec = usedStates.get(target)!
	} else {
		stateRec = {}
		usedStates.set(target, stateRec)
	}
	let state: T
	if (index in stateRec) {
		state = stateRec[index]
	} else {
		state = init
		stateRec[index] = state
	}
	ctx.pushElementCleanupCallback(reset)
	return [state, function setState(newState: T) {
		if (typeof when !== 'function' || when(newState, state)) {
			stateRec[index] = newState
			rerender(target)
		}
	}]
}

export default withState
