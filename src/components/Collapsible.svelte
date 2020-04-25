<script>
  import { slide } from "svelte/transition";

  export let header = "";
  export let reverse = false;
  export let defaultState = true;

  let isOpen = defaultState;
</script>

<style>
  h4 {
    margin: 0px;
    display: grid;
    grid-template: "a b" / auto 1fr;
    grid-gap: 2px;
    width: 100%;
  }

  h4 span {
    cursor: pointer;
    display: inline-block;
    transition: transform 200ms ease-in-out;
  }

  h4 div {
    margin-top: auto;
  }

  .isOpen {
    transform: rotateZ(90deg);
  }

  .reverse {
    grid-template: "b a" / 1fr auto;
  }
</style>

<h4 class:reverse>
  <div style="grid-area: a" on:click={() => (isOpen = !isOpen)}>
    <slot name="collapser" {isOpen}>
      <span class:isOpen>></span>
    </slot>
  </div>
  <slot name="header">
    <span on:click={() => (isOpen = !isOpen)}>{header}</span>
  </slot>
</h4>

{#if isOpen}
  <div transition:slide>
    <slot>
      <p>Empty slot</p>
    </slot>
  </div>
{/if}
