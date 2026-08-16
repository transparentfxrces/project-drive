export async function askCoach(question, athlete) {

  const response = await fetch(
    "http://localhost:5000/api/coach",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
        athlete,
      }),
    }
  );

  return response.json();
}