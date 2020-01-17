<script>
  import { createEventDispatcher } from "svelte";

  Array.prototype.lastOr = function(e) {
    return this.length <= 0 ? e : this[this.length - 1];
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
  export let key;
  export let labels;

  const scale_factor = 100;
  const dispatch = createEventDispatcher();

  $: parts = sections.reduce((a, v) => [...a, ...v.parts], []);

  $: section_angles = sections.reduce(
    (a, v) => [...a, a.lastOr(0) + v.parts.length],
    [0]
  );

  $: count = parts.length;
  $: totalspace = spaces.reduce((a, v) => a + v, 0);
  $: textOffset =
    ((spaces[devitions] / sumUntil(spaces) - fontSizes.part) / 2) *
    scale_factor;

  $: raduises = [...Array(spaces.length).keys()].map(
    d => (sumUntil(spaces, d) / totalspace) * scale_factor
  );

  function getCoordinate(devition, partnumber, offset = 0) {
    const angle = (2 * Math.PI * partnumber) / count + angleoffset;
    const radius = raduises[devition] + offset;
    return `${radius * Math.cos(angle)} ${radius * Math.sin(angle)}`;
  }

  function x2(what) {
    return `${what} ${what}`;
  }

  function sumUntil(array, index = Infinity) {
    return array.slice(0, index).reduce((a, v) => a + v, 0);
  }
</script>

<style>
  svg {
    border: 1px solid #ccc;
  }
</style>

<svg viewbox="-150 -150 300 300">
  {#each parts as part, i (part.key)}
    <!-- Colors -->
    {#if style === 'piece'}
      <path
        fill={colors[(part.devitions - 1) % colors.length]}
        d="M{getCoordinate(part.devitions, i)} A{x2(raduises[part.devitions])} 1
        0 1 {getCoordinate(part.devitions, i + 1)} L0 0 Z" />
    {:else}
      {#each [...Array(part).keys()].reverse() as devition}
        <path
          style="fill:{devition < part ? colors[devition % colors.length] : 'white'};fill-opacity:{devition < part ? 1 : 0}"
          d="M{getCoordinate(devition + 1, i)} A{x2(raduises[devition + 1])} 1 0
          1 {getCoordinate(devition + 1, i + 1)} L{getCoordinate(devition, i + 1)}
          A{x2(raduises[devition])} 1 0 0 {getCoordinate(devition, i)} Z" />
      {/each}
    {/if}
    <!-- Part Text -->
    <path
      id="part-name-{key}-{i}"
      d="M{getCoordinate(devitions, i, textOffset)} A{x2(raduises[devitions] + textOffset)}
      0 0 1 {getCoordinate(devitions, i + 1, textOffset)}"
      fill="none" />
    <text font-size={fontSizes.part * scale_factor}>
      <textPath
        href="#part-name-{key}-{i}"
        startOffset="50%"
        text-anchor="middle">
        {part.name}
      </textPath>
    </text>
    <!-- Part Lines -->
    <path
      d="M0 0 L{getCoordinate(devitions + 1, i)}"
      stroke="#999"
      stroke-width="0.5" />
  {/each}

  <!-- Circles -->
  {#each [...Array(devitions + 1).keys()].reverse() as devition}
    <circle
      class="circle"
      cx="0"
      cy="0"
      r={raduises[devition + 1]}
      stroke="#999"
      stroke-width="0.5"
      fill="none" />
  {/each}

  {#each sections as section, i}
    <!-- Section Lines -->
    <path
      d="M0 0 L{getCoordinate(devitions + 2, section_angles[i])}"
      stroke="#555"
      stroke-width="0.8" />

    <!-- Section Text -->
    <path
      id="section-name-{key}-{i}"
      d="M{getCoordinate(devitions + 1, section_angles[i], textOffset)} A{x2(raduises[devitions + 1] + textOffset)}
      0 {section_angles[i + 1] - section_angles[i] > 0.5 * count ? 1 : 0} 1 {getCoordinate(devitions + 1, section_angles[i + 1], textOffset)}"
      fill="none" />

    <text font-size={fontSizes.section * scale_factor}>
      <textPath
        href="#section-name-{key}-{i}"
        startOffset="50%"
        text-anchor="middle">
        {section.name}
      </textPath>
    </text>
  {/each}
  <!-- labels -->
  {#each labels as label, index}
    <text
      x={label.xpos}
      y={label.ypos}
      font-size={label.size}
      font-weight={label.weight}
      rotate={label.angle}
      text-anchor={label.anchor}>
      {label.value}
    </text>
  {/each}
  <text />
</svg>
