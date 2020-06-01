<template>
  <div class="container">
    <h1 id="pageTitle">Jira Dependency Mapper</h1>
    <DependencyGrapher />
    <DatGui />
  </div>
</template>

<script>
// @ is an alias to /src
import DependencyGrapher from '@/components/DependencyGrapher.vue'
import DatGui from '@/components/DatGui.vue'

export default {
  name: 'dependencyGrapher',
  components: {
    DependencyGrapher,
    DatGui
  }
}
</script>
