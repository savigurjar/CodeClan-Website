const getLanguageById = (lang) => {
    const language = {
        "python": 109,
        "c++": 105,
        "c": 103,
        "javascript": 102,
        "java": 91
    }
    return language[lang.toLowerCase()]
}

module.exports = {getLanguageById}