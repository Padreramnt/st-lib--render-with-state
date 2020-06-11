# [@st-lib/render](https://www.npmjs.com/package/@st-lib/render) element node state management helper

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
