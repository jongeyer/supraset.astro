/** Site identity: the tagline and the person the site is about. */
export const siteName = 'Supraset'
export const tagline = 'Engineer, Designer, Data Explorer'

export const person = {
  name: 'Jonathan Geyer',
  jobTitle: 'Lead Front-end Engineer',
  email: 'jon@supraset.com',
  sameAs: [
    'https://www.linkedin.com/in/jongeyer/',
    'https://github.com/jongeyer',
  ],
  knowsAbout: [
    'Front-end engineering',
    'Data visualization',
    'Dashboard applications',
    'Data management',
    'Design',
  ],
  alumniOf: ['University of Chicago', 'Parsons School of Design'],
}

/** schema.org structured data for the site and its author. */
export const structuredData = (siteURL: URL) => {
  const personId = new URL('#person', siteURL).href
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': new URL('#website', siteURL).href,
        url: siteURL.href,
        name: siteName,
        author: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: person.name,
        url: siteURL.href,
        jobTitle: person.jobTitle,
        email: `mailto:${person.email}`,
        sameAs: person.sameAs,
        knowsAbout: person.knowsAbout,
        alumniOf: person.alumniOf.map(name => ({
          '@type': 'CollegeOrUniversity',
          name,
        })),
      },
    ],
  }
}
