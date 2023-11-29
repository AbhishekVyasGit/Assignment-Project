const fs = require("fs").promises;
const axios = require("axios");

const apiUrl = "https://catfact.ninja/breeds";
const outputFile = "catBreedsData.txt";

// Declare function to save data to a file
async function responseToFile(fileName) {
  try {
    const response = await axios.get(apiUrl);
    await fs.writeFile(fileName, JSON.stringify(response.data, null, 2));
    console.log("Data has been written to", outputFile);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Declare function to get the total number of pages
async function getTotalPages(apiUrl) {
  const response = await axios.get(apiUrl);
  return response.data.last_page;
}

// Declare function to get data from ALL the pages
async function getAllPagesData(totalPages) {
  let allData = [];

  for (let page = 1; page <= totalPages; page++) {
    const response = await axios.get(`${apiUrl}?page=${page}`);
    allData = allData.concat(response.data.data);
  }

  return allData;
}

// Declare function to group data by country
function groupDataByCountry(data) {
  let groupedData = {};

  data.forEach((item) => {
    const country = item.country.trim();
    if (country) {
      if (!groupedData[country]) {
        groupedData[country] = [];
      }
      groupedData[country].push({
        breed: item.breed,
        origin: item.origin,
        coat: item.coat,
        pattern: item.pattern,
      });
    }
  });

  return groupedData;
}

// Handler function
async function getData() {
  try {
    // Step 1: Log the response to a text file
    await responseToFile(outputFile);

    // Step 2: Console log the number of pages
    const totalPages = await getTotalPages(apiUrl);
    console.log(`Number of pages: ${totalPages}`);

    // Step 3: Get data from ALL the pages
    const allData = await getAllPagesData(totalPages);
    console.log({ getAllPagesData: allData });

    // Step 4: Group data by country
    const groupedData = groupDataByCountry(allData);
    console.log(groupedData);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
getData();
