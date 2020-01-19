<script>
  export let items;
  export let xsize = 500;
  export let ysize = 500;

  $: rows = Math.ceil(Math.sqrt(items.length));
  $: columns = Math.floor(Math.sqrt(items.length));

  let isMousedown = false;
  let scroller;
  let scale = 1;

  function handleMousedown(event) {
    isMousedown = true;
    window.addEventListener("mouseup", handleMouseup);
    window.addEventListener("mousemove", handleMousemove);
  }

  function handleMousemove(event) {
    if (isMousedown) {
      scroller.scroll({
        top: scroller.scrollTop - event.movementY,
        left: scroller.scrollLeft - event.movementX
      });
    }
  }

  function handleMouseup(event) {
    isMousedown = false;
  }

  function handleScroll(event) {
    if (event.ctrlKey) {
      event.preventDefault();
      console.log(scale);

      scale = Math.max(0.1, scale * (1 - event.deltaY * 0.05));
    }
  }
</script>

<style>
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    user-select: none;
    cursor: grab;
  }
  .grid {
    display: grid;
    grid-gap: 15px;
    padding: 15px;
  }

  .item-container {
    transition: all 100ms ease;
  }

  .grabbing {
    cursor: grabbing;
  }
</style>

{#if items && items.length}
  <div
    class="container"
    on:mousedown={handleMousedown}
    on:wheel={handleScroll}
    bind:this={scroller}
    class:grabbing={isMousedown}>
    <div
      class="grid"
      style="grid-template-columns: auto repeat({columns - 1}, 1fr);
      grid-template-rows: repeat({rows}, 1fr);">
      {#each items as item, index (item.key)}
        <div
          class="item-container"
          style="height: {ysize * scale}px; width: {xsize * scale}px">
          <slot {item} {index} />
        </div>
      {/each}
    </div>
  </div>
{/if}
