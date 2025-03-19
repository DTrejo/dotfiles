#!/usr/bin/env ruby
require 'csv'
require 'pp'

# fill these in:
csv_file_path = '~/Downloads/your-notion-csv.csv'
source_url = 'https://example.com/your-notion-url'
email = 'your.email@example.com'
jira_project = 'JIRA'

rows = []
CSV.foreach(csv_file_path, headers: true) do |row_raw|
  risk_reduction = row_raw['Risk reduction']
  points = row_raw['points']
  # quarter = row_raw['Quarter']
  idea_task_project = row_raw['Idea / Task / Project']
  outcome = row_raw['Outcome [TODO: add numbers in OKR style]']
  status = row_raw['Status']
  owner = row_raw['Owner (currently)']

  # Process the row data as needed
  # remove keys that are blank
  row = {
    summary: idea_task_project,
    owner: owner,
    points: points,
    description: outcome,
    risk_reduction: risk_reduction,
    status: status
  }.delete_if { |k, v| v.nil? || v.empty? }
  next if row[:status] == 'Done'
  next if row[:summary].nil? || row[:summary].empty?

  rows += [row]
end

def hash_to_key_value_string(hash)
  hash.map { |k, v| "#{k}: #{v}" }.join("\n")
end

# so we can exec/edit these one by one manually.
rows.each do |row|
  description = hash_to_key_value_string(
    row.merge(source: source_url)
  )
  description = description.gsub('"', "'")
  puts %(jira create -o summary="#{row[:summary]}" -p #{jira_project} -i Story -o assignee="#{email}" -o description="#{description}" --noedit)
  puts ""
end
puts "Will create #{rows.length} tickets."
