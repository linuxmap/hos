<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 左侧树 -->
    <sidebar v-if="showSideBar" slot="pageSidebar" :treeData="treeData" @selectTreeNode="getChartData"></sidebar>
      <div class="basicMes census">
        <h3>概览</h3>
        <ul>
          <li>
            <span><s>{{formatter(overview.total_cap)}}</s> GB</span>
            用户总容量
          </li>
          <li>
            <span><s>{{formatter(overview.used_cap)}}</s> Byte</span>
            已使用容量
          </li>
          <li>
            <span><s>{{formatter(overview.total_upload_cap)}}</s> Byte</span>
            总上传流量
          </li>
          <li>
            <span><s>{{formatter(overview.total_download_cap)}}</s> Byte</span>
            总下载流量
          </li>
          <li>
            <span><s>{{formatter(overview.read_req_count)}}</s></span>
            总写请求数
          </li>
          <li class="last">
            <span><s>{{formatter(overview.write_req_count)}}</s></span>
            总读请求数
          </li>
        </ul>
      </div>
      <div class="basicMes census sec">
        <h3 class="rel">
          统计明细
          <el-tag v-if="select" type="success">{{select}}</el-tag>
          <el-form>
            <el-form-item class="datePicker" style="clear:both" prop="create_time">
              <el-date-picker
                v-model="timeVal"
                type="daterange"
                @change="getDate"
                placeholder="选择日期范围"
                :editable="false"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <i class="h-icon-flash refresh" @click="getStatsInfo"></i>
          </el-tooltip>
        </h3>
        <el-tabs v-model="activeName" type="border-card" class="tabs" @tab-click="getStatsInfo">
          <el-tab-pane label="存储容量" name="statsStorageCapacity">
            <div id="statsStorageCapacity"  :style="styleObj"></div>
          </el-tab-pane>
          <el-tab-pane label="上传流量" name="statsUploadFlow">
            <div id="statsUploadFlow"  :style="styleObj"></div>
          </el-tab-pane>
          <el-tab-pane label="下载流量" name="statsDownloadFlow">
            <div id="statsDownloadFlow"  :style="styleObj"></div>
          </el-tab-pane>
          <el-tab-pane label="写入请求" name="statsWriteRequest">
            <div id="statsWriteRequest"  :style="styleObj"></div>
          </el-tab-pane>
          <el-tab-pane label="读取请求" name="statsReadRequest">
            <div id="statsReadRequest"  :style="styleObj"></div>
          </el-tab-pane>
          <el-tab-pane label="删除请求" name="statsDeleteRequest">
            <div id="statsDeleteRequest"  :style="styleObj"></div>
          </el-tab-pane>
          <el-tab-pane label="删除容量" name="statsDeleteCapacity">
            <div id="statsDeleteCapacity"  :style="styleObj"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
  </page-container>
</template>

<script>
  import sidebar from 'index@/components/sidebar'
  import http from 'index@/api/index'
  import util from 'index@/utils/util'
  import echartsUtil from  'index@/utils/echartsUtil'

  export default {
    name: 'sidebarTree',
    components: { sidebar },
    props: {
      breadcrumbObj: {
        type: Object,
        debufult: {}
      }
    },
    data () {
      return {
        util: util,
        vm:vm,
        showSideBar: false,
        treeData:[{
          id: 1,
          label: '全部Bucket',
          children:[]
        }],
        count: 2,
        timeVal:[new Date().getTime() - 3600 * 1000 * 24 * 6, new Date()],
        select:'近7天',
        pickerOptions2: {
          shortcuts: [{
            text: '近7天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              let day = util.format(new Date(),'yyyy-MM-dd').split('-')[2] - 1;
              start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '今天',
              onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        activeName:'statsStorageCapacity',
        overview: {},
        bucket_name: '',
        myChart: null
      }
    },
    watch: {
      '$store.state.resize': 'resizeCharts'
    },
    created () {
      let that = this;

      http.getRequest('/test/hos/user/bucket.json', 'get')
        .then(res => {
          if (res.status) {
            let list = res.data.list;
            list.forEach(function(v,i){
              that.treeData[0].children.push({
                id: that.count + i,
                label: v.bucket_name
              });
            });
            this.$nextTick(function(){
              this.showSideBar = true;
            });
          }
        });
    },

    computed: {
      styleObj () {
        const style = {};
        style.height = (this.$store.state.height - 350) + 'px'
        return style
      }
    },

    methods: {
      //点击树节点回调函数
      getChartData (data) {
        let name = data.label;
        if (data.id == 1) name = '';
        //获取概况数据
        this.getOverviewData(name);

        //默认选择近7天
        this.timeVal = [new Date().getTime() - 3600 * 1000 * 24 * 6, new Date()];

        this.bucket_name = data.id == 1 ? '' : data.label;
        this.getStatsInfo();
      },

      //获取概况数据
      getOverviewData (name) {
        http.getRequest('/test/hos/user/overview.json', 'post',{ 'bucket_name': name})
          .then(res => {
            if (res.status) {
              this.overview = res.data;

              //如果已使用容量大于总容量，则将已使用容量显示成总容量
              if (this.formatter(res.data.used_cap) > this.formatter(res.data.total_cap)) {
                this.overview.used_cap = this.overview.total_cap;
              }
            }
          });
      },

      //获取统计明细数据
      getStatsInfo () {
        //获取统计明细数据
        let params = {
          bucket_name : this.bucket_name,
          stats_type: this.activeName,
          start_date: util.format(this.timeVal[0],'yyyy-MM-dd'),
          end_date:util.format(this.timeVal[1],'yyyy-MM-dd')
        };
        http.getRequest('/test/hos/user/getStatsInfo.json', 'post',params)
          .then(res => {
            if (res.status) {
              let m = res.data;
              let data = m.jsonData;
              let xAxisData = [];
              let yAxisLabels = [];
              let yAxisDatas = [];

              if (m.statsType == 'statsStorageCapacity'
                || m.statsType == 'statsDeleteCapacity'
                || m.statsType == 'statsDownloadFlow'
                || m.statsType == 'statsReadRequest'
                || m.statsType == 'statsDeleteRequest'
              ) {
                yAxisLabels = [m.statsUnit];
                var capacityData = [];
                for (var i = 0; i < data.length; i++) {
                  xAxisData.push(data[i]['date_x']);
                  capacityData.push(data[i]['value_y']);
                }
                yAxisDatas.push(capacityData);
              } else if (m.statsType == 'statsWriteRequest' || m.statsType == 'statsUploadFlow') {
                yAxisLabels = [lang._post_request_, lang._put_request_];
                let getData = [], postData = [], putData = [];
                for (var i = 0; i < data.length; i++) {
                  xAxisData.push(data[i]['date_x']);
                  postData.push(data[i]['post_count']);
                  putData.push(data[i]['put_count']);
                }

                yAxisDatas.push(postData);
                yAxisDatas.push(putData);
              }
              this.myChart = echartsUtil.createAreaLine(this.activeName,m.statsType, xAxisData, yAxisLabels, yAxisDatas);
            }
          });
      },

      //格式化数据
      formatter (data) {
        return data ? data.split(' ')[0] : 0;
      },

      //变更日期触发查询
      getDate (date) {
          //更改tag标记
          let start = date.split(' - ')[0],
              end = date.split(' - ')[1];

          let today = util.format(new Date(),'yyyy-MM-dd'),
              seven = util.format(new Date().getTime() - 3600 * 1000 * 24 * 6,'yyyy-MM-dd'),
              thirty = util.format(new Date().getTime() - 3600 * 1000 * 24 * 29,'yyyy-MM-dd'),
              day = util.format(new Date(),'yyyy-MM-dd','yyyy-MM-dd').split('-')[2] - 1,
              month = util.format(new Date().getTime() - 3600 * 1000 * 24 * day,'yyyy-MM-dd');

          if (end == today) {
              if (start == today) {
                  this.select = '今天';
              } else if ( start == seven ) {
                  this.select = '近7天';
              } else if (start == thirty) {
                  this.select = '近30天';
              } else if (start == month) {
                this.select = '本月';
              } else {
                this.select = '';
              }
          } else {
              this.select = '';
          }

          this.getStatsInfo();
      },
      //自适应报表
      resizeCharts () {
        this.myChart && this.myChart.resize();
      }

    }
  }
</script>
<style lang="less" scoped>
  .census{
    padding:0;
    &.sec{
      padding-top:30px;
     }
    h3{
      margin-top: 10px;
      margin-bottom: -1px;
      height: 40px;
      line-height: 38px;
      border: 1px solid #D6D5D5;
      position: relative;
      padding: 2px 10px;
    }
    ul{
      width:100%;
      overflow:hidden;
      zoom:1;
      border:1px solid #ddd;
      li{
        width:16%;
        float:left;
        text-align:center;
        border-right: 1px solid #ddd;
        &.last{
          border-right:none;
         }
        span{
          display:block;
          font-size:16px;
          s{
            font-size:32px;
            font-weight:900;
            text-decoration: none;
            font-family:'BebasNeue';
          }

        }
      }
    }
    .datePicker{
      position:absolute;
      right:-1px;
      top:-1px;
      /deep/ input{
        height:40px;
      }
    }
  }
  .tabs /deep/ .el-tabs__item{
    width:120px;
  }
  .refresh {
    position: absolute;
    right: 240px;
    top: 10px;
    font-size: 16px;
    cursor:pointer;
  }
</style>
