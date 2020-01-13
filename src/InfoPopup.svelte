<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let isOpen;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("close");
  }
</script>

<style>
  .background {
    position: fixed;
    background: sandybrown;
    width: 100%;
    height: 100%;
    top: 0px;
  }

  .holder {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
  }

  .container {
    position: relative;
    width: 80%;
    height: 50%;
    margin: 50px auto;
    display: grid;
    grid-template-columns: 1fr 2fr;
    background: white;
  }

  .content {
    padding: 20px;
  }

  .side-image {
    background: salmon;
  }

  .close {
    position: absolute;
    right: -21px;
    top: -21px;
    border-radius: 50%;
    background: indianred;
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
</style>

{#if isOpen}
  <div class="background" transition:fade on:click={handleClick} />
  <div class="holder">
    <div class="container">
      <span class="close" on:click={handleClick} />
      <div class="side-image" />
      <div transition:fly class="content">
        <slot />
      </div>
    </div>
  </div>
{/if}
