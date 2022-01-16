<script>
  import ColorSelector from "./ColorSelector.svelte";
  import { createEventDispatcher } from "svelte";
  import DraggableList from "./DraggableList.svelte";
  import Collapsible from "./Collapsible.svelte";
  import LabelForm from "./LabelForm.svelte";
  import DragInput from "./DragInput.svelte";
  import DragSelect from "./DragSelect.svelte";
  import LineStyleForm from "./LineStyleForm.svelte";
  import TextForm from "./TextForm.svelte";
  import { _ } from "svelte-i18n";
  import { lines, textoptions, grades, labels, spaces , layout } from "../stores";


  const papersizes = [
    {
      value: "a4",
      name: "A4",
    },
    {
      value: "a5",
      name: "A5",
    },
    {
      value: "a6",
      name: "A6",
    },
    {
      value: "letter",
      name: "Letter",
    },
  ];

  let length = 350;
  let height = 35;

  $: sum = $spaces.reduce((a, v) => a + v.number, 0);
  $: points = $spaces.reduce(
    (a, v) => [
      ...a,
      {
        ...v,
        difference: v.number,
        offset:
          ((a[a.length - 1] && a[a.length - 1].offset) || 0) +
          (v.number / sum) * length,
        depth:
          a.length <= 0
            ? 0
            : (((a[a.length - 1] && a[a.length - 1].depth) || 0) +
                ((v.value / sum) * length < height
                  ? ((((a[a.length - 1] && a[a.length - 1].difference) || 0) +
                      v.number) /
                      sum) *
                      length <
                    height
                    ? 2
                    : 1
                  : 0)) %
              (((((a[a.length - 1] && a[a.length - 1].difference) || 0) +
                v.value) /
                sum) *
                length <
              height
                ? 3
                : 2),
      },
    ],
    []
  );

  function handleSpacesChanged({ detail }) {
    const divitions = detail.value === "" ? "" : parseInt(detail.value);
    if (spaces.numberOfItems() === divitions) return;
    if (spaces.numberOfItems() > divitions) return spaces.limit_to(divitions);
    const diff = divitions - spaces.numberOfItems()
    spaces.add_n(diff)
  }

  function transformLines(l) {
    return Object.keys(l).map((key) => ({ ...l[key], key }));
  }

  function transformTextOptions(textoptions) {
    return Object.keys(textoptions).map((key) => ({
      ...textoptions[key],
      key,
    }));
  }

  function updateLines({ detail }) {
    const { key, ...value } = detail;
    lines.update(key, value);
  }

  function updateTextOptions({ detail }) {
    const { key, ...value } = detail;
    textoptions.update(key, value);
  }

  const dispatch = createEventDispatcher();
</script>

<div class="background">
  <button on:click={() => dispatch("dataEditor")}>
    {$_("options.edit_records")}
  </button>
  <div>
    <button on:click={() => dispatch("exportAll", { type: "svg" })}>
      {$_("options.download_as.svg")}
    </button>
    <button on:click={() => dispatch("exportAll", { type: "pdf" })}>
      {$_("options.download_as.pdf")}
    </button>
    <button on:click={() => dispatch("exportAll", { type: "png" })}>
      {$_("options.download_as.png")}
    </button>
    <button on:click={() => dispatch("exportAll", { type: "1pdf" })}>
      {$_("options.download_as.1pdf")}
    </button>
  </div>
  <h3>{$_("options.title")}</h3>
  <Collapsible header={$_("options.layout.title")}>
    <div class="labelvalue">
      <div class="tri">
        <label>{$_("options.layout.size")}</label>
        <DragInput
          value={$layout.size_x}
          on:change={layout.handleUpdate('size_x')}
        />
        <DragInput
        value={$layout.size_y}
        on:change={layout.handleUpdate('size_y')}
        />
      </div>
      <div class="tri">
        <label>{$_("options.layout.center")}</label>
        <DragInput
          value={$layout.center_x}
          on:change={layout.handleUpdate('center_x')}
        />
        <DragInput
        value={$layout.center_y}
        on:change={layout.handleUpdate('center_y')}
        />
      </div>
      <div class="tri">
        <label>{$_("options.layout.angle")}</label>
        <DragInput
          step={0.02}
          sensitivity={0.005}
          min={-Infinity}
          value={$layout.angleoffset}
          on:change={layout.handleUpdate('angleoffset')}
        />
        <span />
      </div>
    </div>
  </Collapsible>
  <Collapsible header={$_("options.export_options.title")} defaultState={false}>
    <div class="labelvalue">
      <div class="bl">
        <label>{$_("options.export_options.pdf_paper_size")}</label>
        <DragSelect
          options={papersizes}
          value={layout.papersize}
          on:change={(e) =>
            dispatch("layoutchange", {
              ...layout,
              papersize: e.detail.value,
            })}
        />
      </div>
      <div class="bl">
        <label>{$_("options.export_options.pdf_height")}</label>
        <DragInput
          value={layout.pdf_height}
          on:change={(e) =>
            dispatch("layoutchange", {
              ...layout,
              pdf_height: e.detail.value,
            })}
        />
      </div>
      <div class="tri">
        <label>{$_("options.export_options.png_size")}</label>
        <DragInput
          value={layout.png_width}
          on:change={(e) =>
            dispatch("layoutchange", {
              ...layout,
              png_width: e.detail.value,
            })}
        />
        <DragInput
          value={layout.png_height}
          on:change={(e) =>
            dispatch("layoutchange", {
              ...layout,
              png_height: e.detail.value,
            })}
        />
      </div>
    </div>
  </Collapsible>
  <Collapsible header={$_("options.labels.title")}>
    {#each $labels as label, index (label.key)}
      <LabelForm {label} {index} on:change={labels.handle} />
    {/each}
    <button on:click={() => labels.do("add")}>
      {$_("options.labels.add_label")}
    </button>
  </Collapsible>
  <Collapsible header={$_("options.color_and_grades.title")}>
    <DraggableList
      key="key"
      list={$grades.reduce((a, v) => [v, ...a], [])}
      let:item={grade}
      let:index={i}
      on:sort={(e) =>
        grades.do("reorder", {
          from: $grades.length - 1 - e.detail.from,
          to: $grades.length - 1 - e.detail.to,
        })}
      on:delete={(e) => grades.do("delete", { key: e.detail.item.key })}
    >
      <div class="grid2">
        <ColorSelector
          color={grade.color}
          key={grade.key}
          on:change={grades.handleUpdate(grade.key, "color")}
        />
        <input
          size="1"
          value={grade.name}
          on:input={grades.handleUpdate(grade.key, "name")}
        />
      </div>
    </DraggableList>
    <button on:click={(e) => grades.do("add", { index: 0 })}>
      {$_("options.color_and_grades.add_color")}
    </button>
  </Collapsible>
  <Collapsible header={$_("options.widths.title")} defaultState={false}>
    <label>{$_("options.widths.number_of_grades")}</label>
    <DragInput
      value={$spaces.length}
      sensitivity={0.02}
      on:change={handleSpacesChanged}
    />
    <div class="slider" style="height:{length}px;">
      {#each points as point, index}
        <div class="point" style="bottom:{point.offset}px">
          <div class="line" style="width:{30 + 60 * point.depth}px;" />
          <div class="input" style="left:{30 + 60 * point.depth}px;">
            <DragInput
              step={0.01}
              value={point.difference}
              size="1"
              on:change={spaces.handleUpdate(point.key, 'number')}
            />
          </div>
          <span />
        </div>
      {/each}
    </div>
  </Collapsible>
  <Collapsible header={$_("options.lines.title")} defaultState={false}>
    {#each transformLines($lines) as line (line.key)}
      <LineStyleForm
        key={line.key}
        title={$_(`properties.${line.key}`)}
        color={line.color}
        style={line.style}
        width={line.width}
        cap={line.cap}
        on:linestylechange={updateLines}
      />
    {/each}
  </Collapsible>
  <Collapsible header={$_("options.text_options.title")} defaultState={false}>
    {#each transformTextOptions($textoptions) as option (option.key)}
      <TextForm textoptions={option} on:textoptionschange={updateTextOptions} />
    {/each}
  </Collapsible>
</div>

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
