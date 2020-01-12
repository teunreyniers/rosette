<script>
	import Rosette from "./Rosette.svelte";
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
  
</style>

<main>
  <Nav></Nav>
  <Rosette {sections} on:cirlcemove={e => console.log(e.detail)} />
</main>
