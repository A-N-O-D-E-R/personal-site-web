import { useQuery } from '@tanstack/react-query'
import { getExperiences } from '../services/experiences'
import { getProjects } from '../services/projects'
import data from '../data/const.json'

export default function CV() {
  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: getExperiences
  })
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  const workExperiences = experiences.filter(e => e.type === 'work').slice(0, 4)
  const education = experiences.filter(e => e.type === 'study').slice(0, 2)
  const topProjects = projects.slice(0, 3)

  const skills = Array.from(new Set([
    ...experiences.flatMap(e => e.tech || []),
    ...projects.flatMap(p => p.tech)
  ])).slice(0, 15)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-full">
        {/* Print button */}
        <div className="p-4 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download PDF / Print
          </button>
        </div>

        {/* CV Content */}
        <div className="cv-content p-8 print:p-0">
          {/* Header */}
          <header className="mb-6 pb-4 border-b-2 border-gray-800 print:mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Arthur RENAUX</h1>
            <div className="flex flex-wrap gap-4 text-base text-gray-700">
              <span>📧 {data.email}</span>
              <span>🔗 github.com/{data['github-profile']}</span>
              <span>💼 linkedin.com/in/{data['linkdin-profile']}</span>
            </div>
          </header>

          {/* Summary */}
          <section className="mb-5 print:mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 print:mb-2">Professional Summary</h2>
            <p className="text-base text-gray-700">
              Full-stack software engineer with expertise in building scalable web applications,
              3D graphics, and cloud infrastructure. Experienced in modern frameworks and DevOps practices.
            </p>
          </section>

          {/* Skills */}
          <section className="mb-5 print:mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 print:mb-2">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Work Experience */}
          <section className="mb-5 print:mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 print:mb-2">Work Experience</h2>
            {workExperiences.map(exp => (
              <div key={exp.id} className="mb-4 print:mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-600">{exp.period}</span>
                </div>
                <div className="text-base text-gray-700 mb-1">
                  {exp.company} • {exp.location}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                {exp.tech && exp.tech.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    <strong>Tech:</strong> {exp.tech.slice(0, 8).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="mb-5 print:mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 print:mb-2">Education</h2>
            {education.map(edu => (
              <div key={edu.id} className="mb-3 print:mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base text-gray-900">{edu.title}</h3>
                  <span className="text-sm text-gray-600">{edu.period}</span>
                </div>
                <div className="text-base text-gray-700">{edu.company} • {edu.location}</div>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-400 print:mb-2">Notable Projects</h2>
            {topProjects.map(proj => (
              <div key={proj.id} className="mb-2">
                <h3 className="font-bold text-gray-900 text-base">{proj.title}</h3>
                <p className="text-sm text-gray-600">{proj.description}</p>
                {proj.stars && proj.stars > 0 && (
                  <span className="text-sm text-yellow-600">★ {proj.stars}</span>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
