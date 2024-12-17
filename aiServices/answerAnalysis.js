// utils/answerAnalysis.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import vision from "@google-cloud/vision";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_KEY_PATH
});

async function extractTextFromImage(imageBase64) {
  try {
    const [result] = await visionClient.documentTextDetection({
      image: {
        content: imageBase64.split(',')[1]
      }
    });

    return result.fullTextAnnotation.text;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw new Error("Failed to extract text from image");
  }
}

async function analyzeAnswer({ 
  userAnswer, 
  questionText, 
  subject, 
  expectedPoints, 
  isImage = false,
  imageData = null 
}) {
  try {
    let answerText = userAnswer;
    
    // If it's an image, extract text first
    if (isImage && imageData) {
      answerText = await extractTextFromImage(imageData);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    Act as an experienced UPSC examiner and provide a detailed analysis of the following answer:

    Question: ${questionText}
    Subject: ${subject}
    Expected Key Points: ${expectedPoints}
    Student's Answer: ${answerText}

    Please provide a comprehensive analysis in the following format:

    1. CONTENT ANALYSIS
    • Coverage of key points
    • Accuracy of information
    • Relevance to the question
    • Use of examples and facts

    2. STRUCTURE AND PRESENTATION
    • Introduction effectiveness
    • Logical flow
    • Conclusion strength
    • Paragraph organization

    3. STRENGTHS
    • List main strong points

    4. AREAS FOR IMPROVEMENT
    • List specific areas needing improvement

    5. SPECIFIC SUGGESTIONS
    • Actionable recommendations

    6. SCORE AND RATING
    • Provide a score out of 10
    • Brief justification for the score

    Format Guidelines:
    - Use clear, constructive language
    - Be specific in feedback
    - Provide actionable suggestions
    - Highlight both positive and negative aspects
    - Keep formatting minimal and clean
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Format the response
    const formattedResponse = response.text()
      .replace(/#{1,}/g, '')  // Remove hashtags
      .replace(/\*{2,}/g, '*') // Replace multiple asterisks with single
      .replace(/\n{3,}/g, '\n\n') // Clean up excessive newlines
      .trim();

    return {
      success: true,
      analysis: formattedResponse,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error analyzing answer:", error);
    return {
      success: false,
      error: "Failed to analyze answer. Please try again.",
      timestamp: new Date().toISOString()
    };
  }
}

export  { analyzeAnswer };