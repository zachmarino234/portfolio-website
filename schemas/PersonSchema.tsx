import Script from 'next/script'

export function PersonSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Zach Marino',
        url: 'https://zmarino.com',
        jobTitle: 'UX Designer & Web Developer',
        description: 'Multi-hyphenate UX designer and web developer focused on media and entertainment',
        alumniOf: [
            {
                '@type': 'EducationalOrganization',
                name: 'Northeastern University',
                description: 'Masters in Experience Design',
            },
        ],
        worksFor: [
            {
                '@type': 'Organization',
                name: 'No Pool Productions',
                description: 'Freelance Brand Designer & Developer',
            },
        ],
        knowsAbout: [
            'Experience Design',
            'Brand Experience',
            'Product Design',
            'Web Development',
            'Product Management',
            'UI/UX Design',
            'Front-end Development',
        ],
        sameAs: [
            'https://www.linkedin.com/in/zach-marino/',
            'https://github.com/zachmarino234',
            'https://www.behance.net/zacharymarino',
        ],
    }

    return (
        <Script
            id="person-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}