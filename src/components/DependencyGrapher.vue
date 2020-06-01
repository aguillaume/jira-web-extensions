<template>
  <div>
    <input id="jql" type="text">
    <button id="testEl" class="btn btn-danger" @click="name()">Test</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { JiraService } from '@/services/jiraService'
import { DependencyGraphDrawer } from '@/DrawingWorkers/DependencyGraphDrawer'

@Component
export default class DependencyGrapher extends Vue {
  private drawer = new DependencyGraphDrawer()

  name () {
    console.log('DependencyGrapher')
    const jqlElement = document.getElementById('jql') as HTMLInputElement
    JiraService.searchGetJql(jqlElement.value).then(jiraSearch => {
      this.drawer.worker(jiraSearch)
    })
      .catch(error => console.error('Error:', error))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
