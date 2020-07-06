# [@st-lib/render](https://www.npmjs.com/package/@st-lib/render) element node state management helper

declarative style

```ts
import { render, text } from '@st-lib/render'
import { button } from '@st-lib/render-html'
import { onClick } from '@st-lib/render-events'
import { useState } from '@st-lib/render-with-state'

window.onload = () => {
	render(document.body, () => {
		const [state, setState] = useState(0, (newVal, oldVal) => /* increment only */newVal > oldVal)
		button(null, () => {
			onClick(e => {
				e.preventDefault()
				setState(state + 1)
			})
			text(null, 'increment')
		})
		button(null, () => {
			onClick(e => {
				e.preventDefault()
				// will not work because of state guard does not allow new value to be less than old value
				setState(state - 1)
			})
			text(null, 'decrement')
		})
		text(null, ` clicks: ${state}`)
	})
}
```

functional style

```ts
import { render, text } from '@st-lib/render'
import { button } from '@st-lib/render-html'
import { onClick } from '@st-lib/render-events'
import withState from '@st-lib/render-with-state'

window.onload = () => {
	render(document.body, withState(0, (state, setState) => {
		button(null, () => {
			onClick(e => {
				e.preventDefault()
				setState(state + 1)
			})
			text(null, 'click me')
		})
		text(null, ` clicks: ${state}`)
	}))
}
```
