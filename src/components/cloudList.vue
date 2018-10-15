<template>
  <div>

    <el-button v-if="noDlg" class="rel cloudSpan" @click="chooseCloud(cloud)" style="width:140px;padding-left:15px;margin-bottom:10px;margin-left:10px;" :title="cloud.name" :class="cloudId == cloud.id ? 'selected' : ''" v-for="(cloud, index) in cloud_id" :key="index"><i class="no">{{index+1}}</i><span class="eclipse" :title="cloud.name">{{cloud.name}}</span><i class="h-icon-circle_success"></i></el-button>

    <el-dialog v-if="!noDlg" title="选择云" :visible.sync="showCloud" :area="[650,400]" :before-close="beforeClose">
      <el-button class="rel cloudSpan" @click="chooseCloud(cloud)" style="width:140px;padding-left:15px;margin-bottom:10px;margin-left:10px;" :class="cloudId == cloud.id ? 'selected' : ''" :title="cloud.name" v-for="(cloud, index) in cloud_id" :key="index"><i class="no">{{index+1}}</i><span class="eclipse" :title="cloud.name">{{cloud.name}}</span><i class="h-icon-circle_success"></i></el-button>
    </el-dialog>
  </div>
</template>
<script>
  import util from 'index@/utils/util';
  import http1 from '../api/index';
  export default {
    props: ['showCloud','noDlg','cloudList','cloudId'],
    data () {
      return {
        util: util,
        height: 300
      }
    },
    computed:{
      show () {
          if (this.showCloud)
            util.showMask();
          return this.showCloud;
      },
      cloud_id () {
        return this.$store.state.cloudList;
      }
    },
    beforeDestroy () {

    },
    methods: {
      /**
       * @Author: wangjing9
       * @Date: 2018-02-25
       * @Desc: 选中弹出框中的云
       */
      chooseCloud (cloud) {
        this.closeBox();
        this.$emit('chooseCloud',cloud);
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-28
       * @Desc: 触发显示的tag值变化
       */
      closeBox () {
        this.$emit('exitCloudDlg');
        util.hideMask();
      },

      beforeClose () {
        this.closeBox();
      }
    }
  }
</script>
<style lang="less" scoped>
  .cloudSpan{
    overflow:visible;
  }
  .cloudSpan i.no{
    position: absolute;
    top: 0;
    left: 0;
    min-width: 22px;
    /* padding: 0 6px; */
    height: 22px;
    line-height: 22px;
    background: #39f;
    font-size: 10px;
    font-style: normal;
    border-radius: 0 0 50%;
    color: #fff;
  }
  i.h-icon-circle_success{
    display:none;
  }
  .cloudSpan.selected i.h-icon-circle_success{
    display:block;
    position: absolute;
    top: -5px;
    right: -5px;
    color:#00c770;
    background:#fff;
  }

</style>
