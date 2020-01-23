<script>
  import { createEventDispatcher } from "svelte";
  import Collapsible from "./Collapsible.svelte";
  import DragInput from "./DragInput.svelte";
  import ColorSelector from "./ColorSelector.svelte";
  import { _ } from 'svelte-i18n';

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
    <label>{$_(`properties.${textoptions.key}`)}</label>
  </div>
  <div class="body">
    <div>
      <label>{$_('properties.xoffset')}</label>
      <DragInput
        size="1"
        min={-Infinity}
        value={textoptions.xpos}
        on:change={handleInput('xpos')} />
    </div>
    <div>
      <label>{$_('properties.yoffset')}</label>
      <DragInput
        size="1"
        min={-Infinity}
        value={textoptions.ypos}
        on:change={handleInput('ypos')} />
    </div>
    <div>
      <label>{$_('properties.sizze')}</label>
      <DragInput
        size="1"
        value={textoptions.size}
        on:change={handleInput('size')} />
    </div>
    <div>
      <label>{$_('properties.weight')}</label>
      <DragInput
        size="1"
        value={textoptions.weight}
        on:change={handleInput('weight')} />
    </div>
    <div>
      <label>{$_('properties.angle')}</label>
      <DragInput
        size="1"
        value={textoptions.angle}
        on:change={handleInput('angle')} />
    </div>
    <div>
      <label>{$_('properties.align')}</label>
      <select value={textoptions.anchor} on:change={handleInput('anchor')}>
        <option value="start">{$_('properties.align_left')}</option>
        <option value="middle">{$_('properties.align_center')}</option>
        <option value="end">{$_('properties.align_right')}</option>
      </select>
    </div>
    <div>
      <label>{$_('properties.curve')}</label>
     <select value={textoptions.curve} on:change={handleInput('curve')}>
        <option value="normal">{$_('properties.curve_normal')}</option>
        <option value="none">{$_('properties.curve_none')}</option>
      </select>
    </div>
     <div>
      <label>{$_('properties.flip')}</label>
     <select value={textoptions.flip} on:change={handleInput('flip')}>
        <option value="none">{$_('properties.flip_none')}</option>
        <option value="horizontal">{$_('properties.flip_horizontal')}</option>
        <option value="vertical">{$_('properties.flip_vertical')}</option>
        <option value="both">{$_('properties.flip_both')}</option>
      </select>
    </div>
    <div class="double">
      <label>{$_('properties.color')}</label>
      <ColorSelector
        key={textoptions.key}
        color={textoptions.color}
        on:change={handleInput('color')} />
    </div>
  </div>
</Collapsible>
