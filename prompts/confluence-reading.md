# Confluence
Ensure `jira --help` (go-jira) is installed.
# Download doc
Substite $SUBDOMAIN and $DOC_ID appropriately.
```sh
jira request \
    -e https://$SUBDOMAIN.atlassian.net/wiki \
    '/rest/api/content/$DOC_ID?expand=body.markdown,title' \
    --gjq body.markdown.value

  jira request \
    -e https://$SUBDOMAIN.atlassian.net/wiki \
    '/rest/api/content/$DOC_ID?expand=body.storage,title,version'
```
