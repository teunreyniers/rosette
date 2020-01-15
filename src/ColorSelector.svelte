<script>
  import { createEventDispatcher } from "svelte";

  export let color;

  const dispatch = createEventDispatcher();
</script>

<style>
  .container {
    display: grid;
    grid-gap: 7px;
    height: 35px;
    grid-template-columns: 35px 2fr 1fr;
  }

  .preview {
    width: 35px;
    border: 1px solid #ccc;
    border-radius: 2px;
    display: block;
  }

  input {
    margin: 0px;
    min-width: 60px;
  }
</style>

<div class="container">
  <div class="preview" style="background-color: {color.value}" />
  <input bind:value={color.value} on:input={() => dispatch('changed', color)} />
  <input bind:value={color.width} on:input={() => dispatch('changed', color)} />
</div>
