const axios = require('axios')

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

const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
        },
        headers: {
            'x-rapidapi-key': '75d5c3c287msh290626c01743cd3p1c9864jsna922a9668ac5',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return await fetchData();
}

module.exports = { getLanguageById, submitBatch }