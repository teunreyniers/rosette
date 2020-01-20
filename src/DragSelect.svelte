<script>
  import { createEventDispatcher } from "svelte";

  export let options;
  export let value;
  export let sensitivity = 0.03;

  const dispatch = createEventDispatcher();
  let isMousedown = false;
  let isDragging = false;
  let hasFocus = false;
  let ignore = false;
  let change = 0;
  let select;

  function limit(x) {
    return Math.max(0, Math.min(options.length - 1, x));
  }

  function handleMousedown(event) {
    if (!ignore&& !event.ctrlKey) {
      event.preventDefault();
      isMousedown = true;
      window.addEventListener("mouseup", handleMouseup);
    }
    window.addEventListener("mousemove", handleMousemove);
  }

  function handleMousemove(event) {
    if (isMousedown) {
      select.blur()
      isDragging = true;
      change += event.movementX * sensitivity;
      if (Math.abs(change) > 1) {
        const oldindex = options.findIndex(e => (e.value || e) === value);
        const index =
          oldindex + Math.sign(change) * Math.floor(Math.abs(change));
        dispatchChangeEvent(options[limit(index)].value);
        change %= 1;
      }
    }
    ignore = false;
  }

  function handleMouseup(event) {
    if (!isDragging && !ignore) {
      ignore = true;
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent("click", true, true, window);
      select.dispatchEvent(event);
    }
    isMousedown = false;
    isDragging = false;
    window.removeEventListener("mousemove", handleMousemove);
    window.removeEventListener("mouseup", handleMouseup);
  }

  function handleChange(event) {
    dispatchChangeEvent(event.target.value);
  }

  function dispatchChangeEvent(value) {
    dispatch("change", { value });
  }
</script>

<style>
  .isDragging {
    cursor: ew-resize;
    user-select: none;
  }

  .canDrag {
    cursor: ew-resize;
  }
</style>

<select
  bind:this={select}
  class:isDragging
  class:canDrag={!hasFocus}
  {value}
  on:change={handleChange}
  on:mousedown={handleMousedown}>
  {#each options as option}
    <option value={option.value || option}>{option.name || option}</option>
  {/each}
</select>
