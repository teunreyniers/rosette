<script>
  import { createEventDispatcher } from "svelte";
  import Collapsible from "./Collapsible.svelte";
  import DragInput from "./DragInput.svelte";
  import ColorSelector from "./ColorSelector.svelte";
  import { _ } from "svelte-i18n";

  export let label;
  export let index;

  const dispatch = createEventDispatcher();

  function handleInput(prop) {
    return event => {
      const payload = {
        action: "change",
        label,
        index
      };
      payload.label[prop] = event.target
        ? event.target.value
        : event.detail.value;
      dispatch("labelchange", payload);
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
    grid-template-columns: 60px 60px;
    margin-bottom: 5px;
  }

  .body div.double {
    display: grid;
    grid-template-columns: 60px 180px;
  }

  .body label {
    display: inline;
    margin: 5px 2px 0px 5px;
  }

  .remove {
    background: lightsalmon;
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
    {#if label.readonly}
      <label>{label.name}</label>
    {:else}
      <input size="5" value={label.name} on:change={handleInput('name')} />
      <input size="5" value={label.value} on:change={handleInput('value')} />
    {/if}
  </div>
  <div class="body">
    <div>
      <label>{$_('properties.xpos')}</label>
      <DragInput
        size="1"
        min={-Infinity}
        value={label.xpos}
        on:change={handleInput('xpos')} />
    </div>
    <div>
      <label>{$_('properties.ypos')}</label>
      <DragInput
        size="1"
        min={-Infinity}
        value={label.ypos}
        on:change={handleInput('ypos')} />
    </div>
    <div>
      <label>{$_('properties.size')}</label>
      <DragInput size="1" value={label.size} on:change={handleInput('size')} />
    </div>
    <div>
      <label>{$_('properties.weight')}</label>
      <DragInput
        size="1"
        value={label.weight}
        on:change={handleInput('weight')} />
    </div>
    <div>
      <label>{$_('properties.angle')}</label>
      <DragInput size="1" value={label.angle} on:change={handleInput('angle')} />
    </div>
    <div>
      <label>{$_('properties.align')}</label>
      <select value={label.anchor} on:change={handleInput('anchor')}>
        <option value="start">{$_('properties.align_left')}</option>
        <option value="middle">{$_('properties.align_center')}</option>
        <option value="end">{$_('properties.align_right')}</option>
      </select>
    </div>
    <div class="double">
      <label>{$_('properties.color')}</label>
      <ColorSelector
        key={label.title}
        color={label.color}
        on:change={handleInput('color')} />
    </div>
  </div>
  {#if !label.readonly}
    <button
      class="remove"
      on:click={() => dispatch('labelchange', {
          action: 'delete',
          label,
          index
        })}>
      {$_('properties.remove')}
    </button>
  {/if}
</Collapsible>
