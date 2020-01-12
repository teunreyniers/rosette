<script>
  import { createEventDispatcher } from "svelte";

  Array.prototype.lastOr = function(e) {
    return this.length <= 0 ? e : this[this.length - 1];
  };

  const sumUntil = (array, index = Infinity) => {
    return array.slice(0, index).reduce((a, v) => a + v, 0);
  };

  export let sections;
  export let devitions = 4;
  export let angleoffset = -Math.PI / 2;
  export let colors = ["#ff8ba7", "#ffc6c7", "#c3f0ca", "#abd1c6"];
  export let spaces = [2, 1, 1, 1, 0.7, 0.3];
  export let style = "piece"; //piece | cirle
  export let fontSizes = {
    part: 0.07,
    section: 0.1
  };

  const scale_factor = 100;
  const dispatch = createEventDispatcher();

  const parts = sections.reduce((a, v) => [...a, ...v.parts], []);
  const section_angles = sections.reduce(
    (a, v) => [...a, a.lastOr(0) + v.parts.length],
    [0]
  );

  const count = parts.length;
  const totalspace = spaces.reduce((a, v) => a + v, 0);
  const textOffset = ((spaces[devitions] / sumUntil(spaces) - fontSizes.part) / 2) * scale_factor;

  let selectedCircle = -1;

  const getRadius = (devition, offset = 0) => {
    return (sumUntil(spaces, devition) / totalspace) * scale_factor + offset;
  };

  const getCoordinate = (devition, partnumber, offset = 0) => {
    const angle = (2 * Math.PI * partnumber) / count + angleoffset;
    const radius = getRadius(devition, offset);
    return `${radius * Math.cos(angle)} ${radius * Math.sin(angle)}`;
  };

  const getRadius2 = (devition, offset = 0) => {
    const radius = getRadius(devition, offset);
    return `${radius} ${radius}`;
  };

  

  function handleMousemove(event) {
    if (selectedCircle >= 0) {
      dispatch("cirlcemove", {
        circle: selectedCircle,
        width: event.offsetY
        //  Math.sqrt(event.clientX ^ 2, event.clientY ^ 2) / 100
      });
    }
  }
</script>

<style>
  svg {
    border: 1px solid red;
  }

  .circle:hover {
    stroke: red;
  }
</style>

<svg
  viewbox="-150 -150 300 300"
  on:mousemove|preventDefault={handleMousemove}
  on:mouseup={() => (selectedCircle = -1)}>
  {#each parts as part, i}
    {#if style === 'piece'}
      <path
        fill={colors[part.devitions - 1]}
        d="M{getCoordinate(part.devitions, i)} A{getRadius2(part.devitions)} 1 0
        1 {getCoordinate(part.devitions, i + 1)} L0 0 Z" />
    {:else}
      {#each [...Array(part).keys()].reverse() as devition}
        <path
          style="fill:{devition < part ? colors[devition] : 'white'};fill-opacity:{devition < part ? 1 : 0}"
          d="M{getCoordinate(devition + 1, i)} A{getRadius2(devition + 1)} 1 0 1
          {getCoordinate(devition + 1, i + 1)} L{getCoordinate(devition, i + 1)}
          A{getRadius2(devition)} 1 0 0 {getCoordinate(devition, i)} Z" />
      {/each}
    {/if}
    <path
      id="part-name-{i}"
      d="M{getCoordinate(devitions, i, textOffset)} A{getRadius2(devitions, textOffset)}
      1 0 1 {getCoordinate(devitions, i + 1, textOffset)}"
      fill="none" />
    <text font-size={fontSizes.part * scale_factor}>
      <textPath href="#part-name-{i}" startOffset="50%" text-anchor="middle">
        {part.name}
      </textPath>
    </text>
  {/each}

  {#each parts as part, i}
    <path
      d="M0 0 L{getCoordinate(devitions + 1, i)}"
      stroke="#999"
      stroke-width="0.5" />
  {/each}

  {#each [...Array(devitions + 1).keys()].reverse() as devition}
    <circle
      class="circle"
      cx="0"
      cy="0"
      r={getRadius(devition + 1)}
      stroke="#999"
      stroke-width="0.5"
      fill="none"
      on:mousedown={() => (selectedCircle = devition)} />
  {/each}

  {#each sections as section, i}
    <path
      d="M0 0 L{getCoordinate(devitions + 2, section_angles[i])}"
      stroke="#555"
      stroke-width="0.8" />
    <path
      id="section-name-{i}"
      d="M{getCoordinate(devitions + 1, section_angles[i], textOffset)} A{getRadius2(devitions + 1, textOffset)}
      1 0 1 {getCoordinate(devitions + 1, section_angles[i + 1], textOffset)}"
      fill="none" />
    <text font-size={fontSizes.section * scale_factor}>
      <textPath href="#section-name-{i}" startOffset="50%" text-anchor="middle">
        {section.name}
      </textPath>
    </text>
  {/each}
</svg>
