import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'
import { JiraGetSearch } from '@/typings/JiraTypes'
import { DataExtractor } from './DataExtractor'
import { GUI } from 'dat.gui'

interface Dictionary<T> {
    [Key: string]: T;
}

interface LooseObject {
  [key: string]: any; // eslint-disable-line
}

export class DependencyGraphDrawer {
    guiMenu!: GUI
    guiTicketColour!: GUI;
    objTicketColour: LooseObject = {}

    constructor (gui?: GUI) {
      if (gui) this.guiMenu = gui // gui.addFolder('Ticket Colour');
    }

    worker (data: JiraGetSearch) {
      console.log(`starting ${name}.worker`)
      try {
        try {
          this.guiMenu.removeFolder(this.guiTicketColour)
        } catch (error) {
          console.log('there is no folder. do nothing.')
        } finally {
          this.guiTicketColour = this.guiMenu.addFolder('Ticket Colour')
        }

        const labels = DataExtractor.populateLabels(data)
        const arrayLabels = Array.from(labels) as string[]
        for (let i = 0; i < arrayLabels.length; i++) {
          const value = this.removeWhiteSpace(arrayLabels[i]) as any // eslint-disable-line
          this.objTicketColour[value] = '#dc3545'
          this.guiTicketColour.addColor(this.objTicketColour, value).onChange((colour) => {
            const x = document.getElementsByClassName(value)
            for (let i = 0; i < x.length; i++) {
              const element = x[i].children[0] as HTMLElement
              element.style.fill = colour
            }
          })
        }
      } catch (error) {
        console.log('DOT GUI ERRORS... :/')
        console.log(error)
      }

      // Display what the lebels are
      // var elemLabels = d3.select(".labels").selectAll("li").data<string>(Array.from(labels));
      // var elemLabelsEnter = elemLabels.enter().append("li").text(function(d) { return d });

      // Create a new directed graph
      const g = new dagreD3.graphlib.Graph().setGraph({
        ranksep: 100
      })

      // Get Array of Nodes from data
      const nodesAndLnks = DataExtractor.getNodesAndLinks(data)

      // States and transitions from RFC 793
      // const states = nodesAndLnks.nodes

      // Automatically label each of the nodes
      data.issues.forEach((issue) => {
        let issueLables = ''
        for (const label of issue.fields.labels) {
          issueLables += `${label} `
        }
        const spText = (issue.fields.customfield_10302) ? issue.fields.customfield_10302 : 'n/a'
        g.setNode(issue.key, { label: `${issue.key} sp: ${spText}`, class: `${issue.fields.customfield_10700} ${issueLables} ${this.removeWhiteSpace(issue.fields.status.name)}` /* style: `fill: ${epicFillColur[issue.fields.customfield_10700]}` */ })
        // g.node(issue.key).style = "fill: #f77";
      })

      // Set up the edges
      nodesAndLnks.links.forEach((link: { source: string; target: string }) => {
        g.setEdge(link.source, link.target, { label: 'depends on' })
      })

      // Set some general styles
      g.nodes().forEach(function (v) {
        const node = g.node(v)
        node.rx = node.ry = 5 // round corner of box
      })

      // Clear the screen if there is alreayd something there
      if (document.getElementsByTagName('worker1')[0] !== undefined) document.getElementsByTagName('worker1')[0].remove()

      const svg = d3.select('body').append('worker1').append('svg')
      svg.attr('width', window.innerWidth)
      const inner = svg.append('g')

      // Set up zoom support
      const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', function () {
        inner.attr('transform', d3.event.transform)
      })

      svg.call(zoom)

      // Set up resize support
      function updateWindow () {
        const wHeight = window.innerHeight
        const adjustedHeight = wHeight - document.getElementsByClassName('container')[0].clientHeight
        svg.attr('width', window.innerWidth)
          .attr('height', adjustedHeight)
      }
      d3.select(window).on('resize.updatesvg', updateWindow)

      // Create the renderer
      const render = new dagreD3.render() // eslint-disable-line

      // Run the renderer. This is what draws the final graph.
      // eslint-disable-next-line
      render(inner as any, g)

      // Center the graph
      const initialScale = 0.75
      // eslint-disable-next-line
      svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr('width') as any - g.graph().width * initialScale) / 2, 20).scale(initialScale))

      const wHeight = window.innerHeight
      const adjustedHeight = wHeight - document.getElementsByClassName('container')[0].clientHeight
      svg.attr('height', adjustedHeight)
    }

    removeWhiteSpace (value: string): string {
      return value.replace(/ /g, '').replace(/\//g, '')
    }
};
