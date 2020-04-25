<script>
  import DraggablePanes from "./DraggablePanes.svelte";
  import { createEventDispatcher, tick } from "svelte";
  import { slide } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import XLSX from "xlsx";
  import { findParent, findNodeIndex } from "../helpers/nodes"

  export let students;
  export let sections;
  export let dataoptions;
  export let file;

  const dispatch = createEventDispatcher();

  let sectionDraggable = false;
  let partDraggable = false;
  let dataNode;

  function createChangeHandler(target, action, extra = {}) {
    return e => {
      dispatch("change", {
        target,
        action,
        value: e.target.value,
        ...extra
      });
    };
  }

  function createPassthroughHandler(target, action) {
    return e => {
      dispatch("change", {
        ...e.detail,
        target,
        action
      });
    };
  }

  function findCellIndex(cell){
    return findNodeIndex(cell.parentNode)
  }

  function findPartIndex(node) {
    const part = findParent(node, "li");
    return findNodeIndex(part)
  }

  function findSectionIndex(node) {
    const partparent = findParent(node, "ul");
    const section = findParent(partparent.parentNode, "li");
    return findNodeIndex(section)
  }

  function getCell(cellindex, partindex, sectionindex) {
    const section = dataNode.children[0].children[sectionindex];
    if (!section) return undefined;
    const part =
      section.children[1].children[1].children[0].children[partindex];
    if (!part) return undefined;
    const partchildren = part.children[1];
    if (!part) return undefined;
    const cell = partchildren.children[cellindex];
    if (!cell) return undefined;
    return cell.children[0];
  }

  function countPart(sectionindex) {
    const section = dataNode.children[0].children[sectionindex];
    if (!section) return 0;
    return section.children[1].children[1].children[0].children.length;
  }

  function tabstop(event) {
    let cellindex = findCellIndex(event.target);
    let partindex = findPartIndex(event.target);
    let sectionindex = findSectionIndex(event.target);
    if (event.key === "Enter") {
      const newcell = getCell(
        cellindex + (event.shiftKey ? -1 : 1),
        partindex,
        sectionindex
      );
      if (newcell) {
        newcell.select();
      }
    } else if (event.key === "Tab") {
      event.preventDefault();

      let newcell;
      partindex += event.shiftKey ? -1 : 1;
      while (!newcell && sectionindex < sections.length && sectionindex >= 0) {
        newcell = getCell(cellindex, partindex, sectionindex);
        sectionindex += event.shiftKey ? -1 : 1;
        partindex = event.shiftKey ? countPart(sectionindex) - 1 : 0;
      }

      if (newcell) {
        newcell.select();
      }
    }
  }

  async function clearValue(event) {
    event.target.value = "";
    await tick();
    event.target.select();
  }

  function notab(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      dispatch("change", {
        target: "dataoptions",
        action: "addthreshold",
        value: event.target.value
      });
      event.target.value = "";
    }
  }

  function handleFile(e) {
    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });

      dispatch("change", {
        target: "file",
        action: "file",
        value: workbook
      });
    };
    reader.readAsArrayBuffer(f);
  }
</script>

<style>
  .container {
    position: fixed;
    top: 52px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    background: white;
    border: none;
    border-radius: 2px;
    overflow: auto;
    z-index: 50;
    display: grid;
    grid-template: "a a" auto "b b" auto "c d" 1fr / auto 1fr;
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: 3px 10px;
    background: #eee;
    grid-area: a;
  }

  .options {
    grid-area: b;
    display: flex;
    padding: 10px;
  }

  .students {
    margin-top: 55px;
    grid-area: c;
  }

  .students input {
    width: 150px;
    white-space: nowrap;
    text-align: left;
    margin: 0px 5px;
  }

  .data {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: left;
    overflow: auto;
    height: inherit;
    grid-area: d;
  }

  .cell {
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: center;
    height: 25px;
  }

  h2 {
    margin: 0px;
    font-weight: normal;
  }

  button {
    margin: 0px;
  }

  .section {
    border: none;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  .section .body {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    height: 100%;
  }

  .cell:first-child {
    border-top: 1px solid #ccc;
  }

  .dragger {
    display: flex;
    justify-content: center;
    height: 10px;
    color: black;
    line-height: 0px;
    cursor: pointer;
    user-select: none;
    margin: 0px 2px;
  }

  .dragger:hover {
    background: #eee;
    color: white;
  }

  .section-name {
    width: 100%;
  }

  .empty-delete {
    height: 0px;
    margin: 0px;
    padding: 0px;
  }

  .students input,
  .data input {
    padding: 2px;
    margin: 0px;
    border: 0px;
    border-radius: 0px;
    text-align: center;
  }

  .add-section {
    margin: 15px 5px;
    height: 30px;
    line-height: 15px;
  }

  .part input {
    min-width: 76px;
  }

  .section-button,
  .part-button {
    padding: 2px 3px;
    cursor: pointer;
    border: none;
    visibility: hidden;
    background: transparent;
  }

  .part-button {
    margin: auto;
    display: block;
  }

  .part:hover .part-button,
  .section:hover .section-button {
    visibility: visible;
  }

  .section-button.green:hover {
    color: green;
  }

  .section-button.red:hover,
  .part-button.red:hover {
    color: red;
  }

  .green {
    font-size: 1.3em;
    line-height: 8px;
  }

  .section .cell {
    border-left: 1px solid #ccc;
    min-width: max-content;
  }

  .data > ul > li:last-child .section > .cell,
  .data > ul > li:last-child .section li:last-child .part .cell {
    border-right: 1px solid #ccc;
  }

  .body li:first-child .cell {
    border-left: 1px solid #ccc;
  }

  .data > ul > li:first-child .section li:first-child .part .cell {
    border-left: none;
  }

  .students .cell {
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
    border-bottom: none;
  }

  .students .cell:last-child {
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .scroll {
    overflow: auto;
    height: 100%;
  }

  .students .cell.label {
    border-top: none;
    border-bottom: none;
    justify-content: right;
    padding-right: 3px;
    height: 26px;
  }

  .thresholds {
    display: flex;
    vertical-align: center;
  }

  .thresholds input {
    margin: auto 2px;
  }

  .thresholds input:last-child {
    border-color: #ddd;
  }
  .thresholds input:last-child:hover,
  .thresholds input:last-child:focus {
    border-color: #ccc;
  }

  .options > div {
    display: flex;
  }

  .options label {
    margin: auto 2px;
  }
</style>

{#if sections && students}
  <div class="container" transition:slide>
    <div class="header">
      <h2>{$_('data_editor.title')}</h2>
      <button on:click={() => dispatch('close')}>
        {$_('data_editor.done')}
      </button>
    </div>
    <div class="options">
      <div>
        <label>{$_('data_editor.mode')}</label>
        <select
          value={dataoptions.mode}
          on:change={createChangeHandler('dataoptions', 'modechange')}>
          <option value="simple">{$_('data_editor.mode_simple')}</option>
          <option value="normal">{$_('data_editor.mode_normal')}</option>
          <option value="advanced">{$_('data_editor.mode_advanced')}</option>
        </select>
      </div>
      {#if dataoptions.mode !== 'simple'}
        <label>{$_('data_editor.thresholds')}</label>
        <div class="thresholds">
          {#each dataoptions.thresholds as threshold, index}
            <input
              size="1"
              value={threshold}
              on:change={createChangeHandler(
                'dataoptions',
                'change_threshold',
                {
                  index
                }
              )} />
          {/each}
          <input
            size="1"
            on:change={createChangeHandler('dataoptions', 'add_threshold')}
            on:change={clearValue}
            on:keydown={notab} />
        </div>
      {/if}
      <input type="file" on:change={handleFile} />
      <select
        value={file.selectedsheet}
        on:change={createChangeHandler('file', 'selectedsheet')}>
        {#each file.sheets as sheet}
          <option>{sheet}</option>
        {/each}
      </select>
    </div>
    <div class="students">
      <div class="cell label" />
      {#if dataoptions.mode === 'normal' || dataoptions.mode === 'advanced'}
        <div class="cell label">{$_('data_editor.max')}</div>
      {/if}
      {#if dataoptions.mode === 'advanced'}
        <div class="cell label">{$_('data_editor.threshold')}</div>
      {/if}
      {#each students as student, index (student.key)}
        <div class="cell">
          <input
            size="1"
            title={student.name}
            value={student.name}
            on:change={createChangeHandler('students', 'change', { index })} />
        </div>
      {/each}
      <div class="cell newstudent">
        <input
          size="1"
          placeholder={$_('data_editor.new_student')}
          on:change={createChangeHandler('students', 'add')}
          on:change={clearValue} />
      </div>
    </div>
    <div class="scroll">
      <div class="data" bind:this={dataNode}>
        <DraggablePanes
          list={sections}
          key="key"
          scope="secnption"
          let:item={section}
          let:index={sectionindex}
          on:sort={createPassthroughHandler('sections', 'reorder')}>
          <span slot="dragger" class="dragger">...</span>
          <span slot="delete" />
          <div class="section">
            <div class="cell">
              <button
                title="remove section"
                class="section-button red"
                on:click={createChangeHandler('sections', 'delete', {
                  index: sectionindex
                })}>
                X
              </button>
              <input
                class="section-name"
                size="1"
                title={section.name}
                value={section.name}
                on:change={createChangeHandler('sections', 'change', {
                  index: sectionindex
                })} />
              <button
                title="add part"
                class="section-button green"
                on:click={createChangeHandler('parts', 'add', {
                  sectionindex
                })}>
                +
              </button>
            </div>
            <div class="body">
              <DraggablePanes
                list={section.parts}
                key="key"
                scope="part"
                scopeindex={sectionindex}
                let:item={part}
                let:index={partindex}
                on:sort={createPassthroughHandler('parts', 'reorder')}>
                <span slot="dragger" class="dragger">...</span>
                <span class="empty-delete" slot="delete" />
                <div class="part">
                  <div class="cell">
                    <input
                      size="1"
                      title={part.name}
                      value={part.name}
                      on:change={createChangeHandler('parts', 'name_change', {
                        index: partindex,
                        sectionindex
                      })}
                      on:keydown={tabstop} />
                  </div>
                  {#if dataoptions.mode === 'normal' || dataoptions.mode === 'advanced'}
                    <div class="cell">
                      <input
                        size="1"
                        value={part.tbs}
                        on:change={createChangeHandler('parts', 'tbs_change', {
                          index: partindex,
                          sectionindex
                        })}
                        on:keydown={tabstop} />
                    </div>
                  {/if}
                  {#if dataoptions.mode === 'advanced'}
                    <div class="cell">
                      <input
                        size="1"
                        value={part.threshold}
                        on:change={createChangeHandler(
                          'parts',
                          'threshold_change',
                          {
                            index: partindex,
                            sectionindex
                          }
                        )}
                        on:keydown={tabstop} />
                    </div>
                  {/if}
                  {#each part.scores as score, cellindex}
                    <div class="cell">
                      <input
                        size="1"
                        value={score}
                        on:change={createChangeHandler('parts', 'cell_change', {
                          index: partindex,
                          cellindex,
                          sectionindex
                        })}
                        on:keydown={tabstop} />
                    </div>
                  {/each}
                  <button
                    class="part-button red"
                    on:click={createChangeHandler('parts', 'delete', {
                      index: partindex,
                      sectionindex
                    })}>
                    X
                  </button>
                </div>
              </DraggablePanes>
            </div>
          </div>
        </DraggablePanes>
        <button
          class="add-section"
          title="Add section"
          on:click={createChangeHandler('sections', 'add')}>
          +
        </button>
      </div>
    </div>
  </div>
{/if}
