<template>
  <div class="issue-detail">
    <p>
      <span class="issue-key">{{ issue.key }} </span>
      <el-tag class="issue-status">{{ issue.fields.status.name }}</el-tag>
    </p>
    <div class="issue-actions" v-loading="isTransitionLoading">
      <i v-show="isLoading" class="el-icon-loading"></i>
      <el-button-group class="" v-show="!isLoading">
        <el-button
          type="primary"
          size="mini"
          v-for="transition in transitionsList"
          :disabled="issue.fields.status.name === transition.name"
          :key="transition.id"
          @click="transitionHandler(transition)"
        >
          {{ transition.name }}
        </el-button>
      </el-button-group>
    </div>
    <el-collapse v-model="activeNames" :accordion="false">
      <el-collapse-item title="Summary" name="summary">
        <p>{{ issue.fields.summary }}</p>
      </el-collapse-item>
      <el-collapse-item title="Worklogs" name="worklogs">
        <i v-show="isLoading" class="el-icon-loading"></i>
        <div v-show="!isLoading">
          <el-table :data="issueWorklogs" border stripe :fit="false" class="worklog-table">
            <el-table-column prop="date" label="Date" width="140">
              <template slot-scope="scope">
                <span>{{ $dayjs(scope.row.started).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="timeSpent" label="Time Spent" width="160"> </el-table-column>
          </el-table>
          <el-button type="text" icon="el-icon-circle-plus" size="mini" @click="worklogDialogVisible = true">Add worklog</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="Add Worklog" :visible.sync="worklogDialogVisible" width="420px" append-to-body center @open="worklogFormOpen">
      <el-form :model="worklogForm" :rules="worklogRules" ref="worklogForm" label-width="100px" :hide-required-asterisk="true" class="worklog-form">
        <el-form-item label="timeSpent" prop="timeSpent">
          <el-input v-model="worklogForm.timeSpent" placeholder="eg. 3w 4d 12h"></el-input>
        </el-form-item>
        <el-form-item label="started" prop="started">
          <el-input type="datetime-local" v-model="worklogForm.started" placeholder="请输入开始时间"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="worklogDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addWorklogHandler" :loading="isAddworklogLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'issue-detail',
  props: {
    issue: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isLoading: true,
      isAddworklogLoading: false,
      isTransitionLoading: false,
      activeNames: ['summary', 'worklogs'],
      issueWorklogs: null,
      transitionsList: [],
      worklogDialogVisible: false,
      worklogForm: {
        timeSpent: null,
        started: null
      }
    }
  },
  async created() {
    this.worklogRules = {
      timeSpent: [{ required: true, type: 'string', message: '请输入花费时间', trigger: 'blur' }],
      started: [{ required: true, type: 'string', message: '请输入开始时间', trigger: 'blur' }]
    }
    try {
      this.isLoading = true
      await this.getIssueWorklogs()
      await this.getTransitionsList()
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    async getIssueWorklogs() {
      const { worklogs } = await this.$jira.getIssueWorklogs(this.issue.key)
      this.issueWorklogs = worklogs
    },
    async getTransitionsList() {
      const { transitions } = await this.$jira.listTransitions(this.issue.key)
      this.transitionsList = transitions
      console.log(this.transitionsList)
    },
    worklogFormOpen() {
      this.$set(this.worklogForm, 'timeSpent', '1d')
      this.$set(this.worklogForm, 'started', this.$dayjs().format('YYYY-MM-DDTHH:mm'))
    },
    async addWorklogHandler() {
      this.isAddworklogLoading = true
      await this.$jira.addWorklog(this.issue.key, {
        started: this.$dayjs(this.worklogForm.started).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        timeSpent: this.worklogForm.timeSpent
      })
      await this.getIssueWorklogs()
      this.$message.success('Add worklog success.')
      this.worklogDialogVisible = false
      this.isAddworklogLoading = false
    },
    async transitionHandler(transition) {
      this.isTransitionLoading = true
      await this.$jira.transitionIssue(this.issue.key, {
        transition: {
          id: transition.id
        }
      })
      this.$events.emit('my-issues:reload')
      this.$message.success('Transition issue success.')
      this.$events.emit('my-issues:close-issue-detail')
      this.isTransitionLoading = false
    }
  },
  watch: {
    issue: (nVal, oVal) => {
      console.log(nVal, oVal)
    }
  }
}
</script>

<style lang="scss">
.issue-detail {
  .issue-key {
    font-size: 26px;
    font-weight: 600;
  }
  .issue-actions {
    margin-bottom: 20px;
  }
  .issue-status {
    vertical-align: 4px;
  }
  .el-collapse-item__header {
    font-size: 14px;
    font-weight: 600;
  }
  .worklog-table {
    width: 300px;
    margin-bottom: 10px;
  }
}
</style>


