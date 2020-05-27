<template>
  <div>
    <h1>{{ msg }}</h1>
    <br>
    {{jiraInfo}}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { JiraService } from '../services/jiraService'

@Component
export default class Dashboard extends Vue {
  @Prop() private msg!: string;
  @Prop() private jiraInfo!: string;

  getJiraInfo () {
    JiraService.searchGetJql("'Epic Link' = EPC-219")
      .then(info => { console.log(info); this.jiraInfo = JSON.stringify(info) })
  }

  // Declare mounted lifecycle hook
  mounted () {
    console.log('mounted')
    this.getJiraInfo()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
