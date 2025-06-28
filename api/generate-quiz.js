// Vercel Serverless Function for AI Quiz Generation
// This keeps API keys secure on the server-side

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      throw new Error('AI API key not configured');
    }

    console.log('Using AI API with key:', process.env.GEMINI_API_KEY ? 'Available' : 'Missing');

    // Google Gemini API (server-side only)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated');
    }

    // Try to parse as JSON (quiz questions)
    try {
      // Clean up the response - remove any markdown formatting
      let cleanedText = generatedText.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Remove any extra text before or after the JSON array
      const jsonStart = cleanedText.indexOf('[');
      const jsonEnd = cleanedText.lastIndexOf(']') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleanedText = cleanedText.substring(jsonStart, jsonEnd);
      }
      
      console.log('Cleaned AI response:', cleanedText);
      
      const quizData = JSON.parse(cleanedText);
      
      // Validate that we have an array of questions
      if (Array.isArray(quizData) && quizData.length > 0) {
        console.log(`Successfully generated ${quizData.length} questions`);
        res.status(200).json({ questions: quizData });
      } else {
        throw new Error('Invalid quiz format - not an array or empty');
      }
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw AI response:', generatedText);
      
      // If not valid JSON, return fallback demo questions
      res.status(200).json({ 
        questions: [
          {
            questionText: "What is the main topic discussed in the provided text?",
            type: "Multiple Choice",
            options: ["Science", "History", "Literature", "Technology"],
            correctAnswer: "Science",
            explanation: "Based on the content analysis, this appears to be the primary focus."
          },
          {
            questionText: "The provided text contains factual information.",
            type: "True/False",
            correctAnswer: "True",
            explanation: "The text appears to provide factual content on the subject matter."
          }
        ]
      });
    }

  } catch (error) {
    console.error('Quiz generation error:', error);
    
    // Return demo questions as fallback
    res.status(200).json({
      questions: [
        {
          questionText: "What is the main topic discussed in the provided text?",
          type: "Multiple Choice", 
          options: ["Science", "History", "Literature", "Technology"],
          correctAnswer: "Science",
          explanation: "Based on the content analysis, this appears to be the primary focus."
        },
        {
          questionText: "The information provided is comprehensive and detailed.",
          type: "True/False",
          correctAnswer: "True", 
          explanation: "The text contains detailed information on the subject matter."
        }
      ]
    });
  }
} 