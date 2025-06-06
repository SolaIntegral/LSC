module.exports = {
    rules: [
        {
            id: 'color-contrast',
            enabled: true,
        },
        {
            id: 'document-title',
            enabled: true,
        },
        {
            id: 'html-has-lang',
            enabled: true,
        },
        {
            id: 'image-alt',
            enabled: true,
        },
        {
            id: 'link-name',
            enabled: true,
        },
        {
            id: 'meta-viewport',
            enabled: true,
        },
        {
            id: 'page-has-heading-one',
            enabled: true,
        },
        {
            id: 'skip-link',
            enabled: true,
        },
    ],
    resultTypes: ['violations', 'incomplete'],
    selectors: true,
    ancestry: true,
    xpath: true,
    frameWaitTime: 1000,
    iframeTimeout: 1000,
    performanceTimer: true,
    pingWaitTime: 500,
}; 