<script>
  import { createEventDispatcher } from "svelte";
  import Collapsible from "./Collapsible.svelte";
  import DragInput from "./DragInput.svelte";

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
      <input size="5" value={label.name} on:input={handleInput('name')} />
      <input size="5" value={label.value} on:input={handleInput('value')} />
    {/if}
  </div>
  <div class="body">
    <div>
      <label>Xpos</label>
      <DragInput size="1" value={label.xpos} on:input={handleInput('xpos')} />
    </div>
    <div>
      <label>Ypos</label>
      <DragInput size="1" value={label.ypos} on:input={handleInput('ypos')} />
    </div>
    <div>
      <label>Size</label>
      <DragInput size="1" value={label.size} on:input={handleInput('size')} />
    </div>
    <div>
      <label>Weight</label>
      <DragInput
        size="1"
        value={label.weight}
        on:input={handleInput('weight')} />
    </div>
    <div>
      <label>Angle</label>
      <DragInput size="1" value={label.angle} on:input={handleInput('angle')} />
    </div>
    <div>
      <label>Anchor</label>
      <select value={label.anchor} on:change={handleInput('anchor')}>
        <option>start</option>
        <option>middle</option>
        <option>end</option>
      </select>
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
      Remove
    </button>
  {/if}
</Collapsible>
