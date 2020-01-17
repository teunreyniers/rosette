<script>
  import About from "./About.svelte";
  import Privacy from "./Privacy.svelte";
  import InfoPopup from "./InfoPopup.svelte";

  let showAbout = false;
  let showPrivacy = false;
</script>

<style>
  nav {
    background:  seagreen;
    display: grid;
    grid-template-columns: 1fr auto auto;
    vertical-align: middle;
    grid-area: nav;
    background-image: url("../pictures/star.svg");
    background-origin: border-box;
    background-size: 250px;
    background-repeat: no-repeat;
    background-position: -130px -70px;
    background-blend-mode: darken;
  }

  ul li {
    margin: auto 10px;
    list-style-type: none;
    display: inline-block;
    cursor: pointer;
    color: white;
  }

  ul li:hover {
    text-decoration: underline;
  }

  .logo {
    text-decoration: none;
    font-size: 2em;
    padding: 5px 10px;
    text-transform: uppercase;
    color: white;
  }
</style>

<nav>
  <div href="/" class="logo">rosette</div>
  <ul>
    <li on:click={() => (showAbout = true)}>about</li>
    <li on:click={() => (showPrivacy = true)}>privacy</li>
  </ul>

</nav>

<InfoPopup
  isOpen={showAbout}
  on:close={() => (showAbout = false)}
  background="sandybrown"
  sidepanel="salmon"
  close="indianred">
  <About />
</InfoPopup>

<InfoPopup
  isOpen={showPrivacy}
  on:close={() => (showPrivacy = false)}
  background="rgb(86, 117, 232)"
  sidepanel="rgb(19, 19, 115)"
  close="rgb(57, 202, 202)">
  <Privacy />
</InfoPopup>
