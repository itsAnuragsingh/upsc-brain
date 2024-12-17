// components/AnswerAnalysis.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, RefreshCw } from "lucide-react";

export default function AnswerAnalysis() {
  const [subject, setSubject] = useState('');
  const [questionData, setQuestionData] = useState(null);
  const [answerType, setAnswerType] = useState('text');
  const [userAnswer, setUserAnswer] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  // Generate new question when subject changes
  useEffect(() => {
    if (subject) {
      generateQuestion();
    }
  }, [subject]);

  const generateQuestion = async () => {
    if (!subject) return;

    setLoading(true);
    setError(null);
    setQuestionData(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject }),
      });

      const result = await response.json();

      if (result.success) {
        setQuestionData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to generate question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionText: questionData.question,
          expectedPoints: questionData.expectedPoints,
          userAnswer: answerType === 'text' ? userAnswer : '',
          answerType,
          imageData: answerType === 'image' ? imagePreview : null,
          subject,
          maxWords: questionData.maxWords,
          marks: questionData.marks
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAnalysis(result.analysis);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to analyze answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = (text) => {
    if (!text) return null;

    return (
      <div className="prose max-w-none">
        {text.split('\n').map((line, index) => {
          if (line.match(/^\d+\./)) {
            return (
              <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                {line}
              </h3>
            );
          }
          else if (line.trim().startsWith('•')) {
            return (
              <div key={index} className="ml-4 mb-2">
                {line}
              </div>
            );
          }
          else {
            return (
              <div key={index} className="mb-2">
                {line}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Answer Analysis Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Selection */}
            <div>
              <Label htmlFor="subject">Subject</Label>
              <div className="flex gap-2">
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Indian History, Geography"
                  required
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={generateQuestion}
                  disabled={!subject || loading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Question
                </Button>
              </div>
            </div>

            {/* Generated Question Display */}
            {questionData && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-2">Question:</h3>
                  <p>{questionData.question}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Expected Points:</h3>
                  <ul className="list-disc pl-5">
                    {questionData.expectedPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="font-semibold">Max Words:</span> {questionData.maxWords}
                  </div>
                  <div>
                    <span className="font-semibold">Marks:</span> {questionData.marks}
                  </div>
                </div>
              </div>
            )}

            {/* Answer Type Selection */}
            {questionData && (
              <div className="space-y-3">
                <Label>Answer Type</Label>
                <RadioGroup
                  value={answerType}
                  onValueChange={(value) => {
                    setAnswerType(value);
                    setImagePreview(null);
                    setUserAnswer('');
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">Type Answer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="image" />
                    <Label htmlFor="image">Upload Handwritten</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Answer Input */}
            {questionData && answerType === 'text' && (
              <div>
                <Label htmlFor="answer">Your Answer</Label>
                <Textarea
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="h-40"
                  required
                />
              </div>
            )}

            {/* Image Upload */}
            {questionData && answerType === 'image' && (
              <div className="space-y-4">
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Handwritten Answer
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <img 
                      src={imagePreview} 
                      alt="Answer preview" 
                      className="max-w-full h-auto rounded"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => setImagePreview(null)}
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {questionData && (
              <Button 
                type="submit" 
                disabled={loading || (!userAnswer && !imagePreview)} 
                className="w-full"
              >
                {loading ? 'Analyzing...' : 'Analyze Answer'}
              </Button>
            )}
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded">
              {error}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
              <div className="bg-gray-50 p-6 rounded">
                {renderAnalysis(analysis)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}