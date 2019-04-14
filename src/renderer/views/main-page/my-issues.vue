<template>
  <div class="my-dashboard">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Issues</el-breadcrumb-item>
      <el-breadcrumb-item>{{ issueStatus }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="issuesData && issuesData.issues" border stripe v-loading="isLoading" row-key="key" @row-click="rowClick">
      <el-table-column type="index" fixed> </el-table-column>
      <el-table-column label="Key" width="100" fixed>
        <template slot-scope="scope">
          <el-button size="mini" type="text">{{ scope.row.key }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="fields.summary" label="Summary"> </el-table-column>
      <el-table-column prop="fields.timetracking.originalEstimate" label="Original Estimate" width="120"> </el-table-column>
      <el-table-column prop="fields.timetracking.remainingEstimate" label="Remaining Estimate" width="130"> </el-table-column>
    </el-table>
    <div :class="['drawer', { 'drawer-show': showDrawer }]" @click.self="showDrawer = !showDrawer">
      <div class="drawer-container">
        <div v-if="selectedRow">
          <issue-detail :issue="selectedRow" :key="selectedRow.key" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IssueDetail from '@/components/issue-detail'

export default {
  name: 'my-dashboard',
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
  created() {
    console.log('my issues')
    console.log(this)
    this.$events.on('my-issues:reload', this.getIssues)
    this.$events.on('my-issues:close-issue-detail', () => {
      this.showDrawer = false
    })
  },
  mounted() {
    this.getIssues()
  },
  methods: {
    async getIssues() {
      this.isLoading = true
      const { issueStatus } = this.$route.query
      this.issueStatus = issueStatus
      this.$electron.remote.getCurrentWindow().setTitle(`${this.$electron.remote.app.getName()} - Issues - ${issueStatus}`)
      const JQl = `assignee in (currentUser()) AND status in ("${issueStatus}") ORDER BY status ASC, updated DESC`
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
      this.issuesData = await this.$jira.searchJira(JQl, {
        maxResults: 10,
        fields
      })
      console.log(this.issuesData)

      this.isLoading = false
    },
    rowClick(row, column, event) {
      console.log(row)
      this.showDrawer = true
      this.selectedRow = row
    }
  },
  watch: {
    $route: 'getIssues'
  }
}
</script>

<style lang="scss">
.my-dashboard {
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
