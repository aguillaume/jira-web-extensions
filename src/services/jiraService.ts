import AppConfig from '../appSettings.json'
import { JiraGetSearch, JiraIssue, JiraIssueFields, JiraIssueStatus, JiraIssueStatusCategory } from '@/typings/JiraTypes'

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

  static makeDummyJiraIssue (issueName: string) {
    const statusCategory: JiraIssueStatusCategory = {
      name: 'dummy'
    }

    const status: JiraIssueStatus = {
      name: 'dummyStatus',
      statusCategory: statusCategory
    }

    const dummyFields: JiraIssueFields = {
      summary: `dummy summary for ${issueName}`,
      customfield_10302: '', /* eslint-disable-line */
      customfield_10700: 'dummy epic', // eslint-disable-line
      /* eslint-disable-next-line */
      issuelinks: [],
      status: status,
      labels: []
    }

    const dummyIssue: JiraIssue = {
      key: issueName,
      fields: dummyFields
    }

    return dummyIssue
  }
}
