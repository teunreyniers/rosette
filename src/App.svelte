<script>
  import { _ } from "svelte-i18n";
  import {get} from "svelte/store"
  import Grid from "./components/Grid.svelte";
  import Rosette from "./components/Rosette.svelte";
  import Options from "./components/Options.svelte";
  import Nav from "./components/Nav.svelte";
  import DataEditor from "./components/DataEditor.svelte";
  import { tick } from "svelte";
  import { createPdf, createZip } from "./converter";

  import { lines, textoptions, grades, spaces, layout, students, rosettes } from "./stores"


  let creator;
  let creatorIndex = 0;



  let file = {
    sheets: [],
    selectedsheet: ""
  };

  let dataoptions = {
    mode: "simple",
    thresholds: [0.5, 0.7, 0.9],
    importoptions: {}
  };


  let isEditRecordsOpen = false;

  async function handleDownloadFile(event) {
    // Loop through every student and generate svg code
    const items = [];
    creatorIndex = 0;
    await tick();
    for (let i = 0; i < students.length; i++) {
      creatorIndex = i;
      await tick();

      items.push({
        name: students[i].name,
        svg: creator.innerHTML
      });
    }
    creatorIndex = 0;

    // Convert the svg code to the desired file format
    if (event.detail.type === "1pdf") {
      createPdf(items, get(layout));
    } else {
      createZip(items, event.detail.type, get(layout));
    }
  }

 
</script>

<style>
  .app {
    display: grid;
    grid-template: "nav nav" auto "options preview" 1fr / 300px 1fr;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .hidden {
    visibility: collapse;
    height: 0px;
    overflow: hidden;
  }

  @media only screen and (max-width: 600px) {
    .app {
      grid-template: "nav" auto "options" 300px "preview" 1fr / 1fr;
    }
  }
</style>

<svelte:head>
  <title>{$_('page_title')}</title>
</svelte:head>

<div bind:this={creator} class="hidden">
  <!-- {#if creatorIndex} -->
  <Rosette
    colors={$grades.map(x => x.color)}
    grades={$grades.map(x => x.name)}
    sections={$rosettes[creatorIndex].sections}
    labels={$rosettes[creatorIndex].labels}
    spaces={$spaces.map(e=>e.number)}
    devitions={$spaces.length - 2}
    lines={$lines}
    layout={$layout}
    textoptions={$textoptions}
    key={$rosettes[creatorIndex].key} />
  <!-- {/if} -->
</div>

<div class="app">
  <Nav />
  <Options
    on:dataEditor={() => (isEditRecordsOpen = true)}
    on:exportAll={handleDownloadFile} 
    />
  <Grid
    items={$rosettes}
    let:item={rosette}
    xsize={$layout.size_x}
    ysize={$layout.size_y}>
    <Rosette
      colors={$grades.map(x => x.color)}
      grades={$grades.map(x => x.name)}
      sections={rosette.sections}
      labels={rosette.labels}
      spaces={$spaces.map(e=>e.number)}
      devitions={$spaces.length -2 }
      lines={$lines}
      layout={$layout}
      textoptions={$textoptions}
      key={rosette.key} />
  </Grid>
</div>

{#if isEditRecordsOpen}
  <DataEditor
    {dataoptions}
    {file}
    on:close={() => (isEditRecordsOpen = false)} />
{/if}
