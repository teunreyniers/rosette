<script>
  import DraggablePanes from "./DraggablePanes.svelte";
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  export let students;
  export let sections;

  const dispatch = createEventDispatcher();

  let sectionDraggable = false;
  let partDraggable = false;

  function handleNewStudent(e) {
    if (e.target.value) {
      dispatch("studentchange", { action: "add", name: e.target.value });
    }
    e.target.value = "";
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
    border: 1px solid #ccc;
    border-radius: 2px;
    overflow: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: 3px 10px;
    background: #eee;
  }

  h2 {
    margin: 0px;
    font-weight: normal;
  }
  button {
    margin: 0px;
  }

  .data {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: left;
  }

  .students {
    margin-top: 80px;
  }

  .students input {
    white-space: nowrap;
    width: max-content;
    text-align: left;
    margin: 0px 5px;
  }

  .section {
    border: 1px solid #ccc;
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

  .cell {
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: center;
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
    min-width: 70px;
  }

  .empty-delete {
    height: 0px;
    margin: 0px;
    padding: 0px;
  }

  input {
    padding: 0px;
    margin: 0px;
    border: 0px;
    min-width: 0px;
    border-radius: 0px;
    width: 70px;
    text-align: center;
  }

  .add-section {
    margin: 15px 5px;
  }

  .section-button {
    padding: 2px 5px;
    cursor: pointer;
  }
</style>

{#if sections && students}
  <div class="container" transition:slide>
    <div class="header">
      <h2>Data editor</h2>
      <button on:click={() => dispatch('close')}>Done</button>
    </div>
    <div class="data">
      <div class="students">
        {#each students as student}
          <div class="cell">
            <input value={student.name} />
          </div>
        {/each}
        <div class="cell">
          <input placeholder="new student" on:change={handleNewStudent} />
        </div>
      </div>
      <DraggablePanes
        list={sections}
        key="key"
        scope="section"
        let:item={section}
        let:index={sectionindex}
        on:sort={({ detail }) => dispatch('sectionchange', {
            action: 'reorder',
            ...detail
          })}>
        <span slot="dragger" class="dragger">...</span>
        <span slot="delete" />
        <div class="section">
          <div class="cell">
            <button
              class="section-button"
              on:click={() => dispatch('partchange', {
                  action: 'add',
                  sectionindex
                })}>
              +
            </button>
            <input
              class="section-name"
              size="1"
              value={section.name}
              on:change={e => dispatch('sectionchange', {
                  action: 'change',
                  index: sectionindex,
                  newName: e.target.value
                })} />
            <button
              class="section-button"
              on:click={() => dispatch('sectionchange', {
                  action: 'delete',
                  sectionindex
                })}>
              X
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
              on:sort={({ detail }) => dispatch('partchange', {
                  action: 'reorder',
                  ...detail
                })}>
              <span slot="dragger" class="dragger">...</span>
              <span class="empty-delete" slot="delete" />
              <div class="part">
                <div class="cell">
                  <input
                    value={part.name}
                    on:change={e => dispatch('partchange', {
                        action: 'change',
                        partindex,
                        sectionindex,
                        newName: e.target.value
                      })} />
                </div>
                {#each part.scores as score, cellindex}
                  <div class="cell">
                    <input
                      value={score}
                      on:change={e => dispatch('partchange', {
                          action: 'cell',
                          cellindex,
                          partindex,
                          sectionindex,
                          value: e.target.value
                        })} />
                  </div>
                {/each}
              </div>
              <button
                class="section-button"
                on:click={() => dispatch('partchange', {
                    action: 'delete',
                    sectionindex,
                    partindex
                  })}>
                X
              </button>
            </DraggablePanes>
          </div>
        </div>
      </DraggablePanes>

      <button
        class="add-section"
        on:click={() => dispatch('sectionchange', { action: 'add' })}>
        +
      </button>
    </div>

  </div>
{/if}
