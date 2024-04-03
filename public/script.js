/*import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

// Function to process prompts and call OpenAI APIs for chat and image generation
async function processPrompts(inputArray) {
  // Convert the JSON array to a string prompt
  const prompt = inputArray.join(' '); // Join array elements into a string prompt

  try {
    // For chat completion
    const response = await openAi.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    })
    console.log(response.data.choices[0].message.content)

    /*const chatResponse = await openAi.createCompletion({
      model: "gpt-4", // Adjust the model as needed
      prompt: prompt,
    });
    console.log("Chat response:", chatResponse.data);

    // For image generation
    const imageResponse = await openAi.createImage({
      model: "dall-e-3",
      prompt: prompt,
      // Additional parameters might be needed according to the method's requirements
    });
    console.log("Image response:", imageResponse.data);
  } catch (error) {
    console.error("Error in API call:", error);
  }
}


async function processPrompts(option, inputArray, question) {
  // Convert the JSON array to a string or process it as needed
  //const input = inputArray.split(',');
  const jsonData = inputArray.join(' '); // Example of joining array elements
  
  // Combine the processed JSON data with the question to form the prompt
  const prompt = `${jsonData} ${question}`;
  
  try {
    if (option === "chat") {
      // For chat completion
      const response = await openAi.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      });
      //console.log(response.data.choices[0].message.content);  
      return response.data.choices[0].message.content;
    } else if (option === "image") {
      // For image generation
      const imageResponse = await openAi.createImage({
        model: "dall-e-3",
        prompt: prompt,
        // Adjust additional parameters as needed
      });
      //console.log("Image response:", imageResponse.data);
      return imageResponse.data;
    } else {
      console.error("Invalid option specified.");
    }
  } catch (error) {
    console.error("Error in API call:", error);
  }
}

/*const option = "chat"; // or "image"
const inputArray = [
  '6606d7ee13bd0b4b4478cdd0', 'Benedict Branch', 'elit.pharetra@ems.com', '1-263-321-1812', 'Accounting',
'6606d7ee13bd0b4b4478cdd1', 'Cameron Rivera', 'non.hendrerit@sems.com', '1-552-658-6165', 'Human Resources']; // Example JSON array
const question = "provide count of sems.com ?"; // Example prompt question
//processPrompts(option, inputArray, question);

export { processPrompts };
window.processPrompts = processPrompts;*/

/*import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);*/


require('dotenv').config();

// Require the openai package
const openai = require('openai');

// Create a new instance of OpenAIApi using the Configuration class
/*const openAi = new openai.OpenAIApi(new openai.Configuration({
  apiKey: process.env.API_KEY,
}));*/

const openAi = new openai({
  apiKey: process.env.API_KEY // This is also the default, can be omitted
});

// The processPrompts function remains mostly unchanged, just ensure it's called after openAi is initialized
async function processPrompts(option, inputArray, question) {
  // Convert the JSON array to a string or process it as needed
  const jsonData = inputArray.join(' '); // Example of joining array elements

  // Combine the processed JSON data with the question to form the prompt
  const prompt = `${jsonData} ${question}`;

  try {
    if (option === "chat") {
      // For chat completion
      const response = await openAi.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      });
      return response.choices[0].message.content;
    } else if (option === "image") {
      // For image generation
      const imageResponse = await openAi.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        // Adjust additional parameters as needed
      });
      // Assuming imageResponse is the response from OpenAI API and has the structure shown in the screenshot
      const imageUrl = imageResponse.data[0].url; // Use the correct path to access the URL
      console.log('Image URL:', imageUrl);
      return imageUrl; // This will be the string URL of the image
      /*const imageurl = imageResponse.urls[0];
      return imageurl;*/
    } else {
      console.error("Invalid option specified.");
    }
  } catch (error) {
    console.error("Error in API call:", error);
  }
}

module.exports = { processPrompts };
//export { processPrompts };
