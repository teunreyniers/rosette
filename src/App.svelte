<script>
  import Grid from "./Grid.svelte";
  import Rosette from "./Rosette.svelte";
  import Options from "./Options.svelte";
  import Nav from "./Nav.svelte";
  import DataEditor from "./DataEditor.svelte";

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
          scores: ["", 2, 3, 2]
        },
        {
          key: "dd2",
          name: "Biology",
          scores: [1, 2, 2, 3]
        },
        {
          key: "dd3",
          name: "Chemistry",
          scores: [4, 2, 3, 1]
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
          scores: [4, 2, 3, 1]
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
          scores: [1, 2, 3, 4]
        },
        {
          key: "dddd",
          name: "English",
          scores: [1, 2, 3, 1]
        },
        {
          key: "dddddfd",
          name: "German",
          scores: [1, 2, 3, 5]
        }
      ]
    }
  ];
  let labels = [
    {
      key: "__name__",
      readonly: true,
      name: "Student name",
      value: "<name>",
      xpos: 0,
      ypos: -145,
      size: 18,
      weight: 600,
      angle: 0,
      anchor: "middle",
      color: "#000000"
    },
    {
      key: CreateUUID(),
      readonly: false,
      name: "Course name",
      value: "<Course name>",
      xpos: 0,
      ypos: -130,
      size: 12,
      weight: 200,
      angle: 0,
      anchor: "middle",
      color: "#000000"
    }
  ];
  let spaces = [2, 1, 1, 1, 0.7, 0.3];
  let lines = {
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
  };
  let layout = {
    size_x: 250,
    size_y: 290,
    center_x: 125,
    center_y: 170,
    papersize: "A4",
    angleoffset: 90
  };
  let textoptions = {
    sections: {
      title: "Sections",
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
      title: "Parts",
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
      title: "Grades",
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
  };

  let devitions = 4;

  $: rosettes = students.map((student, index) => ({
    sections: getSectionByIndex(sections, index),
    labels: labels.map(label => {
      if (label.key === "__name__") return { ...label, value: student.name };
      else return label;
    }),
    key: student.key
  }));

  let isEditRecordsOpen = false;

  function CreateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  }

  function handleGradechange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "reorder":
        grades = array_move(grades, detail.from, detail.to);
        break;
      case "delete":
        grades = grades.filter((_, i) => detail.index != i);
        break;
      case "add":
        grades = [{ key: CreateUUID(), value: "#ffffff" }, ...grades];
        break;
      case "change":
        grades[detail.index] = detail.value;
        break;
      default:
        break;
    }
  }

  function handleSectionChange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "reorder":
        sections = array_move(sections, detail.from, detail.to);
        break;
      case "delete":
        sections = sections.filter((_, i) => detail.sectionindex != i);
        break;
      case "add":
        sections = [
          { key: CreateUUID(), name: "new section", parts: [] },
          ...sections
        ];
        break;
      case "change":
        sections[detail.index].name = detail.newName;
        break;
      default:
        break;
    }
  }

  function handlePartChange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "reorder":
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
        break;
      case "delete":
        sections[detail.sectionindex].parts = sections[
          detail.sectionindex
        ].parts.filter((_, i) => detail.partindex != i);
        break;
      case "add":
        sections[detail.sectionindex].parts = [
          {
            key: CreateUUID(),
            name: "<name>",
            scores: Array(students.length).fill("")
          },
          ...sections[detail.sectionindex].parts
        ];
        break;
      case "change":
        sections[detail.sectionindex].parts[detail.partindex] = {
          ...sections[detail.sectionindex].parts[detail.partindex],
          name: detail.newName
        };
        sections = sections;
        break;
      case "cell":
        sections[detail.sectionindex].parts[detail.partindex].scores[
          detail.cellindex
        ] = detail.value;
        sections = sections;
        break;
      default:
        break;
    }
  }

  function handleStudentChange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "add":
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
            key: CreateUUID(),
            name: detail.name
          }
        ];
        break;
      case "change":
        sections[detail.index].name = detail.newName;
        break;
      default:
        break;
    }
  }

  function getSectionByIndex(sections, index) {
    const r = sections.map(e => ({
      ...e,
      parts: e.parts
        .map(p => ({
          ...p,
          devitions: p.scores[index]
        }))
        .filter(p => p.devitions !== "")
    }));
    return r;
  }

  function handleLabelChange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "add":
        labels = [
          ...labels,
          {
            key: CreateUUID(),
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

  function handleLineStyleChanged({ detail }) {
    const { title, ...style } = detail;
    lines[title.toLowerCase()] = style;
  }

  function handleTextoptionsChange({ detail }) {
    const { key, ...options } = detail;
    textoptions[key] = options;
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

  @media only screen and (max-width: 600px) {
    .app {
      grid-template: "nav" auto "options" 300px "preview" 1fr / 1fr;
    }
  }
</style>

<div class="app">
  <Nav />
  <Options
    {grades}
    {labels}
    {spaces}
    {devitions}
    {layout}
    lines={Object.keys(lines).map(key => ({ ...lines[key], key }))}
    textoptions={Object.keys(textoptions).map(key => ({
      ...textoptions[key],
      key
    }))}
    on:gradechange={handleGradechange}
    on:dataEditor={() => (isEditRecordsOpen = true)}
    on:labelchange={handleLabelChange}
    on:spacechange={handleSpaceChange}
    on:linestylechange={handleLineStyleChanged}
    on:textoptionschange={handleTextoptionsChange}
    on:layoutchange={e => (layout = e.detail)} />
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
      {lines}
      {layout}
      {textoptions}
      key={rosette.key} />
  </Grid>
</div>

{#if isEditRecordsOpen}
  <DataEditor
    {sections}
    {students}
    on:close={() => (isEditRecordsOpen = false)}
    on:sectionchange={handleSectionChange}
    on:partchange={handlePartChange}
    on:studentchange={handleStudentChange} />
{/if}
