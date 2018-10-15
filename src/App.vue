<template>
  <div class="fill">
    <transition :name="transition">
      <router-view></router-view>
    </transition>
    <color-tool></color-tool>
  </div>
</template>

<script>
import ColorTool from '@/components/ColorTool'

export default {
  name: 'app',
  components: {ColorTool},
  data () {
    return {
      menu: [],
      encrypt: null,
      transition: ''
    }
  },
  created () {
  }
}
</script>
<style lang="less">
  @import './styles/main.less';
</style>
