<script>
  import ColorSelector from "./ColorSelector.svelte";
  import { createEventDispatcher } from "svelte";
  import DraggableList from "./DraggableList.svelte";
  import Collapsible from "./Collapsible.svelte";

  export let colors;

  const dispatch = createEventDispatcher();
</script>

<style>
  .background {
    background-color: #eee;
    padding: 10px 15px;
  }

  h3 {
    margin: 5px 0px;
  }

  h4 {
    margin: 5px 15px;
  }

  p {
    margin: 5px 15px;
    margin-left: 80px;
    cursor: pointer;
    user-select: none;
  }

  p:hover {
    text-decoration: underline;
  }
</style>

<div class="background">
  <h3>Options</h3>

  <Collapsible header="Colors &amp; Widths">

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
     <p on:click={e => dispatch('colorChange', { action: 'add', index: 0 })}>
    + Add color
  </p>
  </Collapsible>
 <Collapsible header="Others"></Collapsible>
</div>
