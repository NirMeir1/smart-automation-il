// src/components/Integrations.tsx
export default function Integrations() {
  const tools = ['Salesforce', 'HubSpot', 'Google Workspace', 'Microsoft 365', 'Slack', 'Monday.com', 'Zapier', 'Make']
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">אינטגרציות נתמכות</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {tools.map((tool, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}