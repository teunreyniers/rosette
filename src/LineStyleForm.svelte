<script>
  import { createEventDispatcher } from "svelte";
  import ColorSelector from "./ColorSelector.svelte";
  import DragInput from "./DragInput.svelte";

  export let title;
  export let width;
  export let style;
  export let color;
  export let cap;

  const dispatch = createEventDispatcher();

  function createChangeHandler(prop) {
    return event => {
      const payload = { title, width, style, color, cap };
      payload[prop] = event.target ? event.target.value : event.detail.value;
      dispatch("linestylechange", payload);
    };
  }
</script>

<style>
  .title {
    margin-top: 10px;
  }

  .props4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 2fr;
    margin-bottom: 5px;
  }

  .props4 label {
    margin: 6px 0px 0px 10px;
  }

  .props4 label:first-child {
    margin-left: 0px;
  }

  .props2 {
    display: grid;
    grid-template-columns: 1fr 4fr;
    margin-bottom: 5px;
  }

  .props3 {
    display: grid;
    grid-template-columns: 1fr 2fr 2fr;
    margin-bottom: 5px;
  }
</style>

<label class="title">{title}</label>
<div class="props4">
  <label>Width</label>
  <DragInput
    size={1}
    step={0.05}
    value={width}
    on:input={createChangeHandler('width')} />
  <label>Style</label>
  <select value={style} on:change={createChangeHandler('style')}>
    <option value="none">Solid</option>
    <option value="1 1">Dotted</option>
    <option value="3 3">Dashed</option>
    <option value="1 2 3 2">Dashdot</option>
  </select>
</div>
<div class="props3">
  <label>Cap</label>
  <select value={cap} on:change={createChangeHandler('cap')}>
    <option value="butt">Butt</option>
    <option value="square">Square</option>
    <option value="round">Round</option>
  </select>
</div>

<div class="props2">
  <label>Color</label>
  <ColorSelector key={title} {color} on:change={createChangeHandler('color')} />
</div>
