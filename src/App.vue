<template>
  <div id="app" >
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data:function(){
    return {
      //title:"学习vue+mongod+nodejs构建项目后台"
    }
  }
}
</script>
<style lang="scss">
  @import "./styles/element-variables";
  @import './styles/index.scss';
  @import "./styles/variables.scss";

</style>
