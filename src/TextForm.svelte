<script>
  import { createEventDispatcher } from "svelte";
  import Collapsible from "./Collapsible.svelte";
  import DragInput from "./DragInput.svelte";
  import ColorSelector from "./ColorSelector.svelte";

  export let textoptions;

  const dispatch = createEventDispatcher();

  function handleInput(prop) {
    return event => {
      const payload = {
        ...textoptions
      };
      payload[prop] = event.target
        ? event.target.value
        : event.detail.value;
      dispatch("textoptionschange", payload);
    };
  }
</script>

<style>
  .collapser {
    width: 35px;
    margin-bottom: 5px;
  }

  .collapser span {
    display: inline-block;
    transition: transform 200ms ease-in-out;
    transform: rotateZ(90deg);
    transform-origin: 5px 12px;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-weight: normal;
    grid-gap: 2px;
    margin-bottom: 5px;
  }

  .header label {
    margin-top: 6px;
    display: block;
  }

  .body {
    display: flex;
    flex-flow: wrap;
    justify-content: left;
  }

  .body div {
    display: grid;
    grid-template-columns: 61px 65px;
    margin-bottom: 5px;
  }

  .body div.double {
    display: grid;
    grid-template-columns: 61px 191px;
  }

  .body label {
    display: inline;
    margin: 5px 2px 0px 5px;
  }

  .collapser .isOpen {
    transform: rotateZ(-90deg);
  }
</style>

<Collapsible reverse defaultState={false}>
  <button slot="collapser" class="collapser" let:isOpen>
    <span class:isOpen>></span>
  </button>
  <div slot="header" class="header">

    <label>{textoptions.title}</label>

  </div>
  <div class="body">
    <div>
      <label>X offset</label>
      <DragInput
        size="1"
        min={-Infinity}
        value={textoptions.xpos}
        on:input={handleInput('xpos')} />
    </div>
    <div>
      <label>Y offset</label>
      <DragInput
        size="1"
        min={-Infinity}
        value={textoptions.ypos}
        on:input={handleInput('ypos')} />
    </div>
    <div>
      <label>Size</label>
      <DragInput
        size="1"
        value={textoptions.size}
        on:input={handleInput('size')} />
    </div>
    <div>
      <label>Weight</label>
      <DragInput
        size="1"
        value={textoptions.weight}
        on:input={handleInput('weight')} />
    </div>
    <div>
      <label>Angle</label>
      <DragInput
        size="1"
        value={textoptions.angle}
        on:input={handleInput('angle')} />
    </div>
    <div>
      <label>Align</label>
      <select value={textoptions.anchor} on:change={handleInput('anchor')}>
        <option value="start">Left</option>
        <option value="middle">Center</option>
        <option value="end">Right</option>
      </select>
    </div>
    <div>
      <label>Curve</label>
     <select value={textoptions.curve} on:change={handleInput('curve')}>
        <option value="normal">Normal</option>
        <option value="none">None</option>
      </select>
    </div>
     <div>
      <label>Flip</label>
     <select value={textoptions.flip} on:change={handleInput('flip')}>
        <option value="none">None</option>
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
        <option value="both">Both</option>
      </select>
    </div>
    <div class="double">
      <label>Color</label>
      <ColorSelector
        key={textoptions.key}
        color={textoptions.color}
        on:change={handleInput('color')} />
    </div>
  </div>
</Collapsible>
