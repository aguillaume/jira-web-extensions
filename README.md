# Jira Web Extension
This is a project that puts a UI on Jira data pulled from a jira server. In order to avoid CORs issues this project uses a jira-proxy REST Service that calls to the service and returns the data to the web app. 

## Project setup
This project is configured to have the jira proxy as a dependency. https://git-scm.com/book/en/v2/Git-Tools-Submodules is a great intro page to get familiar with out git submodules work. 

### Set Up the Jira Proxy
See the Readme Project SetUp at: https://github.com/aguillaume/jira-proxy/blob/master/README.md

### Set Up the Jira Web Extension
install the npm dependencies by running:
```
npm install
```
Compiles and hot-reloads for development
```
npm run serve
```


# Other npm commands
## Compiles and minifies for production
```
npm run build
```

## Run your unit tests
```
npm run test:unit
```

## Run your end-to-end tests
```
npm run test:e2e
```

## Lints and fixes files
```
npm run lint
```

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
