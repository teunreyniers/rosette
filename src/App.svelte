<script>
  import Rosette from "./Rosette.svelte";
  import Options from "./Options.svelte"
  import Nav from "./Nav.svelte";


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

  
</script>

<style>
  .app {
    display: grid;
    grid-template: "nav nav" auto "options preview" 1fr / 300px 1fr;
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
  <Nav/>

  <Options/>
  <Rosette {sections} on:cirlcemove={e => console.log(e.detail)} />
</div>

