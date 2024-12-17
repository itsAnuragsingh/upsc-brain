

// app/api/analyze-answer/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import vision from "@google-cloud/vision";
import { NextResponse } from 'next/server';

const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_KEY_PATH
});

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { 
      questionText, 
      expectedPoints, 
      userAnswer, 
      answerType,
      imageData,
      subject,
      maxWords,
      marks 
    } = await request.json();

    let answerText = userAnswer;

    // Handle image-based answer
    if (answerType === 'image' && imageData) {
      const [result] = await visionClient.documentTextDetection({
        image: {
          content: imageData.split(',')[1]
        }
      });
      answerText = result.fullTextAnnotation.text;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Act as an experienced UPSC examiner and provide a detailed analysis of the following answer:

    Question: ${questionText}
    Subject: ${subject}
    Maximum Words: ${maxWords}
    Marks: ${marks}
    Expected Key Points: ${JSON.stringify(expectedPoints)}
    
    Student's Answer Type: ${answerType}
    Student's Answer: ${answerText}

    Please provide a comprehensive analysis in the following format:

    1. CONTENT ANALYSIS
    • Coverage of key points (compare with expected points)
    • Accuracy of information
    • Relevance to the question
    • Use of examples and facts

    2. STRUCTURE AND PRESENTATION
    • Introduction effectiveness
    • Logical flow
    • Conclusion strength
    • Paragraph organization
    ${answerType === 'image' ? '• Handwriting clarity and presentation' : ''}

    3. STRENGTHS
    • List main strong points

    4. AREAS FOR IMPROVEMENT
    • List specific areas needing improvement

    5. SPECIFIC SUGGESTIONS
    • Actionable recommendations

    6. SCORE AND RATING
    • Score: X/${marks}
    • Detailed justification for the score
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const formattedResponse = response.text()
      .replace(/#{1,}/g, '')
      .replace(/\*{2,}/g, '*')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return NextResponse.json({
      success: true,
      analysis: formattedResponse
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze answer. Please try again.'
      },
      { status: 500 }
    );
  }
}