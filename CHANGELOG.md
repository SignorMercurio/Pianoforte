# Changelog

## v0.1.0

- New
  - feat(User, Project): Add basic models and apis for User and Project
  - feat(Login): Add basic login feature based on OAuth2
  - style(Login): Minor UI adjustment
  - feat(Project): Add basic project management for API testing
  - feat(Asset): Add basic logic of asset discovery
  - feat(Domain): Add basic logic of subdomain enumeration
  - feat(Asset, Domain): Capture enter key & Make all sorts of scanning async
  - feat(Port): Add basic logic of port scanning
  - style(Asset, Domain, Port): Add tooltips for buttons
  - feat(Port): Experimenting cmd line args
  - feat(Dir): Add basic logic of directory bruteforcing
  - feat(Finger): Add basic logic of application fingerprinting
  - feat(Endpoint): Add basic logic of endpoint discovery
  - feat(Vuln): Add basic logic of vulnerability scanning & Refactor code to use Vue3
  - feat(Settings): Enable users to CRUD the settings
  - feat(Asset, Domain, Port, Project): Add simple ECharts for scan results
  - feat(Vuln): Add Request-Response view for detailed inspection
  - feat(Asset, Domain): Add simple data-sharing logic
  - feat(\*): Data exporting now available

## v0.2.0

- Fix

  - fix(ExportBtn): Eliminate build errors when destructuring props

- New
  - refactor(Settings): Adjust UI & Rename arguments
  - feat(Domain, Port): Add more OSINT tools to achieve better accuracy
  - feat(Asset): Use httpx for asset discovery
  - refactor(\*): Adjust UI & Add new component
