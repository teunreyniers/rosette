<script>
  import { createEventDispatcher } from "svelte";
  import { HsvPicker } from "svelte-color-picker";

  export let color;
  export let key;

  const dispatch = createEventDispatcher();
  let colorPickerOpen = false;

  let colorPickerTop;
  let colorPickerLeft;
  let colorPickerWidth;
  let colorPickerHeight;

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function openColorPicker(e) {
    colorPickerOpen = true;
    window.addEventListener("mouseup", handleMouseClick);
  }

  function handleMouseClick(e) {
    if (
      e.clientX < colorPickerLeft ||
      e.clientX > colorPickerLeft + 240 ||
      e.clientY < colorPickerTop ||
      e.clientY > colorPickerTop + 340
    ) {
      colorPickerOpen = false;
    }
  }
</script>

<style>
  .container {
    display: grid;
    grid-gap: 7px;
    height: 35px;
    grid-template-columns: 35px 1fr;
  }

  .preview {
    width: 35px;
    border: 1px solid #ccc;
    border-radius: 2px;
    display: block;
    cursor: pointer;
  }

  input {
    margin: 0px;
    min-width: 60px;
  }

  .z {
    z-index: 1000;
  }
</style>

<div class="container">
  <div
    class="preview"
    style="background-color: {color}"
    on:click={openColorPicker} />
  <input
    bind:value={color}
    on:input={() => dispatch('change', { value: color, key })} />
  {#if colorPickerOpen}
    <div
      class="z"
      bind:offsetWidth={colorPickerLeft}
      bind:offsetHeight={colorPickerTop}>
      <HsvPicker
        on:colorChange={e => dispatch('change', {
            key,
            value: rgbToHex(e.detail.r, e.detail.g, e.detail.b)
          })}
        startColor={color} />
    </div>
  {/if}
</div>
