<template>
    <page-container>
        <div class="bg-panel" id="bg">
          <canvas></canvas>
          <canvas></canvas>
		      <canvas></canvas>
        </div>
        <div class="title">Select Subsystem</div>
        <div class="card-container">
            <div class="card-item">
                <div class="card-item-content">
                    <div class="content-title">
                        云控制平台
                    </div>
                </div>
            </div>
            <div class="card-item">
                <div class="card-item-content">
                    <div class="content-title">
                        运维子系统
                    </div>
                </div>
            </div>
        </div>
    </page-container>
</template>
<script>
    import $ from 'jquery'
    import canvasMoving from './canva_moving_effect.js'
    export default {
        mounted () {
          canvasMoving($)  
        }
    }
</script>
<style lang="less" scoped>
    #bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #2196F3;
        z-index: -1;
        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
    .title {
        font-size: 3em;
        color: #fff;
        letter-spacing: 3px;
        text-align: center;
        margin: 3% 1%;
        font-family: 'Josefin Sans', sans-serif;
    }

    .card-container {
        display: flex;
        align-items: center;
        align-content: space-around;
        text-align: center;
        height: 50%;
        .card-item {
            flex: 1;
            height: 100%;
            &:first-child {
                padding: 0 7% 0 14%;
            }
            &:last-child {
                padding: 0 14% 0 7%;
            }
            .card-item-content {
                position: relative;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                background: rgba(10, 10, 10, 0.17);
                border-radius: 30px 30px 50px 50px;
                border-bottom: 8px solid #f7296f;
                cursor: pointer;
                transition: transform .3s;
                &:hover {
                    transform: scale(1.1);
                    // border-top: 1px solid #f7296f;
                    // border-right: 1px solid #f7296f;
                    // border-left: 1px solid #f7296f;
                    .content-title {
                        color: #f7296f;
                    }
                }
                .content-title {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    font-size: 20px;
                    color: #fff;
                    transform: translate(-50%, -50%);
                }

            }
        }
    }

</style>
