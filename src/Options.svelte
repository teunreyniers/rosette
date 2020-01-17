<script>
  import ColorSelector from "./ColorSelector.svelte";
  import { createEventDispatcher } from "svelte";
  import DraggableList from "./DraggableList.svelte";
  import Collapsible from "./Collapsible.svelte";
  import LabelForm from "./LabelForm.svelte";
  import DragInput from "./DragInput.svelte";

  export let colors;
  export let labels;
  export let spaces;
  export let devitions;

  let length = 350;
  let height = 35;

  $: sum = spaces.reduce((a, v) => a + v, 0);
  $: points = spaces.reduce(
    (a, v) => [
      ...a,
      {
        difference: v,
        offset:
          ((a[a.length - 1] && a[a.length - 1].offset) || 0) +
          (v / sum) * length,
        depth:
          a.length <= 0
            ? 0
            : (((a[a.length - 1] && a[a.length - 1].depth) || 0) +
                ((v / sum) * length < height
                  ? ((((a[a.length - 1] && a[a.length - 1].difference) || 0) +
                      v) /
                      sum) *
                      length <
                    height
                    ? 2
                    : 1
                  : 0)) %
              (((((a[a.length - 1] && a[a.length - 1].difference) || 0) + v) /
                sum) *
                length <
              height
                ? 3
                : 2)
      }
    ],
    []
  );

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

  .slider {
    background: #ccc;
    width: 4px;
    border-radius: 5px;
    margin: 20px 3px;
    position: relative;
  }

  .point {
    position: absolute;
    background: #eee;
    border: 1px solid #ccc;
    width: 14px;
    height: 14px;
    margin-left: -6px;
    margin-bottom: -7px;
    border-radius: 50%;
    cursor: pointer;
  }
  .point .line {
    background: #ccc;
    position: absolute;
    top: 6px;
    height: 2px;
    right: 50px;
    left: 14px;
    width: 50px;
  }

  .point .input {
    left: 50px;
    position: absolute;
    top: -10px;
    z-index: 5;
    margin: 0px;
    padding: 0px;
  }

  .point:hover .line {
    z-index: 6;
  }

  .point:hover .input {
    z-index: 7;
  }

  .point:hover {
    z-index: 7;
  }

  .point:hover span {
    height: 8px;
    width: 8px;
    background: #ccc;
    border-radius: 50%;
    display: block;
    margin: 3px;
  }
</style>

<div class="background">
  <h3>Options</h3>
  <Collapsible header="Labels">
    {#each labels as label, index (label.key)}
      <LabelForm {label} {index} on:labelchange />
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
  <Collapsible header="Widths">
    <DragInput value={devitions} sensitivity={0.02} on:input={e => dispatch('spacechange', {
                  action: 'devitions',
                  value: e.detail.value
                })} />
    <div class="slider" style="height:{length}px;">
      {#each points as point, index}
        <div class="point" style="bottom:{point.offset}px">
          <div class="line" style="width:{30 + 60 * point.depth}px;" />
          <div class="input" style="left:{30 + 60 * point.depth}px;">
            <DragInput
              step={0.01}
              value={point.difference}
              size="1"
              on:input={e => dispatch('spacechange', {
                  action: 'change',
                  index,
                  value: e.detail.value
                })} />
          </div>
          <span />
        </div>
      {/each}
    </div>
  </Collapsible>
  <Collapsible header="Lines" />
  <button on:click={() => dispatch('dataEditor')}>Edit records</button>
</div>
