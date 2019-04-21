<template>
  <div class="my-issues">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Jira</el-breadcrumb-item>
      <el-breadcrumb-item>My Issues</el-breadcrumb-item>
    </el-breadcrumb>

    <el-collapse class="filters">
      <el-collapse-item name="1">
        <template v-slot:title>
          <span>Filters</span>
        </template>
        <el-form label-width="80px" label-position="left">
          <el-form-item label="Status:">
            <el-checkbox-group v-model="selectedIssueStatus">
              <el-checkbox v-for="issueStatus in issueStatuses" :key="issueStatus" :label="issueStatus" />
              <el-button type="text" @click.native="unselectAllIssueStatusClickHandler">
                Unselect All
              </el-button>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-table
      ref="issuesTable"
      v-loading="isLoading"
      element-loading-text="拼命加载中, 请耐心等待"
      :data="issuesData && issuesData.issues"
      class="issues-table"
      border
      stripe
      row-key="key"
      height="calc(100vh - 170px)"
      @row-click="rowClick"
    >
      <el-table-column type="index" :index="issuesData && issuesData.startAt + 1" fixed />
      <el-table-column label="Key" width="100" fixed>
        <template slot-scope="scope">
          <el-button size="mini" type="text">
            {{ scope.row.key }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="fields.summary" label="Summary" />
      <el-table-column label="Status" width="130">
        <template slot-scope="scope">
          <span :class="['status-text', `color-${scope.row.fields.status.statusCategory.colorName}`]">{{ scope.row.fields.status.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Time To Test" width="130">
        <template slot-scope="scope">
          {{ $dayjs(scope.row.fields.customfield_11927).format('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
    </el-table>

    <div class="issue-table-pagination">
      <el-pagination
        background
        layout="prev, pager, next,slot, ->, total"
        :current-page="issuesData && Math.ceil((issuesData.startAt + 1) / issuesData.maxResults)"
        :total="issuesData && issuesData.total"
        :page-size="issuesData && issuesData.maxResults"
        @current-change="currentChangeHandler"
        @prev-click="currentChangeHandler"
        @next-click="currentChangeHandler"
      >
        <template v-slot>
          <el-button class="pagination-btn" icon="el-icon el-icon-refresh" :disabled="isLoading" @click="currentReloadHandler" />
        </template>
      </el-pagination>
    </div>
    <drawer-container :visible="issueDetailVisible" width="600px" @click.self="issueDetailVisible = false">
      <template v-slot:content>
        <issue-detail v-if="selectedRow" :key="selectedRow.key" :issue="selectedRow" />
      </template>
    </drawer-container>
  </div>
</template>

<script>
import IssueDetail from '@/components/issue-detail'
import drawerContainer from '@/components/drawer-container'

export default {
  name: 'my-issues',
  components: {
    'issue-detail': IssueDetail,
    'drawer-container': drawerContainer
  },
  data() {
    return {
      isLoading: false,
      loadingText: '拼命加载中',
      issuesData: null,
      issueDetailVisible: false,
      selectedRow: null,
      selectedIssueStatus: []
    }
  },
  watch: {
    selectedIssueStatus() {
      this.$events.emit('my-issues:load')
    }
  },
  created() {
    console.log('my issues')
    this.issueStatuses = ['TBD', 'In Development', 'Ready to Test', 'In Testing', 'Done', 'Open', 'Reopened', 'In Progress', 'Resolved', 'Closed']
    this.$events.on('my-issues:load', (args = {}) => this.getIssues(args))
    this.$events.on('my-issues:reload', () =>
      this.getIssues({
        startAt: this.issuesData.startAt
      })
    )
    this.$events.on('my-issues:close-issue-detail', () => {
      this.issueDetailVisible = false
    })
  },
  mounted() {
    this.$events.emit('my-issues:load')
  },
  beforeDestroy() {
    this.$events.off('my-issues:load')
    this.$events.off('my-issues:reload')
    this.$events.off('my-issues:close-issue-detail')
  },
  methods: {
    async getIssues({ startAt = 0, maxResults = 20 }) {
      this.isLoading = true
      let JQl = `assignee in (currentUser())`
      if (this.selectedIssueStatus.length > 0) {
        let issueStatusStrArr = []
        this.selectedIssueStatus.forEach(ele => {
          issueStatusStrArr.push(`"${ele.trim()}"`)
        })
        JQl += ` AND status in (${issueStatusStrArr.join()})`
      }
      JQl += ` ORDER BY updated DESC`
      const fields = ['summary', 'status', 'customfield_11927']
      try {
        this.issuesData = await this.$jira.searchJira(JQl, {
          maxResults,
          startAt,
          fields
        })
        console.log('issuesData', this.issuesData)
      } catch (err) {
        this.$message({ message: err, type: 'error' })
      } finally {
        this.$refs.issuesTable.bodyWrapper.scrollTop = 0
        this.isLoading = false
      }
    },
    rowClick(row, column, event) {
      this.selectedRow = row
      this.issueDetailVisible = true
    },
    currentChangeHandler(page) {
      this.$events.emit('my-issues:load', {
        startAt: (page - 1) * this.issuesData.maxResults
      })
    },
    currentReloadHandler() {
      this.$events.emit('my-issues:reload')
    },
    unselectAllIssueStatusClickHandler() {
      this.selectedIssueStatus = []
    }
  }
}
</script>

<style lang="scss">
.my-issues {
  .filters {
    .el-collapse-item__header {
      padding: 0 10px;
      border-bottom: 1px solid #ebeef5;
    }
    .el-collapse-item__wrap {
      padding: 16px;
    }
    .el-form-item__label {
      font-weight: 600;
    }
  }
  .issues-table {
    border: none;
    .status-text {
      font-weight: 600;
    }
    &.el-table--border:after,
    &.el-table--group:after,
    &.el-table:before {
      background-color: #fff;
    }
  }
  .issue-table-pagination {
    padding: 10px;
    background-color: #fff;
    .pagination-btn {
      background-color: #f4f4f5;
      color: #606266;
      margin: 0 5px;
      min-width: 30px;
      border-radius: 2px;
      padding: 0;
      &:not(:disabled):hover {
        color: #409eff;
      }
    }
  }
}
</style>
