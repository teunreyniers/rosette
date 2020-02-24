<script>
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { createEventDispatcher } from "svelte";

  export let list;
  export let key;
  export let scope = "default";
  export let scopeindex = 0;

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;
      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform} scaleX(${t});
					opacity: ${t}
				`
      };
    }
  });

  let isOver = false;
  let draggable = false;
  let dragindex = -1;
  let dragscopeindex = -1;
  const getDraggedParent = (node, scope) => {
    if (
      node.dataset &&
      node.dataset.index &&
      (!scope || node.dataset.scope === scope)
    ) {
      return node.dataset;
    } else if (node.parentNode) {
      return getDraggedParent(node.parentNode, scope);
    } else {
      return false;
    }
  };

  const mouseup = e => {
    window.removeEventListener("mouseup", mouseup);
    isOver = false;
  };
  const handleMouseEnter = e => {
    window.addEventListener("mouseup", mouseup);
  };
  const start = ev => {
    ev.dataTransfer.setData("source", ev.target.dataset.index);
    ev.dataTransfer.setData("scopeindex", ev.target.dataset.scopeindex);
    ev.dataTransfer.setData("scope", ev.target.dataset.scope);
    dragindex = JSON.parse(ev.target.dataset.index);
    dragscopeindex = JSON.parse(ev.target.dataset.scopeindex);
  };
  const over = ev => {
    ev.preventDefault();
    const scope = ev.dataTransfer.getData("scope");
    const dragged = getDraggedParent(ev.target, scope);
    if (!dragged) isOver = false;
    else if (isOver !== dragged.id) isOver = JSON.parse(dragged.id);
  };
  const leave = ev => {
    const scope = ev.dataTransfer.getData("scope");
    const dragged = getDraggedParent(ev.target, false);
    if (dragged.scope === scope) {
      isOver = false;
    }
  };
  const drop = ev => {
    isOver = false;
    ev.preventDefault();
    const local_scope = ev.dataTransfer.getData("scope");
    const dragged = getDraggedParent(ev.target, local_scope);
    if (scope !== local_scope) return;
    const from = ev.dataTransfer.getData("source");
    const to = dragged.index;
    const fromscope = ev.dataTransfer.getData("scopeindex");
    const toscope = dragged.scopeindex;
    reorder({ from, to, fromscope, toscope });
  };

  const dispatch = createEventDispatcher();
  const reorder = ({ from, to, fromscope, toscope }) => {
    dispatch("sort", { from, to, fromscope, toscope });
  };

  const getKey = item => (key ? item[key] : item);
</script>

<style>
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }
  li {
    padding: 2px 0px 0px 0px;
    transition: border 0.1s linear;
    display: grid;
    grid-gap: 2px;
    grid-template-rows: auto 1fr auto;
  }
  .over-left {
    border-left: 2px solid #ccc;
    margin-left: 3px;
    padding-left: 3px;
  }
  .over-right {
    border-right: 2px solid #ccc;
    margin-right: 3px;
    padding-right: 3px;
  }
  .placeholder {
    height: 100%;
    width: 100%;
  }
  .over {
    border: 2px dotted #ccc;
  }
</style>

{#if list}
  <ul on:mousemove={handleMouseEnter}>
    {#if list.length}
      {#each list as item, index (getKey(item))}
        <li
          data-index={index}
          data-id={JSON.stringify(getKey(item))}
          data-scope={scope}
          data-scopeindex={scopeindex}
          {draggable}
          on:dragstart={start}
          on:dragover={over}
          on:dragleave={leave}
          on:drop={drop}
          in:receive={{ key: getKey(item) }}
          out:send={{ key: getKey(item) }}
          animate:flip={{ duration: 300 }}
          class:over-left={getKey(item) === isOver && (scopeindex < dragscopeindex || (scopeindex === dragscopeindex && index < dragindex))}
          class:over-right={getKey(item) === isOver && (scopeindex > dragscopeindex || (scopeindex === dragscopeindex && index > dragindex))}>
          <div
            on:mouseenter={() => (draggable = true)}
            on:mouseleave={() => (draggable = false)}>
            <slot name="dragger">...</slot>
          </div>
          <slot {item} {index}>
            <p>{getKey(item)}</p>
          </slot>
        </li>
      {/each}
    {:else}
      <li
        data-index={0}
        data-id={'placeholder'}
        data-scope={scope}
        data-scopeindex={scopeindex}
        on:dragstart={start}
        on:dragover={over}
        on:dragleave={leave}
        on:drop={drop}
        in:receive={{ key: 'placeholder' }}
        out:send={{ key: 'placeholder' }}
        class="placeholder"
        class:over={'placeholder' === isOver} />
    {/if}
  </ul>
{/if}
