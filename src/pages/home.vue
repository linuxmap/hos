<template>
  <div class="main-panel" :style="style">
    <v-header></v-header>
    <page :menu="menu">
      <transition name="page-transition">
        <router-view v-if="isRouterAlive"></router-view>
      </transition>
    </page>
  </div>

</template>
<script>
  import navList from '@/nav.config1.json'
  import { mapState } from 'vuex'
  import vHeader from 'index@/components/header.vue'

  // 模拟登录
  import http from 'index@/api/index'
  import token from 'index@/libs/token'
  import { JSEncrypt } from 'jsencrypt'
  export default {
    name: 'home',
    components: {vHeader},
    data () {
      return {
        menu: [],
        encrypt: null,
        isRouterAlive: true
      }
    },
    provide () {
      return {
        reload: this.reload
      }
    },
    computed: {
      ...mapState(['reloadAnyway', 'headerHeight']),
      style () {
        const style = {}
        style.paddingTop = `${this.headerHeight}px`
        return style
      }
    },
    created () {
      // 开发模式菜单全展示
      if (process.env.NODE_ENV !== 'development') {
        // 如果需要去除侧边栏的特殊判断，都可以写在这里
        if (window.location.href.includes('error')) {
          this.menu = []
        } else {
          // 运行态根据menuCode和isApp判断是否展示，需要在nav和router.config.json里面做配置
          this.menu = navList.filter(nav => nav.isApp && this.$store.state.userInfo.code.indexOf('template_' + nav.menuCode) > -1)
        }
      } else {
        navList.forEach(element => {
          element.title = this.$t(element.title)
          if (element.children && element.children.length) {
            element.children.forEach(child => {
              child.title = this.$t(child.title)
            })
          }
        })
        this.menu = navList
      }

      // 模拟登录
      this.encrypt = new JSEncrypt()
      const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKZKgabcPik14D8DSWVMMNjo+08NQNxRTjH6bBlD8CaAviLdN+EVcBR4wCpSQrzd1gngafZGVzBFWKitxh5fZcAHq3BJjhtVvpsuRgxLNmgWk8Mt1nzxSkGqe5hiWZ5i2p9dN/iq6kZi0cPlkIv55D4AjD6g82durpL4qKKCVm6wIDAQAB'
      this.encrypt.setPublicKey(publicKey)
      const params = {
        userName: 'admin',
        password: this.encrypt.encrypt('whhik_88075998')
      }

      http.getRequest('/platform/login', 'post', params).then(res => {
        if (res.status) {
          token.set(res.data)
        } else {
          token.set('dHZOd3R5eEx3TGNpaFg2SkF6ZzlpZC9hK2toOG1YekFYbi84RmRLa2poUU5Wai8vbkVHQ0dMWjQ2cUFzSUcyajVJNlFCTTc5UkE1ODVaVlJNZGlOQWNJYzVpUThpVHg1SGZGWkdWYk9SYW9udTBSWE5HWklDdTZac2lvVXh0ZHZ2eGZFbE9rVzRHdGFNMVpseG1iNUZHT3gveWNlRkhLUnhNWnRnUHg1TXRNdlBwQ2xGWnNJWm83VFBNRUtnQWJDazRTQjBqczZNeWdUVHM3d1hsdERuUmQ5Y004NGtKYzV2UHJsL2ZRMHhrL1BhYmZISVFmOFhRPT0')
        }
      })
    },
    mounted () {
      let that = this;
      that.$store.dispatch('setHeight', document.body.clientHeight - 45);

      window.onresize = function(){
        that.$store.dispatch('setHeight', document.body.clientHeight - 45);
        that.$store.dispatch('setResize', !that.$store.state.resize);
      };
    },
    methods: {
      reload () {
        if (!this.reloadAnyway) {
          return
        }
        this.isRouterAlive = false
        this.$nextTick(() => {
          setTimeout(() => {
            this.isRouterAlive = true
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .main-panel {
    position: relative;
    width: 100%;
    height: 100%;
    /deep/ .page-menu {
      position: absolute;
    }
  }
</style>
