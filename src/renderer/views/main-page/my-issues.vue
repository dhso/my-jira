<template>
  <div class="my-dashboard">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Issues</el-breadcrumb-item>
      <el-breadcrumb-item>{{ issueStatus }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table v-loading="isLoading" :data="issuesData && issuesData.issues" border stripe row-key="key" height="calc(100vh - 130px)" @row-click="rowClick">
      <el-table-column type="index" fixed />
      <el-table-column label="Key" width="100" fixed>
        <template slot-scope="scope">
          <el-button size="mini" type="text">
            {{ scope.row.key }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="fields.summary" label="Summary" />
      <el-table-column prop="fields.status.name" label="Status" width="130" />
      <el-table-column prop="fields.timetracking.originalEstimate" label="Original Estimate" width="120" />
      <el-table-column prop="fields.timetracking.remainingEstimate" label="Remaining Estimate" width="130" />
    </el-table>
    <div class="issue-table-pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="issuesData && Math.ceil((issuesData.startAt + 1) / issuesData.maxResults)"
        :total="issuesData && issuesData.total"
        :page-size="issuesData && issuesData.maxResults"
        @current-change="currentChangeHandler"
        @prev-click="currentChangeHandler"
        @next-click="currentChangeHandler"
      />
    </div>
    <div :class="['drawer', { 'drawer-show': showDrawer }]" @click.self="showDrawer = !showDrawer">
      <div class="drawer-container">
        <div v-if="selectedRow">
          <issue-detail :key="selectedRow.key" :issue="selectedRow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IssueDetail from '@/components/issue-detail'

export default {
  name: 'my-issues',
  components: {
    'issue-detail': IssueDetail
  },
  data() {
    return {
      isLoading: false,
      loadingText: '拼命加载中',
      issuesData: null,
      issueStatus: null,
      showDrawer: false,
      selectedRow: null
    }
  },
  watch: {
    $route: function() {
      this.issuesData = null
      this.getIssues()
    }
  },
  created() {
    console.log('my issues')
    this.$events.on('my-issues:reload', this.getIssues)
    this.$events.on('my-issues:close-issue-detail', () => {
      this.showDrawer = false
    })
  },
  mounted() {
    this.getIssues()
  },
  methods: {
    async getIssues(startAt = 0, maxResults = 20) {
      this.isLoading = true
      const { issueStatus } = this.$route.query
      this.issueStatus = issueStatus
      this.$electron.remote.getCurrentWindow().setTitle(`${this.$electron.remote.app.getName()} - Issues - ${issueStatus}`)
      let issueStatusArr = []
      issueStatus.split(',').forEach(ele => {
        issueStatusArr.push(`"${ele.trim()}"`)
      })
      const JQl = `assignee in (currentUser()) AND status in (${issueStatusArr.join()}) ORDER BY status ASC, updated DESC`
      const fields = [
        'summary',
        'customfield_11941',
        'customfield_11960',
        'customfield_11947',
        'customfield_11006',
        'timetracking',
        'status',
        'fixVersions',
        'customfield_11957',
        // 'timeoriginalestimate',
        'issuetype',
        'customfield_11959',
        'issuelinks'
      ]
      try {
        this.issuesData = await this.$jira.searchJira(JQl, {
          maxResults,
          startAt,
          fields
        })
        // console.log(this.issuesData)
      } catch (err) {
        console.log(err)
        this.$message.error(err)
      } finally {
        this.isLoading = false
      }
    },
    rowClick(row, column, event) {
      this.showDrawer = true
      this.selectedRow = row
    },
    currentChangeHandler(page) {
      this.getIssues((page - 1) * this.issuesData.maxResults)
    }
  }
}
</script>

<style lang="scss">
.my-dashboard {
  .issue-table-pagination {
    margin-top: 12px;
    padding: 10px;
    background-color: #fff;
    border-radius: 2px;
  }
  .drawer {
    z-index: 2001;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    visibility: hidden;
    background-color: rgba(0, 0, 0, 0.3);
    .drawer-container {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 95%;
      overflow: auto;
      transform: translateX(100%);
      background-color: #fff;
      transition: transform ease-in-out 0.3s, visibility 0.3s;
      box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.15);
      padding: 16px;
      &__title {
        font-size: 18px;
        font-weight: 600;
      }
    }
    &.drawer-show {
      visibility: visible;
      .drawer-container {
        transform: translateX(0);
      }
    }
  }
}
</style>
