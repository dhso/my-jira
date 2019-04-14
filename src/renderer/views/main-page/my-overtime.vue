<template>
  <div class="my-overtime" v-loading="isLoading">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Plugins</el-breadcrumb-item>
      <el-breadcrumb-item>Overtime</el-breadcrumb-item>
    </el-breadcrumb>
    <full-calendar
      ref="fullCalendar"
      default-view="month"
      hide-view-selector
      :disable-views="['years', 'year', 'week', 'day']"
      :events="overTimeRecords"
      :startWeekOnSunday="true"
      @ready="viewChageHandler"
      @view-change="viewChageHandler"
      @day-click="dayClickHander"
    >
      <span slot="title" slot-scope="{ title }">
        {{ $dayjs(title).format('YYYY - MM') }}
      </span>
      <span slot="cell-content" slot-scope="{ cell, view, events }">
        {{ cell.formattedDate.split('-')[2] }}
        <p class="cell-content-event">{{ events[0] && events[0].title }}</p>
      </span>
    </full-calendar>
    <el-dialog title="加班打卡" :visible.sync="overtimeDialogVisible" width="400px" center :modal-append-to-body="false">
      <el-form :model="overtimeForm" :rules="overtimeRules" ref="overtimeForm" label-width="100px" :hide-required-asterisk="true">
        <el-form-item label="加班结束时间" prop="datetime">
          <el-input type="datetime-local" v-model="overtimeForm.datetime" placeholder="请输入加班结束时间"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="overtimeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logOvertimeDatetimeHandler" :loading="isLoading">打 卡</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import configs from '@/configs'

export default {
  name: 'my-overtime',
  components: {
    'full-calendar': VueCal
  },
  data() {
    return {
      isLoading: false,
      viewData: null,
      overTimeRecords: [],
      overtimeDialogVisible: false,
      overtimeForm: {
        datetime: null
      }
    }
  },
  created() {
    console.log('my overtime')
    this.currentUser = this.$stores.get('current.user')
    this.overtimeRules = {
      datetime: [{ required: true, type: 'string', message: '请输入加班时间', trigger: 'blur' }]
    }
  },
  methods: {
    viewChageHandler(viewData) {
      this.viewData = viewData
      this.getOvertimeRecords(true)
    },
    dayClickHander(event) {
      const currentSelectedDatetime = this.$dayjs()
        .set('date', this.$dayjs(event).get('date'))
        .format('YYYY-MM-DDTHH:mm')
      this.$set(this.overtimeForm, 'datetime', currentSelectedDatetime)
      this.overtimeDialogVisible = true
    },
    async getOvertimeRecords(onlyMe) {
      this.isLoading = true
      const url = onlyMe ? `${configs.PATSNAP_OVERTIME_RECORD_API}/user/${this.currentUser.name}` : `${configs.PATSNAP_OVERTIME_RECORD_API}/`
      try {
        const { firstCellDate, lastCellDate } = this.viewData
        this.overTimeRecords = await this.$http.get(url, { params: { from: firstCellDate, to: lastCellDate } })
        const [date, overDatetime] = this.overTimeRecords.data
        let events = []
        if (date && overDatetime) {
          const thisDate = date.split(',')
          const thisOverDatetime = overDatetime.split(',')
          for (let i = 3; i < thisDate.length; i++) {
            if (thisOverDatetime[i]) {
              const startEndDate = thisDate[i].replace(/\//g, '-')
              events.push({
                start: startEndDate,
                end: startEndDate,
                title: thisOverDatetime[i]
              })
            }
          }
        }
        this.overTimeRecords = events
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.isLoading = false
      }
    },
    logOvertimeDatetimeHandler() {
      this.$refs.overtimeForm.validate(async valid => {
        if (!valid) return false
        this.isLoading = true
        const url = `${configs.PATSNAP_OVERTIME_RECORD_API}/`
        try {
          await this.$http.post(url, { createDate: this.overtimeForm.datetime, user: { email: this.currentUser.emailAddress } })
          this.getOvertimeRecords(true)
          this.overtimeDialogVisible = false
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.my-overtime {
  .vuecal {
    color: #333;
    height: calc(100vh - 70px);
  }
  .vuecal__title {
    background-color: transparent;
    font-weight: 600;
  }
  .vuecal__arrow {
    &:hover {
      color: #409eff;
    }
  }
  .vuecal__heading {
    border-top: 1px solid #ddd;
  }
  .vuecal__cell {
    &.today {
      background-color: rgb(225, 243, 216);
    }
  }
  .vuecal__cell--has-events {
    background-color: rgb(217, 236, 255);
  }
  .vuecal__cell-events-count {
    display: none;
  }
  .cell-content-event {
    position: absolute;
    font-size: 10px;
    width: 100%;
  }
}
</style>
