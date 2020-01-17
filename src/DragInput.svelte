<script>
  import { createEventDispatcher } from "svelte";

  export let value = "";
  export let size = "";
  export let defaultValue = 0;

  const dispatch = createEventDispatcher();
  let input;
  let isMousedown = false;
  let isDragging = false;

  function handleMousedown(event) {
    isMousedown = true;
    window.addEventListener("mousemove", handleMousemove);
    window.addEventListener("mouseup", handleMouseup);
  }

  function handleMousemove(event) {
    if (isMousedown) {
      isDragging = true;
      event.preventDefault();
      event.stopPropagation();
      dispatchInputEvent((parseInt(value) || defaultValue) + event.movementX);
    }
  }

  function handleMouseup(event) {
    isMousedown = false;
    isDragging = false;
  }

  function dispatchInputEvent(value) {
    dispatch("input", { value });
  }
</script>

<style>
  .isDragging {
    cursor: ew-resize;
    user-select: none;
  }
</style>

<input
  readonly={isDragging}
  class:isDragging
  bind:this={input}
  {size}
  {value}
  on:change
  on:input={e => dispatchInputEvent(e.target.value)}
  on:mousedown={handleMousedown} />
