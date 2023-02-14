// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {Configuration, OpenAIApi} from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});//Creates an object containing the OpenAI API key for authentication.

const openai = new OpenAIApi(configuration);//Creates a new OpenAI API instance, using the configuration object created in the previous line.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
)//Exports an asynchronous function called handler that takes two parameters, an HTTP request (req) and an HTTP response (res). 
{
    const prompt = req.query.prompt; //Retrieves the value of the prompt query parameter from the request URL.

    if (!prompt) {
      return res.status(400).json({error: "Prompt missing"});
    } //Checks if the prompt parameter is missing and returns an error response with HTTP status code 400 if it is.

    if (prompt.length > 100) {
      return res.status(400).json({error: "Prompt too long"});
    }//Checks if the length of the prompt parameter is greater than 100 and returns an error response with HTTP status code 400 if it is.

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Create a gluten-free meal using the metric system with the following item as the main ingredient.\n Item:" + prompt + "\n Recipe: ",
      temperature: .5,
      max_tokens: 1000,
      presence_penalty: 0,
      frequency_penalty: 0,
    }); //Calls the OpenAI API to generate a completion, passing in the prompt, model, and other parameters to specify the behavior of the API call. The response is stored in the completion variable.

    const meal = completion.data.choices[0].text; //Extracts the generated meal recipe from the OpenAI API response.

    res.status(200).json({ meal }) //Sends an HTTP response with status code 200 and the generated meal recipe as a JSON object.

  }
