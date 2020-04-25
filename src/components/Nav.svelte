<script>
  import InfoPopup from "./InfoPopup.svelte";
  import { _, locale, locales } from "svelte-i18n";

  let showAbout = false;
  let showPrivacy = false;
</script>

<style>
  nav {
    background: seagreen;
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

  nav ul li a{
    color: white
  }

  nav ul li {
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

  .logo span {
    font-size: 0.5em;
    text-transform: lowercase;
  }

  select {
    background: transparent;
    color: white;
    border: none;
    margin: 0px;
    padding: 0px;
    cursor: pointer;
  }

  li:hover select {
    text-decoration: underline;
  }
</style>

<nav>
  <div href="/" class="logo">
    rosette
    <span>beta</span>
  </div>
  <ul>
    <li on:click={() => (showAbout = true)}>{$_('about')}</li>
    <li on:click={() => (showPrivacy = true)}>{$_('privacy')}</li>
    <li><a href="https://github.com/teunreyniers/rosette" target="_blank">Github</a></li>
    <li>
      <select bind:value={$locale}>
        {#each $locales as locale}
          <option value={locale}>{locale}</option>
        {/each}
      </select>
    </li>
  </ul>
</nav>

<InfoPopup
  isOpen={showAbout}
  on:close={() => (showAbout = false)}
  background="sandybrown"
  sidepanel="salmon"
  close="indianred"
  header={$_('about')}>
  {@html $_('about_msg')}
</InfoPopup>

<InfoPopup
  isOpen={showPrivacy}
  on:close={() => (showPrivacy = false)}
  background="rgb(86, 117, 232)"
  sidepanel="rgb(19, 19, 115)"
  close="rgb(57, 202, 202)"
  header={$_('privacy')}>
  {@html $_('privacy_msg')}
</InfoPopup>
