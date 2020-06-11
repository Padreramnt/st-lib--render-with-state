import { created, render } from '@st-lib/render'
import Emitter from '@st-lib/emitter'

class State<T> extends Emitter<{ change(): void }> {
	value: T
	constructor(value: T) {
		super()
		this.value = value
	}
}

const nodesStateMap = new WeakMap<object, State<any>>()

function createState<T>(ref: object, init: T): State<T> {
	let o = nodesStateMap.get(ref)
	if (o) return o
	o = new State(init)
	nodesStateMap.set(ref, o)
	return o
}

export default function withState<R extends Element, T>(init: T, content: (state: T, setState: (newState: T) => void, ref: R | null) => void) {
	return (ref: R | null) => {
		if (ref) {
			const state = createState(ref, init)
			function setState(value: T) {
				state.value = value
				state.emit('change')
			}
			content(state.value, setState, ref)
			created(() => {
				state.on('change', () => {
					render(ref, ref => {
						content(state.value, setState, ref)
					})
				})
			})
		} else {
			content(init, function setState(_value) { }, ref)
		}
	}
}
