<script>
  import Rosette from "./Rosette.svelte";
  import Options from "./Options.svelte";
  import Nav from "./Nav.svelte";

  let colors = [{key: "1", value: "#ff8ba7"},{key: "2", value: "#ffc6c7"}, {key: "3", value: "#c3f0ca"},{key: "4", value:  "#abd1c6"}];

  const sections = [
    {
      name: "Arno",
      parts: [
        { devitions: 1, name: "Hello" },
        { devitions: 4, name: "Hello world" },
        { devitions: 2, name: "Yeah!" }
      ]
    },
    {
      name: "Else",
      parts: [
        { devitions: 3, name: "the good things" },
        { devitions: 2, name: "No more" }
      ]
    },
    {
      name: "Last",
      parts: [
        { devitions: 1, name: "Like this" },
        { devitions: 3, name: "After" }
      ]
    }
  ];

  function CreateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
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
};

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
        colors = [{key: CreateUUID(), value:""}, ...colors];
        break;
      case "change":
        colors[detail.index] = detail.newColor;
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
  }

  @media only screen and (max-width: 600px) {
    .app {
      grid-template: "nav" auto "options" 300px "preview" 1fr / 1fr;
    }
  }

  .options {
    grid-area: options;
  }
</style>

<div class="app">
  <Nav />

  <Options {colors} on:colorChange={handleColorChange} />
  <Rosette colors={colors.map(x=>x.value)} {sections} on:cirlcemove={e => console.log(e.detail)} />
</div>
