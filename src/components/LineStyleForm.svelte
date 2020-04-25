<script>
  import { createEventDispatcher } from "svelte";
  import ColorSelector from "./ColorSelector.svelte";
  import DragInput from "./DragInput.svelte";
  import { _ } from "svelte-i18n";

  export let key;
  export let title;
  export let width;
  export let style;
  export let color;
  export let cap;

  const dispatch = createEventDispatcher();

  function createChangeHandler(prop) {
    return event => {
      const payload = { key, width, style, color, cap };
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
  <label>{$_('properties.line_thickness')}</label>
  <DragInput
    size={1}
    step={0.05}
    value={width}
    on:change={createChangeHandler('width')} />
  <label>{$_('properties.line_patern')}</label>
  <select value={style} on:change={createChangeHandler('style')}>
    <option value="none">{$_('properties.line_patern_solid')}</option>
    <option value="1 1">{$_('properties.line_patern_dotted')}</option>
    <option value="3 3">{$_('properties.line_patern_dashed')}</option>
    <option value="1 2 3 2">{$_('properties.line_patern_dashdot')}</option>
  </select>
</div>
<div class="props3">
  <label>{$_('properties.line_cap')}</label>
  <select value={cap} on:change={createChangeHandler('cap')}>
    <option value="butt">{$_('properties.line_cap_butt')}</option>
    <option value="square">{$_('properties.line_cap_square')}</option>
    <option value="round">{$_('properties.line_cap_round')}</option>
  </select>
</div>

<div class="props2">
  <label>{$_('properties.color')}</label>
  <ColorSelector key={title} {color} on:change={createChangeHandler('color')} />
</div>
