<script>
  import ColorSelector from "./ColorSelector.svelte";
  import { createEventDispatcher } from "svelte";
  import DraggableList from "./DraggableList.svelte";
  import Collapsible from "./Collapsible.svelte";
  import LabelForm from "./LabelForm.svelte";

  export let colors;
  export let labels;

  const dispatch = createEventDispatcher();
</script>

<style>
  .background {
    background-color: #eee;
    padding: 10px 15px;
    overflow: auto;
  }

  h3 {
    margin: 5px 0px;
  }
  button {
    margin: 5px 0px;
    cursor: pointer;
    user-select: none;
  }

  button:hover {
    background: #fff;
  }
</style>

<div class="background">
  <h3>Options</h3>
  <Collapsible header="Labels">
    {#each labels as label, index (label.key)}
      <LabelForm {label} {index} on:labelchange/>
    {/each}
    <button
      on:click={() => dispatch('labelchange', { action: 'add', index: 0 })}>
      Add label
    </button>
  </Collapsible>
  <Collapsible header="Colors">
    <DraggableList
      key="key"
      list={colors.reduce((a, v) => [v, ...a], [])}
      let:item={color}
      let:index={i}
      on:sort={e => dispatch('colorChange', {
          action: 'reorder',
          from: colors.length - 1 - e.detail.from,
          to: colors.length - 1 - e.detail.to
        })}
      on:delete={e => dispatch('colorChange', {
          action: 'delete',
          index: colors.length - e.detail - 1
        })}>

      <ColorSelector
        {color}
        on:changed={e => dispatch('colorChange', {
            action: 'change',
            index: colors.length - i - 1,
            oldColor: color,
            newColor: e.detail
          })} />

    </DraggableList>
    <button
      on:click={e => dispatch('colorChange', { action: 'add', index: 0 })}>
      Add color
    </button>
  </Collapsible>
  <Collapsible header="Widths" />
  <Collapsible header="Others" />
  <button on:click={() => dispatch('dataEditor')}>Edit records</button>
</div>
