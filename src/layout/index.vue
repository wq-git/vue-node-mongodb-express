<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>

    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <div class="fixed-header">
        <Navbar/>
      </div>
      <AppMain/>
    </div>

  </div>
</template>

<script>

  import {Sidebar, AppMain, Navbar} from "./components";
  import {mapState} from 'vuex'

  export default {
    name: "Layout",
    components: {
      Navbar,
      Sidebar,
      AppMain
    },

    computed: {
      ...mapState({
        sidebar: state => state.app.sidebar,
        device: state => state.app.device,

      }),
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
      }
    }

  }
</script>

<style lang="scss" scoped>
  @import "../styles/mixin.scss";
  @import "../styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

</style>
