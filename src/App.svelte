<script>
  import moment from "moment";
  import FileSaver from "file-saver";
  import { _ } from "svelte-i18n";

  import Grid from "./Grid.svelte";
  import Rosette from "./Rosette.svelte";
  import Options from "./Options.svelte";
  import Nav from "./Nav.svelte";
  import DataEditor from "./DataEditor.svelte";
  import { onMount, tick } from "svelte";
  import { move } from "./utils";
  import { getSectionByIndex } from "./gradeCalculator";
  import { createPdf, createZip } from "./converter";
  import { v4 as uuidv4 } from "uuid";
  import { parseSheet } from "./dataparser";

  let state = {
    lines: {
      sections: {
        width: 0.9,
        style: "none",
        color: "#666666",
        cap: "round"
      },
      parts: {
        width: 0.7,
        style: "none",
        color: "#999999",
        cap: "round"
      },
      grades: {
        width: 0.7,
        style: "none",
        color: "#999999",
        cap: "round"
      }
    },
    textoptions: {
      sections: {
        title: $_("properties.sections"),
        readonly: false,
        name: "Student name",
        value: "<name>",
        xpos: 0,
        ypos: 5,
        size: 14,
        weight: 200,
        angle: 0,
        anchor: "middle",
        color: "#000000",
        curve: "normal",
        flip: "none"
      },
      parts: {
        title: $_("properties.parts"),
        readonly: false,
        name: "Student name",
        value: "<name>",
        xpos: 0,
        ypos: 0,
        size: 9,
        weight: 400,
        angle: 0,
        anchor: "middle",
        color: "#000000",
        curve: "normal",
        flip: "none"
      },
      grades: {
        title: $_("properties.grades"),
        readonly: false,
        name: "Student name",
        value: "<name>",
        xpos: 0,
        ypos: 30,
        size: 6,
        weight: 400,
        angle: 0,
        anchor: "middle",
        color: "#000000",
        curve: "normal",
        flip: "none"
      }
    }
  };

  let creator;
  let creatorIndex = 0;
  let grades = [
    { key: "1", color: "#ff8ba7", name: "Can Better" },
    { key: "2", color: "#ffc6c7", name: "Fine" },
    { key: "3", color: "#c3f0ca", name: "Good" },
    { key: "4", color: "#abd1c6", name: "Super" }
  ];
  let students = [
    {
      key: "dd",
      name: "Daan De man"
    },
    {
      key: "ee",
      name: "Frans de gans"
    },
    {
      key: "cc",
      name: "John Beko"
    },
    {
      key: "qq",
      name: "Els verlaten"
    }
  ];
  let sections = [
    {
      key: "dd",
      name: "Science",
      parts: [
        {
          key: "dd1",
          name: "Fysics",
          scores: ["", 2, 3, 2],
          tbs: 0,
          threshold: 0
        },
        {
          key: "dd2",
          name: "Biology",
          scores: [1, 2, 2, 3],
          tbs: 0,
          threshold: 0
        },
        {
          key: "dd3",
          name: "Chemistry",
          scores: [4, 2, 3, 1],
          tbs: 0,
          threshold: 0
        }
      ]
    },
    {
      key: "dddddfsassdf",
      name: "Science",
      parts: [
        {
          key: "fasdfasfsad dfasdf",
          name: "Chemistry",
          scores: [4, 2, 3, 1],
          tbs: 0,
          threshold: 0
        }
      ]
    },
    {
      key: "dd9",
      name: "Languages",
      parts: [
        {
          key: "dd54",
          name: "French",
          scores: [1, 2, 3, 4],
          tbs: 0,
          threshold: 0
        },
        {
          key: "dddd",
          name: "English",
          scores: [1, 2, 3, 1],
          tbs: 0,
          threshold: 0
        },
        {
          key: "dddddfd",
          name: "German",
          scores: [1, 2, 3, 5],
          tbs: 0,
          threshold: 0
        }
      ]
    }
  ];
  let labels = [
    {
      key: "__name__",
      readonly: true,
      name: $_("options.labels.student_name_label"),
      value: "Not used",
      xpos: 0,
      ypos: -145,
      size: 18,
      weight: 600,
      angle: 0,
      anchor: "middle",
      color: "#000000"
    },
    {
      key: uuidv4(),
      readonly: false,
      name: $_("options.labels.course_name_label"),
      value: $_("options.labels.course_name_label"),
      xpos: 0,
      ypos: -130,
      size: 12,
      weight: 200,
      angle: 0,
      anchor: "middle",
      color: "#000000"
    },
    {
      key: uuidv4(),
      readonly: false,
      name: $_("options.labels.copyright_label"),
      value: $_("options.labels.copyright_value"),
      xpos: -120,
      ypos: 115,
      size: 3,
      weight: 400,
      angle: 0,
      anchor: "left",
      color: "#000000"
    }
  ];
  let spaces = [2, 1, 1, 1, 0.7, 0.3];

  let layout = {
    size_x: 250,
    size_y: 290,
    center_x: 125,
    center_y: 170,
    papersize: "a4",
    angleoffset: -1.5,
    png_height: 2048,
    png_width: 2048,
    pdf_height: 500
  };

  let workbook = {};
  let file = {
    sheets: [],
    selectedsheet: ""
  };

  let dataoptions = {
    mode: "simple",
    thresholds: [0.5, 0.7, 0.9],
    importoptions: {}
  };

  let devitions = 4;

  $: rosettes = students.map((student, index) => ({
    sections: getSectionByIndex(sections, index, dataoptions),
    labels: labels.map(label => {
      if (label.key === "__name__") return { ...label, value: student.name };
      else return label;
    }),
    key: student.key
  }));

  let isEditRecordsOpen = true;

  function handleGradechange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "reorder":
        grades = move(grades, detail.from, detail.to);
        break;
      case "delete":
        grades = grades.filter((_, i) => detail.index != i);
        break;
      case "add":
        grades = [{ key: uuidv4(), value: "#ffffff" }, ...grades];
        break;
      case "change":
        grades[detail.index] = detail.value;
        break;
      default:
        break;
    }
  }

  function handleLabelChange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "add":
        labels = [
          ...labels,
          {
            key: uuidv4(),
            readonly: false,
            name: "<name>",
            value: "<value>",
            xpos: 0,
            ypos: 120,
            size: 12,
            weight: 400,
            angle: 0,
            anchor: "middle"
          }
        ];
        break;
      case "change":
        const { index, label } = detail;
        labels[index] = label;
        break;
      case "delete":
        labels = labels.filter((_, i) => detail.index != i);
        break;
      default:
        break;
    }
  }

  function handleSpaceChange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "change":
        spaces[detail.index] =
          detail.value === ""
            ? ""
            : Math.round(parseFloat(detail.value) * 100) / 100;
        break;
      case "devitions":
        devitions = detail.value === "" ? "" : parseInt(detail.value);
        const arr = spaces.slice(spaces.length - devitions - 2);
        spaces = [...Array(devitions + 2 - arr.length).fill(1), ...arr];
        break;
      default:
        break;
    }
  }

  function createKeyValueChangeHandler(name) {
    return ({ detail }) => {
      const { key, ...value } = detail;
      [name][key] = value;
    };
  }

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
      createPdf(items, layout);
    } else {
      createZip(items, event.detail.type, layout);
    }
  }

  function handleDatachange({ detail }) {
    const { target, action } = detail;
    if (target === "file") {
      if (action === "file") {
        workbook = detail.value;
        file.sheets = workbook.SheetNames;
        const sheet = workbook.Sheets[file.sheets[0]]
        if (sheet && sheet["!ref"]) {
          const result = parseSheet(sheet);
          students = result.students;
          sections = result.sections;
        }
      } else if (action === "selectedsheet") {
        file.selectedsheet = detail.value;
        const sheet = workbook.Sheets[file.selectedsheet];
        if (sheet && sheet["!ref"]) {
          const result = parseSheet(sheet);
          students = result.students;
          sections = result.sections;
        }
      }
    } else if (target === "dataoptions") {
      if (action === "modechange") {
        dataoptions.mode = detail.value;
      } else if (action === "change_threshold") {
        dataoptions.thresholds[detail.index] = detail.value;
        dataoptions.thresholds = dataoptions.thresholds.filter(e => e !== "");
      } else if (action === "add_threshold") {
        dataoptions.thresholds = [...dataoptions.thresholds, detail.value];
      }
    } else if (target === "students") {
      if (action === "change") {
        students[detail.index].name = detail.value;
      } else if (action == "add") {
        sections = sections.map(section => ({
          ...section,
          parts: section.parts.map(part => ({
            ...part,
            scores: [...part.scores, 0]
          }))
        }));
        students = [
          ...students,
          {
            key: uuidv4(),
            name: detail.value
          }
        ];
      }
    } else if (target === "sections") {
      if (action === "reorder") {
        sections = move(sections, detail.from, detail.to);
      } else if (action === "delete") {
        sections = sections.filter((_, i) => detail.index != i);
      } else if (action === "add") {
        sections = [
          ...sections,
          { key: uuidv4(), name: "new section", parts: [] }
        ];
      } else if (action === "change") {
        sections[detail.index].name = detail.value;
      }
    } else if (target === "parts") {
      if (action === "reorder") {
        const { from, to, fromscope, toscope } = detail;
        const item = sections[fromscope].parts[from];
        sections[fromscope].parts = sections[fromscope].parts.filter(
          (_, i) => from != i
        );
        const arr = sections[toscope].parts;
        sections[toscope].parts = [
          ...arr.slice(0, to),
          item,
          ...arr.slice(to, arr.length)
        ];
      } else if (action === "delete") {
        sections[detail.sectionindex].parts = sections[
          detail.sectionindex
        ].parts.filter((_, i) => detail.index != i);
      } else if (action === "add") {
        sections[detail.sectionindex].parts = [
          ...sections[detail.sectionindex].parts,
          {
            key: uuidv4(),
            name: "<name>",
            tbs: "",
            threshold: "",
            scores: Array(students.length).fill("")
          }
        ];
      } else if (action === "name_change") {
        sections[detail.sectionindex].parts[detail.index] = {
          ...sections[detail.sectionindex].parts[detail.index],
          name: detail.value
        };
        sections = sections;
      } else if (action === "cell_change") {
        sections[detail.sectionindex].parts[detail.index].scores[
          detail.cellindex
        ] = detail.value;
        sections = sections;
      } else if (action === "tbs_change") {
        sections[detail.sectionindex].parts[detail.index] = {
          ...sections[detail.sectionindex].parts[detail.index],
          tbs: detail.value
        };
      } else if (action === "threshold_change") {
        sections[detail.sectionindex].parts[detail.index] = {
          ...sections[detail.sectionindex].parts[detail.index],
          threshold: detail.value
        };
      }
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
    colors={grades.map(x => x.color)}
    grades={grades.map(x => x.name)}
    sections={rosettes[creatorIndex].sections}
    labels={rosettes[creatorIndex].labels}
    {spaces}
    {devitions}
    lines={state.lines}
    {layout}
    textoptions={state.textoptions}
    key={rosettes[creatorIndex].key} />
  <!-- {/if} -->
</div>

<div class="app">
  <Nav />
  <Options
    {grades}
    {labels}
    {spaces}
    {devitions}
    {layout}
    lines={Object.keys(state.lines).map(key => ({ ...state.lines[key], key }))}
    textoptions={Object.keys(state.textoptions).map(key => ({
      ...state.textoptions[key],
      key
    }))}
    on:gradechange={handleGradechange}
    on:dataEditor={() => (isEditRecordsOpen = true)}
    on:labelchange={handleLabelChange}
    on:spacechange={handleSpaceChange}
    on:linestylechange={createKeyValueChangeHandler('lines')}
    on:textoptionschange={createKeyValueChangeHandler('textoptions')}
    on:layoutchange={e => (layout = e.detail)}
    on:exportAll={handleDownloadFile} />
  <Grid
    items={rosettes}
    let:item={rosette}
    let:index
    xsize={layout.size_x}
    ysize={layout.size_y}>
    <Rosette
      colors={grades.map(x => x.color)}
      grades={grades.map(x => x.name)}
      sections={rosette.sections}
      labels={rosette.labels}
      {spaces}
      {devitions}
      lines={state.lines}
      {layout}
      textoptions={state.textoptions}
      key={rosette.key} />
  </Grid>
</div>

{#if isEditRecordsOpen}
  <DataEditor
    {sections}
    {students}
    {dataoptions}
    {file}
    on:close={() => (isEditRecordsOpen = false)}
    on:change={handleDatachange} />
{/if}
