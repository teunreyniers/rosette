<script>
  import { createEventDispatcher } from "svelte";

  export let value = "";
  export let size = "";
  export let defaultValue = value;
  export let step = 1;
  export let bigstep = 10 * step;
  export let smallstep = step / 10;
  export let min = 0;
  export let max = Infinity;
  export let sensitivity = step;
  export let finest = 1000;

  const dispatch = createEventDispatcher();
  let input;
  let isMousedown = false;
  let isDragging = false;
  let hasFocus = false;
  let change = 0;

  function handleMousedown(event) {
    isMousedown = true;
    window.addEventListener("mousemove", handleMousemove);
    window.addEventListener("mouseup", handleMouseup);
  }

  function round(x, decimal) {
    return Math.round(x * decimal) / decimal;
  }

  function limit(min, max, x) {
    return Math.min(max, Math.max(min, x));
  }

  function takestep(x, size) {
    return Math.sign(x) * Math.floor(Math.abs(x) / size) * size;
  }

  function handleChange(event) {
    dispatchChangeEvent(parseFloat(event.target.value), finest);
  }

  function handleMousemove(event) {
    if (isMousedown && (!hasFocus || event.shiftKey || event.ctrlKey)) {
      isDragging = true;
      event.preventDefault();
      event.stopPropagation();
      let size = step;
      let decimal = finest;
      if (event.shiftKey && event.ctrlKey) {
        size = bigstep;
      } else if (event.shiftKey) {
        size = smallstep;
      } else if (event.ctrlKey) {
        size = 1;
        decimal = 1;
      }
      change += (event.movementX * sensitivity * size) / step;
      if (Math.abs(change) > size) {
        dispatchChangeEvent(
          (parseFloat(value) || defaultValue) + takestep(change, size),
          decimal
        );
        change %= step;
      }
    }
  }

  function handleMouseup(event) {
    if (!event.ctrlKey && !event.shiftKey) {
      hasFocus = true;
    }
    if (isDragging) {
      input.blur();
      hasFocus = false;
    }
    if (event.ctrlKey && !isDragging) {
      dispatchChangeEvent(defaultValue, finest);
      input.blur();
      hasFocus = false;
    }
    isMousedown = false;
    isDragging = false;
    window.removeEventListener("mouseup", handleMouseup);
    window.removeEventListener("mousemove", handleMousemove);
  }

  function handleFocusout(event) {
    hasFocus = false;
  }

  function handleKeydown(event) {
    if(event.key === 'Enter'){
      input.blur()
    }
  }

  function dispatchChangeEvent(value, decimal) {
    value = limit(min, max, round(value, decimal));
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

<input
  readonly={isDragging}
  class:isDragging
  class:canDrag={!hasFocus}
  bind:this={input}
  {size}
  {value}
  on:change={handleChange}
  on:input
  on:mousedown={handleMousedown}
  on:focusout={handleFocusout} 
  on:keydown={handleKeydown}/>
