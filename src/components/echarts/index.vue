<template>
  <div class="echarts-box" id="myEcharts"></div>
</template>

<script setup lang="ts" name="echartsBox">
import * as echarts from "echarts";
let myEcharts = echarts;

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  myEcharts.dispose;
});

function initChart() {
  let chart = myEcharts.init(document.getElementById("myEcharts"), "purple-passion");
  chart.setOption({
    title: {
      text: "2021年各月份销售量（单位：件）",
      left: "center",
    },
    xAxis: {
      type: "category",
      data: [
        "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
      ]
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [
          606, 542, 985, 687, 501, 787, 339, 706, 383, 684, 669, 737
        ],
        type: "line",
        smooth: true,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: "top",
              formatter: "{c}"
            }
          }
        }
      }
    ]
  });
  window.onresize = function () {
    chart.resize();
  };
}
</script>
