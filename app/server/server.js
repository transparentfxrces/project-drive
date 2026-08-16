import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/coach", async (req, res) => {

  try {

    const { question, athlete } = req.body;

    const response =
      await client.responses.create({

        model: "gpt-4.1-mini",

        max_output_tokens: 350,

        input: `
You are Project Drive AI, an AI training assistant
inside the Project Drive athlete development app.

Use the athlete's logged data to give practical,
football-specific training guidance.

ATHLETE DATA:

${JSON.stringify(athlete, null, 2)}

RECOVERY INTERPRETATION:

- recoveryScore represents today's self-reported recovery.
- readiness represents today's training readiness.
- recoveryTrends summarizes multiple saved recovery check-ins.
- recoveryTrends.trend may be improving, stable, or declining.
- recoveryTrends.weakestFactor represents the athlete's
  current biggest recovery limiter based on logged data.
- recoveryTrends.strongestFactor represents the athlete's
  strongest recent recovery factor.
- priorities contains recommendations already generated
  by Project Drive's coaching system.

When today's recovery and the multi-day recovery trend
tell different stories, mention both rather than ignoring
one of them.

Do not treat a single performance decline as proof that
the athlete has become weaker. Consider fatigue, recovery,
testing conditions, and normal performance variation.

Use the athlete's actual logged data when relevant.
Do not invent workouts, personal records, injuries,
performance results, or recovery information that is
not present in the provided data.

Give clear and concise football-specific guidance.
Explain the most important reason behind your advice.

Keep the response under 250 words.

ATHLETE QUESTION:

${question}
        `,

      });

    res.json({

      reply: response.output_text,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      reply:
        "Project Drive AI encountered an error.",

    });

  }

});

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Coach server running on port ${PORT}`
  );

});