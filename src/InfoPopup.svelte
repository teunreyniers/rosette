<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let isOpen;
  export let background = "sandybrown";
  export let sidepanel = "salmon";
  export let close = "indianred";
  export let header;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("close");
  }
</script>

<style>
  .background {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    background-image: url("../pictures/star.svg");
    background-position: -300px center;
    background-blend-mode: overlay;
    background-repeat: space;
    background-size: cover;
    z-index: 100;
  }

  .holder {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    z-index: 102;
  }

  .container {
    position: relative;
    width: 80%;
    max-width: 800px;
    min-height: 50%;
    margin: 50px auto;
    display: grid;
    grid-template-columns: 30% 1fr;
    background: white;
  }

  .content {
    padding: 20px;
  }

  .side-image {
    display: block;
    transition: all 200ms;
  }

  .close {
    position: absolute;
    right: -21px;
    top: -21px;
    border-radius: 50%;
    color: white;
    width: 42px;
    height: 42px;
    cursor: pointer;
  }

  .close::after {
    content: "X";
    color: white;
    font-size: 1.2em;
    margin: auto;
    display: flex;
    justify-content: center;
    line-height: 40px;
  }

  @media only screen and (max-width: 600px) {
    .container {
      grid-template-columns: 30px 1fr;
    }
  }
</style>

{#if isOpen}
  <div
    class="background"
    style="background-color: {background}"
    transition:fade={{ duration: 300 }}
    on:click={handleClick} />
  <div class="holder">
    <div
      in:fly={{ x: -200, duration: 400 }}
      out:fly={{ y: 200, duration: 400 }}
      class="container">
      <span class="close" style="background: {close}" on:click={handleClick} />
      <div class="side-image" style="background: {sidepanel}" />
      <div class="content">
        <h1>{header}</h1>
        <slot />
      </div>
    </div>
  </div>
{/if}
