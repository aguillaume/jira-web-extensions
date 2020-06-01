<template>
  <div ref='datGui'></div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { GUI } from 'dat.gui'

@Component
export default class DatGui extends Vue {
  initDatGui () {
    // const datGuiElement = this.$refs.datGui
    const gui: GUI = new GUI({ width: 300 }) // why default?
    const obj = {
      pageTitle: 'Jira Dependency Mapper',
      testColour: '#dc3545'
    }

    gui.remember(obj)
    gui.add(obj, 'pageTitle').onChange(text => {
      const pageTitle = document.getElementById('pageTitle')
      if (pageTitle != null) pageTitle.innerHTML = text
    })
    gui.add(obj, 'displayOutline')
    gui.addColor(obj, 'testColour').onChange(colour => {
      const x = document.getElementsByClassName('QAPending')
      for (let i = 0; i < x.length; i++) {
        const element = x[i].children[0] as HTMLElement
        element.style.fill = colour
      }
    })
  }

  // Declare mounted lifecycle hook
  mounted () {
    console.log('Dat Gui mounted')
    this.initDatGui()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
