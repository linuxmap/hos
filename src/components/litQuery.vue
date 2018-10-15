<template>
  <div class="right">
    <el-input
      id="queryListInput"
      :placeholder="$t('common.queryInput')"
      icon="h-icon-search"
      clearable
      :on-icon-click="queryList"
      style="width:180px"
      v-model="queryForm.query">
    </el-input>
    <el-tooltip class="item" effect="dark" :content="$t('common.realRef')" placement="top" style="position:relative;top:-2px;margin-left:0;margin-right:-14px;">
      <el-button type="iconButton" icon="h-icon-flash" @click="" style="position:relative;top:-2px;" @click="reltimeRef"></el-button>
    </el-tooltip>
  </div>
</template>
<script>
  import util from 'index@/utils/util';

  export default {
    props: ['table','queryForm'],
    data () {
      return {

      }
    },
    mounted () {
      //绑定回车触发事件
      this.bodyListener = (e) => {
        if (e.keyCode === 13) {
          document.getElementById('queryListInput').getElementsByTagName('i')[0].click();
        }
      }
      document.body.addEventListener('keyup', this.bodyListener, false);
    },

    beforeDestroy () {
      document.body.removeEventListener('keyup', this.bodyListener);
    },
    methods: {
      /**
       * @Author: wangjing9
       * @Date: 2018-03-14
       * @Desc: 查询列表
       */
      queryList () {
        this.$parent.$refs[this.table].getData();
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-03-14
       * @Desc: 刷新列表
       */
      reltimeRef () {
        let table =  this.$parent.$refs[this.table],
          url = table.url + '/ref';

        util.reltimeRef(url, table);
      }
    }
  }
</script>
<style lang="less" scoped>
  .moreBtn{
    margin-right: 0;
    min-width:40px;
  }
  .cloudlist{
    clear:both;
    margin-bottom:0;
    padding-bottom: 5px;
    padding-top:3px;
  }
</style>
