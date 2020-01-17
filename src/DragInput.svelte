<script>
  import { createEventDispatcher } from "svelte";

  export let value = "";
  export let size = "";
  export let defaultValue = 0;
  export let step = 1;
  export let min = 0;
  export let max = Infinity;
  export let sensitivity = step;

  const dispatch = createEventDispatcher();
  let input;
  let isMousedown = false;
  let isDragging = false;

  let change = 0;

  function handleMousedown(event) {
    isMousedown = true;
    window.addEventListener("mousemove", handleMousemove);
    window.addEventListener("mouseup", handleMouseup);
  }

  function handleMousemove(event) {
    if (isMousedown) {
      isDragging = true;
      change += event.movementX * sensitivity;
      event.preventDefault();
      event.stopPropagation();           
      if (Math.abs(change) > step) {
        dispatchInputEvent(
          Math.max(
            min,
            Math.min(
              max,
              (parseFloat(value) || defaultValue) +
                Math.sign(change) * Math.floor(Math.abs(change) / step) * step
            )
          )
        );
        change %= step;
      }
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
