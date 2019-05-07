<template>
  <div class="issue-detail">
    <p>
      <a class="issue-key" :href="`${fullHost}/browse/${issue.key}`" target="_blank">{{ issue.key }} </a>
      <el-tag :class="['issue-status', `color-${issueData.fields.status.statusCategory.colorName}`]" size="mini">
        <span>{{ issueData.fields.status.name }}</span>
      </el-tag>
    </p>
    <p class="issue-summary">
      {{ issueData.fields.summary }}
    </p>
    <div class="issue-actions">
      <i v-if="isTransitionLoading" class="el-icon el-icon-loading" />
      <el-button-group v-else>
        <el-button v-for="transition in transitionsList" :key="transition.id" :disabled="isTransitionDisabled" type="primary" size="mini" @click="transitionHandler(transition)">
          {{ transition.name }}
        </el-button>
      </el-button-group>
    </div>

    <el-collapse v-model="activeNames" :accordion="false">
      <el-collapse-item name="baseInfo" class="base-info">
        <template v-slot:title>
          <span>Base Info</span>
          <i v-show="isBaseInfoLoading" class="issue-status el-icon el-icon-loading" />
        </template>
        <template v-if="!isBaseInfoLoading">
          <el-row :gutter="20">
            <el-col :span="5">
              <b>Type:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'issuetype.name', '&nbsp;') }}</span>
            </el-col>
            <el-col :span="5">
              <b>Ticket Type:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'customfield_11984.value', '&nbsp;') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <b>Business Value:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'customfield_10208', '&nbsp;') }}</span>
            </el-col>
            <el-col :span="5">
              <b>Fix Version/s:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'fixVersions[0].name', '&nbsp;') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <b>Reporter:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'reporter.displayName', '&nbsp;') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <b>Sprint:</b>
            </el-col>
            <el-col :span="19">
              <span>{{ get(sprint, 'name', '&nbsp;') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <b>Sprint Start:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ formatDate(get(sprint, 'startDate'), '&nbsp;', 'YYYY-MM-DD') }}</span>
            </el-col>
            <el-col :span="5">
              <b>Sprint End:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ formatDate(get(sprint, 'endDate'), '&nbsp;', 'YYYY-MM-DD') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <b>Time to Test:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ formatDate(get(issueData.fields, 'customfield_11927'), '&nbsp;', 'YYYY-MM-DD HH:mm') }}</span>
            </el-col>
            <el-col :span="5">
              <b>Group of Core:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'customfield_11701[0].value', '&nbsp;') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <b>PM Owner:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'customfield_11941.displayName', '&nbsp;') }}</span>
            </el-col>
            <el-col :span="5">
              <b>UE Owner:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'customfield_11960.displayName', '&nbsp;') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <b>TL Owner:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'customfield_11947.displayName', '&nbsp;') }}</span>
            </el-col>
            <el-col :span="5">
              <b>QA Owner:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ get(issueData.fields, 'customfield_11006.displayName', '&nbsp;') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <b>Created:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ formatDate(get(issueData.fields, 'created'), '&nbsp;') }}</span>
            </el-col>
            <el-col :span="5">
              <b>Updated:</b>
            </el-col>
            <el-col :span="7">
              <span>{{ formatDate(get(issueData.fields, 'updated'), '&nbsp;') }}</span>
            </el-col>
          </el-row>
        </template>
      </el-collapse-item>

      <el-collapse-item name="description">
        <template v-slot:title>
          <span>Description</span>
          <i v-show="isBaseInfoLoading" class="issue-status el-icon el-icon-loading" />
        </template>
        <div v-html="descriptionHtml" />
      </el-collapse-item>

      <!-- <el-collapse-item name="attachments">
        <template v-slot:title>
          <span>Attachments</span>
          <i v-show="isBaseInfoLoading" class="issue-status el-icon el-icon-loading" />
        </template>
        <template v-for="attachment in get(issueData.fields, 'attachment', [])">
          <div v-if="attachment.mimeType === 'image/png'" :key="attachment.id" class="attachments-item">
            <el-image :src="attachment.content" fit="cover" :alt="attachment.filename" :data-origin-src="attachment.content" />
          </div>
        </template>
      </el-collapse-item> -->

      <el-collapse-item name="timeTracking">
        <template v-slot:title>
          <span>Time Tracking</span>
          <i v-show="isBaseInfoLoading" class="issue-status el-icon el-icon-loading" />
        </template>
        <el-progress class="time-tracking-circle" type="circle" :width="100" :percentage="100" status="text">
          <p class="time-tracking-text">
            Estimated:
          </p>
          <p class="time-tracking-text">
            {{ get(timetracking, 'originalEstimate', '0m') }}
          </p>
        </el-progress>
        <el-progress
          class="time-tracking-circle"
          type="circle"
          :width="100"
          :color="remainingEstimatePercentage > 10 ? 'rgb(19, 206, 102)' : 'rgb(255, 73, 73)'"
          :percentage="remainingEstimatePercentage"
          status="text"
        >
          <p class="time-tracking-text">
            Remaining:
          </p>
          <p class="time-tracking-text">
            {{ get(timetracking, 'remainingEstimate', '0m') }}
          </p>
        </el-progress>
        <el-progress
          class="time-tracking-circle"
          type="circle"
          :width="100"
          :color="timeSpentPercentage > 90 ? 'rgb(255, 73, 73)' : 'rgb(19, 206, 102)'"
          :percentage="timeSpentPercentage"
          status="text"
        >
          <p class="time-tracking-text">
            Logged:
          </p>
          <p class="time-tracking-text">
            {{ get(timetracking, 'timeSpent', '0m') }}
          </p>
        </el-progress>
      </el-collapse-item>

      <el-collapse-item name="worklogs">
        <template v-slot:title>
          <span>Worklogs</span>
          <i v-show="isWorklogLoading" class="issue-status el-icon el-icon-loading" />
        </template>
        <el-table :data="issueWorklogs" class="simple-table worklog-table" :show-header="false" style="width:100%;">
          <el-table-column prop="date" label="Date" width="140">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.started) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="timeSpent" label="Time Spent" width="160" />
        </el-table>
        <el-button v-show="!isWorklogLoading" type="text" icon="el-icon-circle-plus" @click="worklogDialogVisible = true">
          Add worklog
        </el-button>
      </el-collapse-item>

      <el-collapse-item name="issuelinks">
        <template v-slot:title>
          <span>Issue Links</span>
          <i v-show="isBaseInfoLoading" class="issue-status el-icon el-icon-loading" />
        </template>
        <div v-for="(val, key) in issuelinks" :key="key" class="issue-links">
          <template v-if="val && val.length > 0">
            <p class="issue-links-title">
              {{ key === 'outwardIssue' ? 'is cloned by' : 'clones' }}
            </p>
            <el-table :data="val" class="simple-table" :show-header="false" style="width:100%;">
              <el-table-column prop="key" show-overflow-tooltip width="90">
                <template slot-scope="scope">
                  <a :href="`${fullHost}/browse/${scope.row.key}`" target="_blank">{{ scope.row.key }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="fields.summary" show-overflow-tooltip />
              <el-table-column show-overflow-tooltip width="100">
                <template slot-scope="scope">
                  <span :class="`color-${scope.row.fields.status.statusCategory.colorName}`">{{ scope.row.fields.status.name }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog title="Add Worklog" :visible.sync="worklogDialogVisible" width="420px" append-to-body center @open="worklogFormOpen">
      <el-form ref="worklogForm" :model="worklogForm" :rules="worklogRules" label-width="100px" :hide-required-asterisk="true" class="worklog-form">
        <el-form-item label="Time Spent" prop="timeSpent">
          <el-input v-model="worklogForm.timeSpent" placeholder="eg. 3w 4d 12h" />
        </el-form-item>
        <el-form-item label="Started" prop="started">
          <el-input v-model="worklogForm.started" type="datetime-local" placeholder="请输入开始时间" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="worklogDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isWorklogLoading" @click="addWorklogHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep, merge, get, reduce } from 'lodash'
import wiky from 'wiky.js'

export default {
  name: 'IssueDetail',
  props: {
    issue: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      issueData: this.issue,
      activeNames: ['baseInfo', 'description', 'timeTracking'],
      isBaseInfoLoading: false,
      isWorklogLoading: false,
      isTransitionLoading: false,
      isTransitionDisabled: false,
      issueWorklogs: null,
      transitionsList: [],
      worklogDialogVisible: false,
      worklogForm: {
        timeSpent: null,
        started: null
      }
    }
  },
  computed: {
    timetracking() {
      return this.issueData.fields.timetracking
    },
    issuelinks() {
      const originalIssuelinks = get(this.issueData.fields, 'issuelinks', [])
      const issuelinksObject = reduce(
        originalIssuelinks,
        (result, obj) => {
          obj.outwardIssue && result.outwardIssue.push(obj.outwardIssue)
          obj.inwardIssue && result.inwardIssue.push(obj.inwardIssue)
          return result
        },
        { outwardIssue: [], inwardIssue: [] }
      )
      return issuelinksObject
    },
    remainingEstimatePercentage() {
      if (!this.timetracking) return 0
      const { remainingEstimateSeconds, originalEstimateSeconds } = this.timetracking
      if (!originalEstimateSeconds || !remainingEstimateSeconds) return 0
      return Math.round((remainingEstimateSeconds / originalEstimateSeconds) * 100)
    },
    timeSpentPercentage() {
      if (!this.timetracking) return 0
      const { timeSpentSeconds, originalEstimateSeconds } = this.timetracking
      if (!originalEstimateSeconds || !timeSpentSeconds) return 0
      if (timeSpentSeconds >= originalEstimateSeconds) return 100
      return Math.round((timeSpentSeconds / originalEstimateSeconds) * 100)
    },
    sprint() {
      let sprintObject = {}
      const sprintEntityString = get(this.issueData.fields, 'customfield_10710[0]', '')
      const re = new RegExp(`(\\w+)=([\\w-\\/~\\[\\]:]+)`, 'g')
      sprintEntityString.replace(re, (match, k, v) => {
        sprintObject[k] = v
      })
      return sprintObject
    },
    descriptionHtml() {
      const _description = get(this.issueData.fields, 'description')
      return _description ? wiky.process(_description, { 'link-image': false }) : null
    }
  },
  created() {
    console.log('issueData', this.issueData)
    const { fullHost } = this.$stores.get('system.loginInfo')
    this.fullHost = fullHost
    this.worklogRules = {
      timeSpent: [{ required: true, type: 'string', message: '请输入花费时间', trigger: 'blur' }],
      started: [{ required: true, type: 'string', message: '请输入开始时间', trigger: 'blur' }]
    }
    this.getIssueBaseInfo()
    this.getIssueWorklogs()
    this.getTransitionsList()
  },
  methods: {
    get,
    async getIssueBaseInfo() {
      try {
        this.isBaseInfoLoading = true
        const issueRes = await this.$jira.findIssue(this.issue.key, '', [
          'summary',
          'description',
          'timetracking',
          'status',
          'reporter',
          'created',
          'updated',
          // 'attachment',
          'customfield_10710',
          'fixVersions',
          'customfield_10208',
          'issuetype',
          'issuelinks',
          'customfield_11984',
          'customfield_11701',
          'customfield_11927',
          'customfield_11941',
          'customfield_11960',
          'customfield_11947',
          'customfield_11006'
        ])
        let _issueData = cloneDeep(this.issueData)
        merge(_issueData, issueRes)
        this.issueData = _issueData
        console.log('issueData', this.issueData)
      } catch (error) {
        this.$message({ message: error, type: 'error' })
      } finally {
        this.isBaseInfoLoading = false
      }
    },
    async getIssueWorklogs() {
      try {
        this.isWorklogLoading = true
        const { worklogs } = await this.$jira.getIssueWorklogs(this.issue.key)
        this.issueWorklogs = worklogs
        console.log('issueWorklogs', this.issueWorklogs)
      } catch (error) {
        this.$message({ message: error, type: 'error' })
      } finally {
        this.isWorklogLoading = false
      }
    },
    async getTransitionsList() {
      try {
        this.isTransitionLoading = true
        const { transitions } = await this.$jira.listTransitions(this.issue.key)
        this.transitionsList = transitions
        console.log('transitionsList', this.transitionsList)
      } catch (error) {
        this.$message({ message: error, type: 'error' })
      } finally {
        this.isTransitionLoading = false
      }
    },
    worklogFormOpen() {
      this.$set(this.worklogForm, 'timeSpent', '1d')
      this.$set(this.worklogForm, 'started', this.$dayjs().format('YYYY-MM-DDTHH:mm'))
    },
    async addWorklogHandler() {
      this.isWorklogLoading = true
      await this.$jira.addWorklog(this.issue.key, {
        started: this.formatDate(this.worklogForm.started, null, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        timeSpent: this.worklogForm.timeSpent
      })
      this.getIssueBaseInfo()
      this.getIssueWorklogs()
      this.$message({ message: 'Add worklog success.', type: 'success' })
      this.worklogDialogVisible = false
      this.isWorklogLoading = false
    },
    async transitionHandler(transition) {
      this.isTransitionDisabled = true
      await this.$jira.transitionIssue(this.issue.key, {
        transition: {
          id: transition.id
        }
      })
      this.$events.emit('my-issues:reload')
      this.$message({ message: 'Transition issue success.', type: 'success' })
      this.getIssueBaseInfo()
      this.getTransitionsList()
      this.isTransitionDisabled = false
    },
    formatDate(date, _default, formatter = 'YYYY-MM-DD HH:mm:ss') {
      if (!date) return _default
      return this.$dayjs(date).format(formatter)
    }
  }
}
</script>

<style lang="scss">
.issue-detail {
  .issue-key {
    font-size: 24px;
    font-weight: 600;
  }
  .issue-status {
    vertical-align: 4px;
    margin-left: 4px;
  }
  .issue-summary {
    font-size: 13px;
  }
  .issue-actions {
    height: 28px;
    margin-bottom: 20px;
  }
  .el-collapse-item__header {
    font-size: 14px;
    font-weight: 600;
  }
  .base-info {
    .el-row {
      padding-bottom: 12px;
    }
  }
  .worklog-table {
    width: 301px;
    margin-bottom: 10px;
  }
  .time-tracking-circle:not(:last-child) {
    margin-right: 30px;
  }
  .time-tracking-text {
    font-size: 12px;
    font-weight: 600;
  }
  .issue-links-title {
    margin: 5px;
  }
  .attachments-item {
    float: left;
    width: 120px;
    height: 120px;
    margin: 10px;
  }
}
</style>


