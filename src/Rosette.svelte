<script>
  import { createEventDispatcher } from "svelte";

  Array.prototype.lastOr = function(e) {
    return this.length <= 0 ? e : this[this.length - 1];
  };

  export let sections;
  export let devitions = 4;

  export let colors = ["#ff8ba7", "#ffc6c7", "#c3f0ca", "#abd1c6"];
  export let grades;
  export let spaces = [2, 1, 1, 1, 0.7, 0.3];
  export let style = "piece"; //piece | cirle
  export let lines;
  export let fontSizes = {
    part: 0.07,
    section: 0.1
  };
  export let key;
  export let labels;
  export let textoptions;
  export let layout;

  const scale_factor = 100;
  const dispatch = createEventDispatcher();

  $: angleoffset = -Math.PI / 2 + (layout.angleoffset / 180) * Math.PI;

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

  $: raduises = [...Array(spaces.length + 2).keys()].map(
    d => (sumUntil(spaces, d) / totalspace) * scale_factor
  );

  function getCoordinate(radius, partnumber, angleoffset) {
    const angle = (2 * Math.PI * partnumber) / count + angleoffset;
    return `${radius * Math.cos(angle)} ${radius * Math.sin(angle)}`;
  }

  function getMovingCircleCoordinate(
    radius,
    partnumber,
    space,
    offset,
    angleoffset
  ) {
    const angle =
      (2 * Math.PI * (partnumber + (space * offset) / 100)) / count +
      angleoffset;
    return `${radius * Math.cos(angle)} ${radius * Math.sin(angle)}`;
  }

  function getLineCoordinate(
    radius,
    startpartnumber,
    endpartnumber,
    offset,
    point,
    angleoffset
  ) {
    const angle =
      (2 *
        Math.PI *
        (startpartnumber +
          ((endpartnumber - startpartnumber) * (offset + 50)) / 100)) /
        count +
      angleoffset;
    const xm = radius * Math.cos(angle);
    const ym = radius * Math.sin(angle);
    const z = 200;
    if (point === 0) {
      return `${xm + z * Math.sin(angle)} ${ym - z * Math.cos(angle)}`;
    } else {
      return `${xm - z * Math.sin(angle)} ${ym + z * Math.cos(angle)}`;
    }
  }

  function getRotationPoint(
    radius,
    startpartnumber,
    endpartnumber,
    offset,
    angleoffset
  ) {
    const angle =
      (2 *
        Math.PI *
        (startpartnumber +
          ((endpartnumber - startpartnumber) * offset) / 100)) /
        count +
      angleoffset;
    return `${radius * Math.cos(angle)} ${radius * Math.sin(angle)}`;
  }
  function getOffset(
    radius,
    startpartnumber,
    endpartnumber,
    offset,
    angleoffset
  ) {
    const angle =
      (2 *
        Math.PI *
        (startpartnumber +
          ((endpartnumber - startpartnumber) * offset) / 100)) /
        count +
      angleoffset;
    return radius * angle;
  }

  function x2(what) {
    return `${what} ${what}`;
  }

  function scale(width, dasharray, cap) {
    if (dasharray === "none") return "none";
    return dasharray
      .split(" ")
      .map(
        (e, i) =>
          (cap === "butt"
            ? parseInt(e)
            : i % 2
            ? parseInt(e) + 1
            : parseInt(e) - 1) * width
      )
      .join(" ");
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

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewbox="-{layout.center_x} -{layout.center_y}
  {layout.size_x}
  {layout.size_y}">
  {#each parts as part, i (part.key)}
    <!-- Colors -->
    {#if style === 'piece'}
      <path
        fill={colors[(part.devitions - 1) % colors.length]}
        stroke={colors[(part.devitions - 1) % colors.length]}
        stroke-width={0.2}
        d="M{getCoordinate(raduises[part.devitions], i, angleoffset)} A{x2(raduises[part.devitions])}
        1 0 1 {getCoordinate(raduises[part.devitions], i + 1, angleoffset)} L0 0
        Z" />
    {:else}
      {#each [...Array(part).keys()].reverse() as devition}
        <path
          style="fill:{devition < part ? colors[devition % colors.length] : 'white'};fill-opacity:{devition < part ? 1 : 0}"
          d="M{getCoordinate(raduises[devition + 1], i, angleoffset)} A{x2(raduises[devition + 1])}
          1 0 1 {getCoordinate(raduises[devition + 1], i + 1, angleoffset)} L{getCoordinate(raduises[devition], i + 1, angleoffset)}
          A{x2(raduises[devition])} 1 0 0 {getCoordinate(raduises[devition], i, angleoffset)}
          Z" />
      {/each}
    {/if}
    <!-- Part Text -->
    {#if textoptions.parts.curve === 'none'}
      <path
        id="part-name-{key}-{i}"
        d="M{getLineCoordinate(raduises[devitions] + textOffset + textoptions.parts.ypos, i, i + 1, textoptions.parts.xpos, 0, angleoffset)}
        L{getLineCoordinate(raduises[devitions] + textOffset + textoptions.parts.ypos, i, i + 1, textoptions.parts.xpos, 1, angleoffset)}"
        fill="none" />
    {:else}
      <path
        id="part-name-{key}-{i}"
        d="M{getMovingCircleCoordinate(raduises[devitions] + textOffset + textoptions.parts.ypos, i, 1, textoptions.parts.xpos, angleoffset)}
        A{x2(raduises[devitions] + textOffset + textoptions.parts.ypos)} 0 {1 > 0.5 * count ? 1 : 0}
        1 {getMovingCircleCoordinate(raduises[devitions] + textOffset + textoptions.parts.ypos, i + 1, i + 1 - i, textoptions.parts.xpos, angleoffset)}"
        fill="none" />
    {/if}
    <!-- part Text -->
    <text
      fill={textoptions.parts.color}
      font-size={textoptions.parts.size}
      font-weight={textoptions.parts.weight}
      transform="rotate({textoptions.parts.angle}
      {getRotationPoint(raduises[devitions] + textOffset + textoptions.parts.ypos, i, i + 1, textoptions.parts.xpos + 50, angleoffset)})">
      <textPath
        href="#part-name-{key}-{i}"
        startOffset="50%"
        text-anchor={textoptions.parts.anchor}>
        {part.name}
      </textPath>
    </text>
  {/each}

  <!-- Circles -->
  {#each [...Array(devitions + 1).keys()].reverse() as devition}
    <circle
      class="circle"
      cx="0"
      cy="0"
      r={raduises[devition + 1]}
      stroke={lines.grades.color}
      stroke-width={lines.grades.width}
      stroke-dasharray={scale(lines.grades.width, lines.grades.style, lines.grades.cap)}
      stroke-linecap={lines.grades.cap}
      fill="none" />
  {/each}

  <!-- Part Lines -->
  {#each parts as part, i (part.key)}
    <path
      d="M0 0 L{getCoordinate(raduises[devitions + 1], i, angleoffset, angleoffset)}"
      stroke={lines.parts.color}
      stroke-width={lines.parts.width}
      stroke-dasharray={scale(lines.parts.width, lines.parts.style, lines.parts.cap)}
      stroke-linecap={lines.parts.cap} />
  {/each}

  {#each sections as section, i}
    <!-- Section Lines -->
    <path
      d="M0 0 L{getCoordinate(raduises[devitions + 2], section_angles[i], angleoffset, angleoffset)}"
      stroke={lines.sections.color}
      stroke-width={lines.sections.width}
      stroke-dasharray={scale(lines.sections.width, lines.sections.style, lines.sections.cap)}
      stroke-linecap={lines.sections.cap} />

    <!-- Section text path -->
    <!-- Section Text -->
    {#if textoptions.sections.curve === 'none'}
      <path
        id="section-name-{key}-{i}"
        d="M{getLineCoordinate(raduises[devitions + 1] + textOffset + textoptions.sections.ypos, section_angles[i], section_angles[i + 1], textoptions.sections.xpos, 0, angleoffset)}
        L{getLineCoordinate(raduises[devitions + 1] + textOffset + textoptions.sections.ypos, section_angles[i], section_angles[i + 1], textoptions.sections.xpos, 1, angleoffset)}"
        fill="none" />
    {:else}
      <path
        id="section-name-{key}-{i}"
        d="M{getMovingCircleCoordinate(raduises[devitions + 1] + textOffset + textoptions.sections.ypos, section_angles[i], section_angles[i + 1] - section_angles[i], textoptions.sections.xpos, angleoffset)}
        A{x2(raduises[devitions + 1] + textOffset + textoptions.sections.ypos)}
        0 {section_angles[i + 1] - section_angles[i] > 0.5 * count ? 1 : 0} 1 {getMovingCircleCoordinate(raduises[devitions + 1] + textOffset + textoptions.sections.ypos, section_angles[i + 1], section_angles[i + 1] - section_angles[i], textoptions.sections.xpos, angleoffset)}"
        fill="none" />
    {/if}
    <!-- Section Text -->
    <text
      fill={textoptions.sections.color}
      font-size={textoptions.sections.size}
      font-weight={textoptions.sections.weight}
      transform="rotate({textoptions.sections.angle}
      {getRotationPoint(raduises[devitions + 1] + textOffset + textoptions.sections.ypos, section_angles[i], section_angles[i + 1], textoptions.sections.xpos + 50, angleoffset)})">
      <textPath
        href="#section-name-{key}-{i}"
        startOffset="50%"
        text-anchor={textoptions.sections.anchor}>
        {section.name}
      </textPath>
    </text>
  {/each}

  <!-- grades -->
  {#each grades as grade, i}
    <text
      x={textoptions.grades.xpos}
      y={-raduises[i] - ((raduises[i + 1] - raduises[i]) * textoptions.grades.ypos) / 100}
      font-size={textoptions.grades.size}
      font-weight={textoptions.grades.weight}
      transform="rotate({textoptions.grades.angle}
      {textoptions.grades.xpos}
      {-raduises[i] - ((raduises[i + 1] - raduises[i]) * textoptions.grades.ypos) / 100})"
      text-anchor={textoptions.grades.anchor}
      fill={textoptions.grades.color}>
      {grades[i]}
    </text>
  {/each}

  <!-- labels -->
  {#each labels as label, index}
    <text
      x={label.xpos}
      y={label.ypos}
      font-size={label.size}
      font-weight={label.weight}
      transform="rotate({label.angle}
      {label.xpos}
      {label.ypos})"
      text-anchor={label.anchor}
      fill={label.color}>
      {label.value}
    </text>
  {/each}

  <text />
</svg>
