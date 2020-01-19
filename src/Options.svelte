<script>
  import ColorSelector from "./ColorSelector.svelte";
  import { createEventDispatcher } from "svelte";
  import DraggableList from "./DraggableList.svelte";
  import Collapsible from "./Collapsible.svelte";
  import LabelForm from "./LabelForm.svelte";
  import DragInput from "./DragInput.svelte";
  import LineStyleForm from "./LineStyleForm.svelte";
  import TextForm from "./TextForm.svelte";

  export let grades;
  export let labels;
  export let spaces;
  export let devitions;
  export let lines;
  export let textoptions;
  export let layout;

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
    margin: 20px 10px;
    position: relative;
  }

  .grid2 {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 2px;
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
  <button on:click={() => dispatch('dataEditor')}>Edit records</button>
  <h3>Options</h3>
  <Collapsible header="Layout">
    <div class="labelvalue">
      <div class="tri">
        <label>Size</label>
        <DragInput
          value={layout.size_x}
          on:input={e => dispatch('layoutchange', {
              ...layout,
              size_x: e.detail.value
            })} />
        <DragInput
          value={layout.size_y}
          on:input={e => dispatch('layoutchange', {
              ...layout,
              size_y: e.detail.value
            })} />
      </div>
      <div class="tri">
        <label>Center</label>
        <DragInput
          value={layout.center_x}
          on:input={e => dispatch('layoutchange', {
              ...layout,
              center_x: e.detail.value
            })} />
        <DragInput
          value={layout.center_y}
          on:input={e => dispatch('layoutchange', {
              ...layout,
              center_y: e.detail.value
            })} />
      </div>
      <div class="tri">
        <label>Angle</label>
        <DragInput
          value={layout.angleoffset}
          on:input={e => dispatch('layoutchange', {
              ...layout,
              angleoffset: e.detail.value
            })} />
        <span />
      </div>
      <div class="bl">
        <label>Pdf paper size</label>
        <select
          value={layout.papersize}
          on:input={e => dispatch('layoutchange', {
              ...layout,
              papersize: e.target.value
            })}>
          <option>A4</option>
          <option>A5</option>
          <option>A6</option>
          <option>Letter</option>
        </select>
      </div>
    </div>
  </Collapsible>
  <Collapsible header="Labels">
    {#each labels as label, index (label.key)}
      <LabelForm {label} {index} on:labelchange />
    {/each}
    <button
      on:click={() => dispatch('labelchange', { action: 'add', index: 0 })}>
      Add label
    </button>
  </Collapsible>
  <Collapsible header="Colors &amp; grades">
    <DraggableList
      key="key"
      list={grades.reduce((a, v) => [v, ...a], [])}
      let:item={grade}
      let:index={i}
      on:sort={e => dispatch('gradechange', {
          action: 'reorder',
          from: grades.length - 1 - e.detail.from,
          to: grades.length - 1 - e.detail.to
        })}
      on:delete={e => dispatch('gradechange', {
          action: 'delete',
          index: grades.length - e.detail - 1
        })}>
      <div class="grid2">
        <ColorSelector
          color={grade.color}
          key={grade.key}
          on:change={e => dispatch('gradechange', {
              action: 'change',
              index: grades.length - i - 1,
              value: {
                ...grade,
                color: e.detail.value
              }
            })} />
        <input
          size="1"
          value={grade.name}
          on:input={e => dispatch('gradechange', {
              action: 'change',
              index: grades.length - i - 1,
              value: {
                ...grade,
                name: e.target.value
              }
            })} />
      </div>
    </DraggableList>
    <button
      on:click={e => dispatch('colorChange', { action: 'add', index: 0 })}>
      Add color
    </button>
  </Collapsible>
  <Collapsible header="Widths" defaultState={false}>
    <label>Number of grades</label>
    <DragInput
      value={devitions}
      sensitivity={0.02}
      on:input={e => dispatch('spacechange', {
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
  <Collapsible header="Lines" defaultState={false}>
    {#each lines as line, index (line.key)}
      <LineStyleForm
        title={line.key}
        color={line.color}
        style={line.style}
        width={line.width}
        cap={line.cap}
        on:linestylechange />
    {/each}
  </Collapsible>
  <Collapsible header="Text options" defaultState={false}>
    {#each textoptions as option (option.key)}
      <TextForm textoptions={option} on:textoptionschange />
    {/each}
  </Collapsible>
  <Collapsible header="Include" defaultState={false}>
    <div class="labelvalue">
      <label>Legend</label>
      <input type="checkbox" />
    </div>
  </Collapsible>
</div>
