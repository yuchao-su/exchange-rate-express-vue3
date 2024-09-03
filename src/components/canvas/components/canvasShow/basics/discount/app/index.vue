<template>
  <div class="spike">
    <div class="spike-card" v-if="productList?.length>0">
      <div class="spike-card-top">
        <h2 class="spike-card-top-title">
          限时折扣
        </h2>
        <div class="spike-card-top-time" v-if="activityData.value?.state===2">
          <div class="session">活动已结束</div>
        </div>
        <div class="spike-card-top-time" v-else-if="count?.length > 0">
          <div class="session">距活动{{count[0]}}还有</div>
          <div class="time">{{count[1]}}:{{count[2]}}:{{count[3]}}</div>
        </div>
        <a v-show="componentContent.showMore" class="btn-more" @click="jumpGroupWorks(activityData)">查看更多</a>
      </div>
      <div class="spike-card-list">
        <div class="spike-card-item" v-for='item in productList.slice(0,4)' :key='item.productId' @click="jumpProductDetail(item)">
          <div class="spike-card-item-img">
            <img :src="item.image" alt="" />
          </div>
          <div class="spike-card-item-info">
            <h3 class="name">
              {{item.productName}}
            </h3>
            <div class="price-warp">
              <div class="price">¥{{item.price}}</div>
              <!-- <div class="original-price">
                ¥ {{item.originalPrice}}
              </div> -->
              <div class="stock">
                限量{{item.stock}}件
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import commonMixin from '../mixin'
import { toRefs } from 'vue';
const props = defineProps({
  typeId: {
    type: Number,
    default: 1,
  },
  shopId: {
    type: Number,
    default: 0,
  },
  componentContent: {
    type: Object,
    default () {
      return {};
    }
  }
})
const { typeId, shopId, componentContent } = toRefs(props)
const { activityData, productList, count, jumpProductDetail, jumpGroupWorks } = commonMixin(componentContent, typeId, shopId)
</script>

<style lang="scss" scoped>
.spike{
  &-card{
    border-radius: 20px;
    margin: 0 34px;
    &-top{
      position: relative;
      display: flex;
      margin-bottom: 17px;
      &-title{
        font-size: 32px;
        color: #333333;
        margin-right: 25px;
        font-weight: normal;
      }
      &-time{
        height: 40px;
        border-radius: 21px;
        border: 1px solid #EE6D46;
        display: flex;
        overflow: hidden;
        align-items: center;
        .session{
          height: 100%;
          line-height: 40px;
          background: #EE6D46;
          font-size: 20px;
          color: #FFFFFF;
          padding: 0 15px;
          border-radius: 21px;
        }
        .time{
          font-size: 20px;
          color: #EE6D46;
          padding: 0 14px 0 10px;
        }
      }
      .btn-more{
        position: absolute;
        right: 8px;
        top: 0px;
        line-height: 40px;
        padding-right: 30px;
        font-size: 24px;
        color: #999;
        background: url("https://b2c-pro-static-dev.zkthink.com/static/images/icon-arrow.png") no-repeat right center / 20px 20px;
      }
    }
    &-list{
      background-color: #ffffff;
      display: flex;
      overflow: auto;
      padding: 20px;
      border-radius: 15px;
    }
    &-item{
      align-items: center;
      box-sizing: border-box;
      flex: 0 0 203px;
      margin-right: 18px;
      &-img{
        width: 203px;
        height: 203px;
        image{
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      &-info{
        width: 203px;
        .name{
          font-size: 30px;
          font-weight: normal;
          line-height: 40px;
          color: #333333;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          padding: 15px 0 6px;
        }
        .price-warp{
          display: flex;
          align-items: center;
        }
        .price{
          font-size: 32px;
          color: #EE6D46;
          padding-right: 10px;
          display: inline-block;
        }
        .original-price{
          font-size: 20px;
          line-height: 28px;
          color: #CCCCCC;
          display: inline-block;
        }
        .stock{
          line-height: 1em;
          display: inline-block;
          font-size: 20px;
          color: #999999;
        }
      }
    }
  }
}
</style>
