/**
 * 首页
 */
<template>
  <page-container :breadcrumb="i18nBreadcrumb" ref="pageContainer">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div class="overview">
            <div class="overview-left">
              <div class="overview-desc">集群概况</div>
            </div>
            <div class="overview-right">
              <div class="overview-item">
                <div class="item-icon"><svg-icon type="cluster"></svg-icon></div>
                <div class="item-name">组个数</div>
                <div class="item-value">1</div>
              </div>
              <div class="overview-item">
                <div class="item-icon"><svg-icon type="node"></svg-icon></div>
                <div class="item-name">节点总数</div>
                <div class="item-value">1</div>
              </div>
              <div class="overview-item">
                <div class="item-icon cg"><svg-icon type="node"></svg-icon></div>
                <div class="item-name">在线节点数</div>
                <div class="item-value">1</div>
              </div>
              <div class="overview-item">
                chart
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="navigation">
          <div class="navigation-title">
            <div class="title-content">全部应用</div>
          </div>
          <div class="navigation-panel">
            <div class="navigation-item">
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <div class='box'></div>
            </div>
            <div class="navigation-item">
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <div class='box'></div>
            </div>
            <div class="navigation-item">
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <div class='box'></div>
            </div>
            <div class="navigation-item">
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <div class='box'></div>
            </div>
            <div class="navigation-item">
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <div class='box'></div>
            </div>
            <div class="navigation-item">
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <a href="#"></a>
              <div class='box'></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </page-container>
</template>
<script>
  export default {
    name: 'main',
    props: {
      breadcrumbObj: {
        type: Object,
        default: {}
      }
    },
    created () {
      this.$nextTick(() => {
        this.$refs.pageContainer.$parent.$parent.isCollapse = true
      }) 
    }
  }
</script>
<style lang="less" scoped>
  .overview {
    position: relative;
    padding-left: 150px;
    .overview-left {
      position: absolute;
      left: 0;
      top: 0;
      width: 150px;
      height: 100%;
      .overview-desc {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 16px;
        color: #333;
        font-weight: 900;
        transform: translate(-50%, -50%);
        
      }
    }
    .overview-right {
      border-left: 1px dashed #aaa;
      width: 100%;
      .overview-item {
        display: inline-block;
        margin-right: 40px;
        text-align: center;
        &:first-child {
          margin-left: 40px;
        }
        .item-icon {
          font-size: 32px;
        }
        .item-name {
          font-weight: 100;
          line-height: 22px;
        }
        .item-value {
          font-weight: 900;
          font-size: 30px;
        }
      }
    }
  }

  .navigation {
    margin-top: 15px;
    .navigation-title {
      margin: 10px 10px 10px 0;
      .title-content {
        padding-left: 6px;
        font-weight: 400;
        border-left: 4px solid #aaa;
      }
    }
    .navigation-panel {
      perspective: 1000px;
      -webkit-perspective: 1000px;
    }

    .navigation-item {
      position: relative;
      float: left;
      margin: 6px;
      width: calc(150px - 12px);
      height: calc(150px - 12px);
    }
    .navigation-item a {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
    .navigation-item a:nth-child(1) {
      -webkit-clip-path: polygon(0 0, 100% 0, 50% 50%);
      clip-path: polygon(0 0, 100% 0, 50% 50%);
    }
    .navigation-item a:nth-child(2) {
      -webkit-clip-path: polygon(100% 0, 100% 100%, 50% 50%);
      clip-path: polygon(100% 0, 100% 100%, 50% 50%);
    }
    .navigation-item a:nth-child(3) {
      -webkit-clip-path: polygon(0 100%, 50% 50%, 100% 100%);
      clip-path: polygon(0 100%, 50% 50%, 100% 100%);
    }
    .navigation-item a:nth-child(4) {
      -webkit-clip-path: polygon(0 0, 50% 50%, 0 100%);
      clip-path: polygon(0 0, 50% 50%, 0 100%);
    }
    .navigation-item a:hover {
      z-index: 3;
      -webkit-clip-path: none;
      clip-path: none;
    }
    .navigation-item a:nth-child(1):hover ~ .box {
      transform: rotateX(180deg);
    }
    .navigation-item a:nth-child(2):hover ~ .box {
      transform: rotateY(180deg);
    }
    .navigation-item a:nth-child(3):hover ~ .box {
      transform: rotateX(-180deg);
    }
    .navigation-item a:nth-child(4):hover ~ .box {
      transform: rotateY(-180deg);
    }
    .navigation-item a:nth-child(1):hover ~ .box:after, .navigation-item a:nth-child(3):hover ~ .box:after {
      transform: rotateX(-180deg);
    }
    .navigation-item a:nth-child(2):hover ~ .box:after, .navigation-item a:nth-child(4):hover ~ .box:after {
      transform: rotateY(-180deg);
    }
    .navigation-item .box {
      position: absolute;
      width: 100%;
      height: 100%;
      font-family: "Open Sans", sans-serif;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      transform-style: preserve-3d;
      transition: transform .3s ease-in-out;
    }
    .navigation-item .box:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      font: normal normal normal 14px/1 FontAwesome;
      font-size: 40px;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      border-radius: 2px;
      z-index: 2;
      backface-visibility: hidden;
    }
    .navigation-item .box:after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #333;
      color: #FFF;
      font-size: 22px;
      border-radius: 2px;
      transition-delay: .15s;
    }
    .navigation-item:nth-child(1) .box:before {
      content: "\f09a";
      background: #79C1EE;
    }
    .navigation-item:nth-child(1) .box:after {
      content: "集群管理";
      background: #79C1EE;
    }
    .navigation-item:nth-child(2) .box:before {
      content: "\f099";
      background: #7ECDC8;
    }
    .navigation-item:nth-child(2) .box:after {
      content: "节点管理";
      background: #7ECDC8;
    }
    .navigation-item:nth-child(3) .box:before {
      content: "\f0d5";
      background: #79C1FE;
    }
    .navigation-item:nth-child(3) .box:after {
      content: "域名管理";
      background: #79C1FE;
    }
    .navigation-item:nth-child(4) .box:before {
      content: "\f0e1";
      background: #49C1FE;
    }
    .navigation-item:nth-child(4) .box:after {
      content: "用户管理";
      background: #49C1FE;
    }
    .navigation-item:nth-child(5) .box:before {
      content: "\f173";
      background: #16c9A9;
    }
    .navigation-item:nth-child(5) .box:after {
      content: "系统管理";
      background: #16c9A9;
    }
    .navigation-item:nth-child(6) .box:before {
      content: "\f13b";
      background: #5699A9;
    }
    .navigation-item:nth-child(6) .box:after {
      content: "日志管理";
      background: #5699A9;
    }
  }
  
  .cg {
    color: green;
  }
</style>