import axios from 'axios';

/**
 * Function to search CDNJS for libraries
 * @param {string} query - The search query for the library
 * @returns {Promise<Array>} - A promise that resolves with an array of results
 */
async function searchCdnjs(query) {
    try {
        const response = await axios.get(`https://api.cdnjs.com/libraries?search=${query}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching data from CDNJS:', error);
        return [];
    }
}

/**
 * Main function to integrate with a GROQ API call
 */
async function main() {
    const query = 'react'; // Example query; replace this with dynamic input if needed

    console.log(`Searching CDNJS for libraries matching "${query}"...`);

    const results = await searchCdnjs(query);

    if (results.length === 0) {
        console.log('No results found.');
        return;
    }

    console.log(`Found ${results.length} libraries. Here are the top results:`);
    results.slice(0, 5).forEach((lib, index) => {
        let version = lib.latest.match(/\/([0-9\.]+)\//)[1];
        console.log(`${index + 1}. Name: ${lib.name}, Latest Version: ${version}`);
    });

    // Simulate an AI choosing a library
    const chosenLibrary = results[0]; // Example: Picking the first result
    console.log(`\nChosen library: ${chosenLibrary.name}`);

    // Use the chosen library in the GROQ API call
    // Here you would integrate it with your GROQ logic as needed
    console.log('Integrating the chosen library with GROQ API call (stubbed).');
}

// Run the main function
main();
