<script>
  import Grid from "./Grid.svelte";
  import Rosette from "./Rosette.svelte";
  import Options from "./Options.svelte";
  import Nav from "./Nav.svelte";
  import DataEditor from "./DataEditor.svelte";

  let colors = [
    { key: "1", value: "#ff8ba7" },
    { key: "2", value: "#ffc6c7" },
    { key: "3", value: "#c3f0ca" },
    { key: "4", value: "#abd1c6" }
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
      ypos: 140,
      size: 12,
      weight: 400,
      angle: 0,
      anchor: "middle"
    },
    {
      key: CreateUUID(),
      readonly: false,
      name: "Course name",
      value: "Mathematics",
      xpos: 0,
      ypos: 120,
      size: 12,
      weight: 400,
      angle: 0,
      anchor: "middle"
    }
  ];

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

  function handleColorChange({ detail }) {
    const { action } = detail;
    switch (action) {
      case "reorder":
        colors = array_move(colors, detail.from, detail.to);
        break;
      case "delete":
        colors = colors.filter((_, i) => detail.index != i);
        break;
      case "add":
        colors = [{ key: CreateUUID(), value: "#ffffff" }, ...colors];
        break;
      case "change":
        colors[detail.index] = detail.newColor;
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
    //   console.log(r);
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
    {colors}
    {labels}
    on:colorChange={handleColorChange}
    on:dataEditor={() => (isEditRecordsOpen = true)}
    on:labelchange={handleLabelChange} />
  <Grid items={rosettes} let:item={rosette} let:index>
    <Rosette
      colors={colors.map(x => x.value)}
      sections={rosette.sections}
      labels={rosette.labels}
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
