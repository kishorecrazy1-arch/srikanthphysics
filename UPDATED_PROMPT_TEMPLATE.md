# Updated Prompt Template for Daily Practice Questions

## ✅ Changes Applied

The prompt template for Daily Practice questions has been updated to match best practices and your specifications.

## New Prompt Structure

### Key Features:
1. **Clear Role Definition**: "You are an expert AP Physics instructor"
2. **Explicit Difficulty Levels**: "Level 1 - Basic; Level 2 - Intermediate; Level 3 - Advanced"
3. **Structured Requirements**: Clear bullet points
4. **JSON Output Format**: Well-defined structure
5. **Physics Accuracy**: Dimensional consistency, sign conventions
6. **Advanced Level Validation**: Explicit complexity requirements

## Prompt Template (Current)

```
You are an expert AP Physics instructor. Generate {count} multiple-choice question(s) for the subtopic: "{subtopic}".

Difficulty Level: {difficulty} (Level 1 - Basic; Level 2 - Intermediate; Level 3 - Advanced)

Bloom's Taxonomy: {bloomLevel}

Requirements:
- Provide question text with clear, realistic physics scenario
- Provide exactly 4 answer choices (A, B, C, D) with one correct answer
- Include detailed step-by-step explanation showing reasoning
- Require conceptual rigor suitable for {difficulty} level
- Use proper SI units and realistic values
- Ensure physics accuracy (dimensional consistency, sign conventions)

Output format (JSON object with "questions" array):
{
  "questions": [
    {
      "question_text": "...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
      "correct_answer": "A|B|C|D",
      "explanation": "Step-by-step solution or reasoning",
      "solution_steps": [...],
      "distractor_explanations": {...},
      "formulas_used": [...],
      "bloom_level": "...",
      "estimated_time_min": 1|2|3,
      "scenario": "..."
    }
  ]
}
```

## PDF Question Extraction (New Feature)

A new service `pdfQuestionExtractor.ts` has been created to:
- Extract questions from uploaded PDFs
- Use AI to parse and format questions
- Generate distractors if options missing
- Infer difficulty and subtopic

### Usage:
```typescript
import { extractQuestionsFromPDF, processPDFUpload } from './services/pdfQuestionExtractor';

// From PDF text
const result = await extractQuestionsFromPDF(pdfText, topicId, subtopicId);

// From PDF file
const result = await processPDFUpload(pdfFile, topicId, subtopicId);
```

## Benefits

✅ **Consistent Format**: Matches your specified template
✅ **Better AI Responses**: Clearer instructions = better questions
✅ **PDF Support**: Ready for PDF upload feature
✅ **Structured Output**: JSON format ensures consistency
✅ **Difficulty Validation**: Explicit level requirements

## Next Steps

1. **Test the new prompt**: Generate questions and verify quality
2. **Add PDF upload UI**: Create component for PDF upload
3. **Integrate PDF extraction**: Connect to question storage

The prompt is now optimized for Daily Practice question generation!




















