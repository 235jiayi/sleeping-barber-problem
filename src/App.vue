<template>
  <div class="cover">
    <div class="left">
      <h1>请选择问题的场景：</h1>
      <div style="margin-top: 40px; margin-bottom: 50px; display: flex">
        <div @click="multi">
          <el-radio
            v-model="mode"
            label="1"
            border
            size="medium"
            style="
              width: 150px;
              text-indent: 5px;
              line-height: 25px;
              height: 50px;
            "
            >多理发师</el-radio
          >
        </div>
        <div style="margin-left: 20px" @click="single">
          <el-radio
            v-model="mode"
            label="0"
            border
            size="medium"
            style="
              width: 150px;
              text-indent: 5px;
              line-height: 25px;
              height: 50px;
            "
            >单理发师</el-radio
          >
        </div>
      </div>
      <div class="numConsumers" style="margin-bottom: 70px">
        <span class="left-span">顾客数量</span>
        <el-input
          v-model="numConsumers"
          placeholder="请输入内容"
          class="input"
          type="text"
        ></el-input>
      </div>
      <div class="numBarbers" style="margin-bottom: 70px">
        <span class="left-span">理发师数量</span>
        <el-input
          v-model="numBarbers"
          placeholder="请输入内容"
          class="input"
          style="margin-left: 0"
        ></el-input>
      </div>
      <div class="chairs">
        <span class="left-span">椅子数量</span>
        <el-input
          v-model="CHAIRS"
          placeholder="请输入内容"
          class="input"
        ></el-input>
      </div>
      <el-button
        type="primary"
        style="
          margin-left: auto;
          margin-right: auto;
          margin-top: 120px;
          width: 160px;
          height: 50px;
        "
        @click="fetchData"
        >计算</el-button
      >
    </div>
    <div class="right">
      <div
        class="show"
        v-show="
          HairCutVisible || LeaveVisible || chartVisible || cartoonVisible
        "
      >
        <el-table
          :data="HairCutList"
          stripe
          height="460"
          style="width: 100%"
          v-show="HairCutVisible && mode == '0'"
        >
          <el-table-column prop="customUid" label="顾客Uid" width="160">
          </el-table-column>
          <el-table-column prop="arriveTime" label="顾客到店时间" width="160">
          </el-table-column>
          <el-table-column prop="wait" label="顾客等待状态" width="160">
          </el-table-column>
          <el-table-column prop="beginTime" label="理发开始时间" width="160">
          </el-table-column>
          <el-table-column prop="leaveTime" label="理发结束时间">
          </el-table-column>
        </el-table>
        <el-table
          :data="LeaveList"
          stripe
          height="460"
          style="width: 100%"
          v-show="LeaveVisible"
        >
          <el-table-column prop="customUid" label="顾客Uid" width="180">
          </el-table-column>
          <el-table-column prop="leaveTime" label="顾客离开时间">
          </el-table-column>
        </el-table>
        <el-table
          :data="HairCutList"
          stripe
          height="460"
          style="width: 100%"
          v-show="HairCutVisible && mode == '1'"
        >
          <el-table-column prop="customUid" label="顾客Uid" width="160">
          </el-table-column>
          <el-table-column prop="barberUid" label="理发师Uid" width="160">
          </el-table-column>
          <el-table-column prop="arriveTime" label="顾客到店时间" width="160">
          </el-table-column>
          <el-table-column prop="wait" label="顾客等待状态" width="160">
          </el-table-column>
          <el-table-column prop="beginTime" label="理发开始时间" width="160">
          </el-table-column>
          <el-table-column prop="leaveTime" label="理发结束时间">
          </el-table-column>
        </el-table>
        <div
          ref="chartColumn"
          style="width: 100%; height: 460px"
          v-show="chartVisible"
        ></div>
        <div class="cartoon" v-if="cartoonVisible">
          <div class="barberList">
            <h1 class="vH1">理发师</h1>
            <div v-for="(item, index) in barberNum" :key="index" class="vLoop">
              <img src="./assets/barber.webp" alt="" class="vHead" />
              <div class="vBarber">理发师{{ index }}</div>
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div
                  class="barber_customer"
                  v-show="barberCustomer[index].show"
                >
                  <div class="vLoop">
                    <img src="./assets/customer.webp" alt="" class="vHead" />
                    <div class="vBarber">
                      顾客{{ barberCustomer[index].customUid }}
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="chairList">
            <h1 class="vH1">椅子</h1>
            <div v-for="(item, index) in chairNum" :key="index" class="vLoop">
              <img src="./assets/chair.webp" alt="" class="vHead" />
              <div class="vBarber">椅子{{ index }}</div>
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div
                  class="barber_customer"
                  v-if="chairCustomer[index - 0].show"
                >
                  <div class="vLoop">
                    <img src="./assets/customer.webp" alt="" class="vHead" />
                    <div class="vBarber">
                      顾客{{ chairCustomer[index].customUid }}
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="chairList">
            <h1 class="vH1">顾客</h1>
            <div class="vLoop" v-if="showCurrentCustomer">
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div class="vLoop">
                  <img src="./assets/customer.webp" alt="" class="vHead" />
                  <div class="vBarber">顾客{{ currentCustomer }}</div>
                </div>
              </transition>
            </div>
            <div class="vLoop" v-else>
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div class="vBarber">当前没有顾客</div>
              </transition>
            </div>
          </div>
          <div class="currentTime">
            <div class="cTE"><i class="el-icon-timer"></i> 当前时间：</div>
            <div class="vH1 title">{{ currentTime }}</div>
          </div>
          <div class="currentOperator">
            <div><i class="el-icon-magic-stick"></i> 当前操作：</div>
            <div class="vH1 title cEvent">
              <el-button
                type="primary"
                plain
                style="width: 100px"
                @click="nextSecond"
                >下一秒</el-button
              >
              <el-button
                type="primary"
                plain
                style="width: 100px"
                @click="reset"
                >重置</el-button
              >
            </div>
          </div>
          <div class="currentEvent">
            <div><i class="el-icon-caret-bottom"></i> 当前事件：</div>
            <pre class="vH1 title cEvent">{{ currentEvent }}</pre>
          </div>
          <div class="steps">
            <el-steps
              :active="currentTime - 1"
              finish-status="finish"
              direction="vertical"
            >
              <el-step
                class="step"
                v-for="index in timeNum"
                :key="index"
                @click="showStep(index)"
              ></el-step>
            </el-steps>
          </div>
        </div>
      </div>
      <el-button
        type="info"
        icon="el-icon-back"
        v-show="
          HairCutVisible || LeaveVisible || chartVisible || cartoonVisible
        "
        @click="returnBtn"
        class="returnBtn"
        >返回</el-button
      >
      <div
        class="empty"
        v-show="
          !HairCutVisible && !LeaveVisible && !chartVisible && !cartoonVisible
        "
      ></div>
      <div
        class="btns"
        v-show="
          !HairCutVisible && !LeaveVisible && !chartVisible && !cartoonVisible
        "
      >
        <el-button
          type="success"
          icon="el-icon-sunrise"
          class="btn-right"
          @click="HairCutVisible = true"
          >理发顾客表</el-button
        ><el-button
          type="warning"
          icon="el-icon-sunny"
          class="btn-right"
          @click="LeaveVisible = true"
          >离开顾客表</el-button
        ><el-button
          type="info"
          icon="el-icon-sunset"
          class="btn-right"
          @click="startEchart"
          >理发顾客柱状图</el-button
        ><el-button
          type="danger"
          icon="el-icon-moon"
          class="btn-right"
          @click="startCartoon"
          >演示动画</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import "animate.css";
import multiBarber from "./js/multiBarber";
import singleBarber from "./js/singleBarber";
export default {
  data() {
    return {
      mode: "0",
      numConsumers: 5,
      numBarbers: 1,
      CHAIRS: 2,
      HairCutList: [],
      LeaveList: [],
      HairCutVisible: false,
      LeaveVisible: false,
      chartVisible: false,
      barberList: [],
      option: {
        title: {
          text: "顾客理发时间柱状图",
          textStyle: {
            fontWeight: "bolder",
            fontSize: 32,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function (params) {
            let time = 0;
            for (let i = 1; i < params.length; i++) {
              if (params[i].value && params[i].value != "-") {
                time = params[i].value - 0;
                break;
              }
            }
            return params[0].axisValue + "<br/>理发时长为：" + time;
          },
        },
        legend: {
          data: [],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          //类目轴
          data: [],
        },
        yAxis: {
          type: "value",
          //数值轴
        },
        series: [],
      },
      chartColumn: null,
      cartoonVisible: false,
      timeLine: [],
      barberNum: [],
      chairNum: [],
      currentTime: 0,
      currentEvent: "等待程序开始",
      barberCustomer: [],
      chairCustomer: [],
      currentCustomer: 0,
      showCurrentCustomer: false,
      timeList: [],
    };
  },
  methods: {
    async fetchData() {
      this.HairCutList = [];
      this.LeaveList = [];
      this.currentTime = 0;
      this.currentEvent = "等待程序开始";
      this.barberCustomer = [];
      this.chairCustomer = [];
      this.currentCustomer = 0;
      this.showCurrentCustomer = false;
      this.cartoonVisible = false;
      this.HairCutVisible = false;
      this.LeaveVisible = false;
      this.chartVisible = false;
      this.chairNum = [];
      this.barberNum = [];
      this.timeNum = [];
      this.timeList = [];
      try {
        if (this.mode == "1") {
          const res = await multiBarber(
            this.HairCutList,
            this.LeaveList,
            this.CHAIRS,
            this.numBarbers,
            this.numConsumers
          );
          this.HairCutList = res.HairCutList;
          this.LeaveList = res.LeaveList;
          this.barberList = res.barberList;
          this.timeLine = res.timeLine;
          for (let i = 0; i < this.numBarbers; i++) {
            this.barberNum.push(i);
          }
          for (let i = 0; i < this.CHAIRS; i++) {
            this.chairNum.push(i);
          }
          for (let i = 0; i < this.timeLine.length; i++) {
            this.timeNum.push(i);
          }
          for (let i = 0; i < this.numBarbers; i++) {
            this.barberCustomer.push({
              show: false,
              customerUid: 0,
            });
          }
          for (let i = 0; i < this.CHAIRS; i++) {
            this.chairCustomer.push({
              show: false,
              customerUid: 0,
            });
          }

          // console.table(this.barberList);
        } else {
          let res = await singleBarber(
            this.HairCutList,
            this.LeaveList,
            this.CHAIRS,
            this.numConsumers
          );
          this.HairCutList = res.HairCutList;
          this.LeaveList = res.LeaveList;
          this.timeLine = res.timeLine;
          for (let i = 0; i < this.numBarbers; i++) {
            this.barberNum.push(i);
          }
          for (let i = 0; i < this.CHAIRS; i++) {
            this.chairNum.push(i);
          }
          for (let i = 0; i < this.timeLine.length; i++) {
            this.timeNum.push(i);
          }
          for (let i = 0; i < this.numBarbers; i++) {
            this.barberCustomer.push({
              show: false,
              customerUid: 0,
            });
          }
          for (let i = 0; i < this.CHAIRS; i++) {
            this.chairCustomer.push({
              show: false,
              customerUid: 0,
            });
          }
          // this.showCurrentCustomer = true;
        }
        const h = this.$createElement;
        this.$msgbox({
          title: "",
          message: h("p", null, [
            h(
              "span",
              { style: "margin-left: 20px;font-size: 31px;" },
              "计算完成"
            ),
          ]),
          confirmButtonText: "确定",
        });
      } catch (error) {
        console.error(error);
      }
    },
    single() {
      this.numConsumers = 5;
      this.numBarbers = 1;
      this.CHAIRS = 2;
    },
    multi() {
      this.numConsumers = 10;
      this.numBarbers = 2;
      this.CHAIRS = 2;
    },
    returnBtn() {
      this.HairCutVisible = false;
      this.LeaveVisible = false;
      this.chartVisible = false;
      this.cartoonVisible = false;
    },
    initChart() {
      this.HairCutList.sort((a, b) => a.customUid - b.customUid);
      this.option.series = [
        {
          name: "BeginTime",
          type: "bar",
          stack: "Total",
          silent: true,
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
          emphasis: {
            itemStyle: {
              borderColor: "transparent",
              color: "transparent",
            },
          },
          data: [],
        },
      ];
      // console.log(this.barberList);
      this.option.legend = { data: [] };
      if (this.mode == "1") {
        for (let barber of this.barberList) {
          let data = [];
          for (let i = 0; i < this.HairCutList.length; i++) {
            data[this.HairCutList[i].customUid] = "-";
          }
          for (let i of barber) {
            for (let j in this.HairCutList) {
              if (i.customUid == this.HairCutList[j].customUid) {
                data[j] = i.leaveTime - i.beginTime;
              }
            }
          }
          this.option.series.push({
            name: `理发师${barber[0].barberUid}`,
            type: "bar",
            label: {
              show: true,
              position: "top",
            },
            stack: "Total",
            data,
          });
          // console.log(this.option);
          this.option.legend.data.push(`理发师${barber[0].barberUid}`);
        }
      } else {
        this.option.legend.data = ["理发师1"];
        let data = [];
        for (let i = 0; i < this.HairCutList.length; i++) {
          data[i] =
            this.HairCutList[i].leaveTime - this.HairCutList[i].beginTime;
        }
        this.option.series.push({
          name: `理发师1`,
          type: "bar",
          stack: "Total",
          label: {
            show: true,
            position: "top",
          },
          data,
        });
      }
      for (let i = 0; i < this.HairCutList.length; i++) {
        this.option.series[0].data.push(this.HairCutList[i].beginTime);
      }
      this.option.xAxis.data = [];
      for (let i of this.HairCutList) {
        this.option.xAxis.data.push(`顾客${i.customUid}`);
      }
      this.chartColumn = echarts.init(this.$refs.chartColumn, null, {
        width: 950,
        height: 460,
      });
      this.chartColumn.setOption(this.option);
    },
    startEchart() {
      this.initChart();
      this.chartVisible = true;
    },
    startCartoon() {
      this.cartoonVisible = true;
    },
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms)); // 实现延时效果的函数
    },
    async nextSecond() {
      if (this.currentTime > this.timeLine.length - 1) {
        return;
      }
      this.currentEvent = "";
      let j = 1;
      const operator = this.timeLine[this.currentTime];
      if (operator.length == 0) {
        this.currentEvent = "无事发生";
      } else {
        for (let i of operator) {
          if (i.type == 4) {
            this.currentCustomer = i.customUid;
            this.showCurrentCustomer = true;
            await this.sleep(300);
            this.currentEvent += `${j++}:顾客${i.customUid}开始理发\n`;
            this.barberCustomer[i.barberUid].show = true;
            this.showCurrentCustomer = false;
            this.barberCustomer[i.barberUid].customUid = i.customUid;
            await this.sleep(300);
          } else if (i.type == 1) {
            this.currentCustomer = i.customUid;
            this.showCurrentCustomer = true;
            await this.sleep(300);
            this.currentEvent += `${j++}:顾客${i.customUid}离开\n`;
            this.showCurrentCustomer = false;
            await this.sleep(300);
          } else if (i.type == 2) {
            this.currentCustomer = i.customUid;
            this.showCurrentCustomer = true;
            await this.sleep(300);
            this.currentEvent += `${j++}:顾客${i.customUid}坐到椅子${
              i.chair
            }上\n`;
            this.chairCustomer[i.chair].show = true;
            this.showCurrentCustomer = false;
            this.chairCustomer[i.chair].customUid = i.customUid;
            await this.sleep(300);
          } else if (i.type == 3) {
            this.currentEvent += `${j++}:顾客${i.customUid}离开椅子${
              i.chair
            }，由理发师0理发\n`;
            this.chairCustomer[i.chair].show = false;
            await this.sleep(300);
            this.barberCustomer[i.barberUid].customUid = i.customUid;
            this.barberCustomer[i.barberUid].show = true;
            await this.sleep(300);
          } else if (i.type == 5) {
            this.currentEvent += `${j++}:顾客${i.customUid}理发结束离开\n`;
            this.barberCustomer[i.barberUid].show = false;
            await this.sleep(300);
          }
        }
      }
      this.timeList[this.currentTime] = {
        time: this.currentTime,
        barberCustomer: this.barberCustomer,
        currentEvent: this.currentEvent,
        chairCustomer: this.chairCustomer,
      };
      this.currentTime++;
    },
    showStep(index) {
      // console.log(111);
      this.currentTime = this.timeList[index].currentTime;
      this.barberCustomer = this.timeList[index].barberCustomer;
      this.currentEvent = this.timeList[index].currentEvent;
      this.chairCustomer = this.timeList[index].chairCustomer;
    },
    reset() {
      this.currentTime = 0;
      this.currentEvent = "等待程序开始";
      this.currentCustomer = 0;
      this.showCurrentCustomer = false;
      this.barberCustomer = [];
      this.chairCustomer = [];
      for (let i = 0; i < this.numBarbers; i++) {
        this.barberCustomer.push({
          show: false,
          customerUid: 0,
        });
      }
      for (let i = 0; i < this.CHAIRS; i++) {
        this.chairCustomer.push({
          show: false,
          customerUid: 0,
        });
      }
    },
  },
};
</script>
<style lang="less">
@import "./reset.css";
.cover {
  height: 720px;
  width: 100%;
  background: #fcfbf9;
  display: flex;
}
.left {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 50px;
  top: 50px;
  width: 350px;
  height: 580px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background-color: #fff;
  padding: 18px;
  h1 {
    font-size: 24px;
  }
  .left-span {
    font-size: 24px;
  }
}
.right {
  padding: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  position: relative;
  margin-left: 50px;
  top: 50px;
  width: 950px;
  height: 580px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.input {
  color: #000;
  text-decoration: none;
  outline: none;
  border: none;
  height: 0.4rem;
  background: #faf9f9;
  border-radius: 8px;
  text-indent: 12px;
  font-size: 16px;
  line-height: 16px;
  margin-left: 24px;
  width: 160px !important;
  top: -3px;
  left: 18px;
  &::placeholder {
    font-size: 16px;
    line-height: 56px;
    color: #c7b9b6;
    text-indent: 12px;
  }
}
.btns {
  margin-top: 40px;
  margin-bottom: 25px;
  .btn-right {
    width: 160px;
    margin-left: 30px;
    height: 50px;
  }
}
.returnBtn {
  margin-top: 45px !important;
  width: 160px;
  margin-left: 30px !important;
  height: 50px;
}
.empty {
  width: 950px;
  height: 600px;
  background: url("./assets/background.jpg") no-repeat;
  background-size: contain;
}
.cartoon {
  width: 950px;
  height: 460px;
  display: flex;
  background-color: #fff;
}
.barberList,
.chairList {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 240px;
  margin-right: -30px;
  height: 100%;
}
.vH1 {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 40px;
}
.vLoop {
  flex: 1;
  display: flex;
  height: 60px;
  max-height: 60px;
  .vHead {
    width: 42px;
    height: 42px;
  }
  .vBarber {
    flex: 1;
    height: 48px;
    font-size: 18px;
    line-height: 48px;
  }
}
.currentEvent,
.currentTime,
.currentOperator {
  position: absolute;
  display: flex;
  font-size: 32px;
  height: 95px;
  width: 220px;
  margin-bottom: 40px;
  flex-direction: column;
  right: 30px;
  padding: 10px 0px 5px 10px;
  border: 3px dashed #dcdfe6;
}
.currentTime {
  top: 34px;
}
.currentOperator {
  top: 147px;
}
.currentEvent {
  top: 260px;
  height: 300px;
}
.title {
  font-weight: 550;
  margin-top: 20px;
  text-align: center;
  margin-right: 5px;
}
.cTE {
  width: 100%;
}
.cEvent {
  text-align: left;
  white-space: pre-wrap;
  font-weight: 400;
  font-size: 24px;
  width: 210px;
  margin-top: 20px;
}
.left,
.right {
  background-color: #fff;
}
.steps {
  height: 547px;
  margin-top: 15px;
  .step {
    height: 40px;
  }
}
.move {
  transform: translateX(-100%);
}
</style>
