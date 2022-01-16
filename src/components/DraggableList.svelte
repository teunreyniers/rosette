<script>
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { createEventDispatcher } from "svelte";
  // FLIP ANIMATION
  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;
      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform} scaleY(${t});
					opacity: ${t}
				`
      };
    }
  });
  // DRAG AND DROP
  let isOver = false;
  let draggable = false;
  let dragindex = -1;
  const getDraggedParent = node =>
    node.dataset && node.dataset.index
      ? node.dataset
      : getDraggedParent(node.parentNode);
  const start = ev => {
    if (!ev.target.dataset) return 
    ev.dataTransfer.setData("source", ev.target.dataset.index);
    dragindex = ev.target.dataset.index;
  };
  const over = ev => {
    ev.preventDefault();
    let dragged = getDraggedParent(ev.target);
    if (isOver !== dragged.id) isOver = JSON.parse(dragged.id);
  };
  const leave = ev => {
    let dragged = getDraggedParent(ev.target);
    if (isOver === dragged.id) isOver = false;
  };
  const drop = ev => {
    isOver = false;
    ev.preventDefault();
    let dragged = getDraggedParent(ev.target);
    let from = ev.dataTransfer.getData("source");
    let to = dragged.index;  
    reorder({ from, to });
  };
  // DISPATCH REORDER
  const dispatch = createEventDispatcher();
  const reorder = ({ from, to }) => {
    dispatch("sort", { from, to });
  };
  // UTILS
  const getKey = item => (key ? item[key] : item);
  // PROPS
  export let list;
  export let key;
</script>

<style>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    padding: 2px 0px;
    transition: border 0.1s linear;
    display: grid;
    grid-gap: 2px;
    grid-template-columns: 20px 1fr 20px;
  }
  span {
    border-radius: 2px;
    display: flex;
    justify-content: center;
    cursor: pointer;
  }
  span:hover {
    background: #ccc;
  }
  .delete {
    line-height: 30px;
  }
  .over-top {
    border-top: 2px solid #ccc;
    margin-top: 3px;
    padding-top: 5px;
  }
  .over-bottom {
    border-bottom: 2px solid #ccc;
    margin-bottom: 3px;
    padding-bottom: 5px;
  }
</style>

{#if list && list.length}
  <ul>
    {#each list as item, index (getKey(item))}
      <li
        data-index={index}
        data-id={JSON.stringify(getKey(item))}
        {draggable}
        on:dragstart={start}
        on:dragover={over}
        on:dragleave={leave}
        on:drop={drop}
        in:receive={{ key: getKey(item) }}
        out:send={{ key: getKey(item) }}
        animate:flip={{ duration: 300 }}
        class:over-top={getKey(item) === isOver && index < dragindex}
        class:over-bottom={getKey(item) === isOver && index > dragindex}>
        <span
          on:mouseenter={() => (draggable = true)}
          on:mouseleave={() => (draggable = false)}>
          ...
        </span>
        <slot {item} key={getKey(item)} {index}>
          <p>{getKey(item)}</p>
        </slot>
        <span class="delete" on:click={() => dispatch('delete', {index, item})}>X</span>
      </li>
    {/each}
  </ul>
{/if}
