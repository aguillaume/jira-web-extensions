import AppConfig from '../appSettings.json'
import { JiraGetSearch } from '@/typings/JiraTypes'

export class JiraService {
  static async searchGetJql (jql: string): Promise<JiraGetSearch> {
    const jqlEncoded = encodeURIComponent(jql)

    const headers = new Headers({
      Authorization: `Basic ${btoa(AppConfig.username + ':' + AppConfig.password)}`
    })

    const strResponse = await fetch(`http://jirarequester.com/api/JiraRequester?jiraQ=${jqlEncoded}`, {
      method: 'get',
      mode: 'cors',
      headers: headers
    })

    const jsonResponse = await strResponse.json()
    console.log('Success Json:', jsonResponse)
    return jsonResponse as JiraGetSearch
  }
}
