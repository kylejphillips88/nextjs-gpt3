import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import mainImage from '@/assets/images/main_image.jpg'
import { Form, Button, Spinner } from 'react-bootstrap'
import {FormEvent, useState} from 'react'

export default function Home() {

  //three state variables using the useState hook that will be used to manage the state of the meal, meal loading status, and meal loading errors.
  const [meal, setMeal] = useState("");
  const [mealLoading, setMealLoading] = useState(false);
  const [mealLoadingError, setMealLoadingError] = useState(false);

  //handle the form submit event
  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    //Prevents the default behavior of the form submit event.
    e.preventDefault();
    //Creates a new FormData object using the form data from the HTMLFormElement target.
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();

    if (prompt) { //If prompt field has a value
      try {
        setMeal(""); //Resets the state variables for meal, meal loading status, and meal loading errors before making the API request.
        setMealLoadingError(false);
        setMealLoading(true);

        const response = await fetch("/api/meals?prompt=" + encodeURIComponent(prompt));//Sends an API request to the /api/meals endpoint with the encoded prompt as a query parameter.
        //Parses the response body as JSON and sets the meal state variable to the value of the meal property in the response body.
        const body = await response.json();
        setMeal(body.meal);

      } catch (error){
        console.error(error)
        setMealLoadingError(true);
      } finally{
        setMealLoading(false);
      } //Catches and logs any errors that occur during the API request, sets the mealLoadingError state variable to true, and sets the mealLoading state variable to false.
    }

  }

  return (
    <>
      <Head>
        <title>AI Project</title>
        <meta name="description" content="by Kyle Phillips" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Gluten-Free Recipe AI</h1>
        <h2>powered by GPT-3</h2>
        <div>Enter a food item and AI will generate a gluten-free recipe using that item</div>
        <div className={styles.mainImageContainer}>
        <Image 
        src={mainImage}
        fill
        alt='Picture of chef holding bowl of hummus in one hand and chickpeas in the other'
        priority
        className={styles.mainImage}
        />
        </div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className='mb-3' controlId='prompt-input'>
            <Form.Label>Create a gluten-free meal using...</Form.Label>
            <Form.Control
            name='prompt'
            placeholder= 'e.g. lamb, asparagus, eggs'
            maxLength={100}
            />
          </Form.Group>
          <Button type='submit' className='mb-3' disabled={mealLoading}>
            Make a meal</Button>
        </Form>
        { mealLoading && <Spinner animation='border'/> /*displays a loading spinner while the meal is being generated*/}
        {mealLoadingError && "Something went wrong. Please try again." /*displays an error message if there was a problem generating the meal*/ }
        {meal && <p>{meal}</p> /*displays the generated meal if it exists.*/}
      </main>
    </>
  )
}
