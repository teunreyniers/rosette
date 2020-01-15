<script>
import {slide } from "svelte/transition"

  export let header;

  let isOpen = true;
</script>

<style>
  h4 {
    margin: 0px;
    cursor: pointer;
  }

  h4 span {
    cursor: pointer;
    border-radius: 2px;
    height: 20px;
    width: 20px;
    display: inline-block;
    transition: transform 200ms ease-in-out;
    line-height: 10px;
  }

  .isOpen {
    transform: rotateZ(90deg);
    
  }
</style>

<h4  on:click={() => (isOpen = !isOpen)}>
  <span class:isOpen>></span>
  {header}
</h4>

{#if isOpen}
  <div transition:slide>
    <slot />
  </div>
{/if}
