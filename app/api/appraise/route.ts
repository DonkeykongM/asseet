import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface AppraisalRequest {
  images: string[];
  description: string;
  category: string;
}

interface AppraisalResponse {
  itemIdentification: string;
  estimatedValueLow: number;
  estimatedValueHigh: number;
  currency: string;
  conditionAssessment: string;
  conditionRating: string;
  valuationMethodology: string;
  marketContext: string;
  marketType: string;
  recommendations: string[];
  confidenceScore: number;
  requiresExpertReview: boolean;
  limitations: string;
  sources: string[];
}

function buildAppraisalPrompt(description: string, category: string): string {
  return `You are an expert appraiser with extensive knowledge of ${category}, collectibles, art, jewelry, and various valuable items. Your task is to provide an accurate valuation based on the provided images and description.

**Item Information:**
- Category: ${category}
- Description: ${description}

**Your Analysis Must Include:**

1. **Item Identification**: Clearly state what the item is, including maker/brand if identifiable from the images.

2. **Estimated Value Range**: Provide a realistic market value range with both low and high estimates in USD. Be conservative and realistic.

3. **Condition Assessment**: Rate the condition based on what you can see in the images and explain how it affects value. Use ratings: Excellent, Very Good, Good, Fair, or Poor.

4. **Valuation Methodology**: Explain the factors used to determine value (rarity, demand, condition, provenance, brand recognition, materials, craftsmanship, etc.)

5. **Market Context**: Specify which market the valuation applies to (auction, retail, insurance, private sale) and provide context about current market conditions for this type of item.

6. **Sources and Comparables**: Reference general market knowledge, typical price ranges for similar items, or established value factors. Be honest about what you can determine from photos alone.

7. **Recommendations**: Provide 3-5 specific recommendations for the owner (authentication steps, care instructions, selling venues, insurance considerations, etc.)

8. **Confidence Score**: Rate your confidence in this valuation from 0-100, considering image quality and available information.

9. **Limitations**: Clearly state the limitations of this photo-based assessment and if professional in-person appraisal is recommended.

**Response Format:**
Provide your response as a JSON object with this exact structure:
{
  "itemIdentification": "Full item name with brand/maker",
  "estimatedValueLow": number (in USD),
  "estimatedValueHigh": number (in USD),
  "currency": "USD",
  "conditionAssessment": "Detailed condition description",
  "conditionRating": "Excellent|Very Good|Good|Fair|Poor",
  "valuationMethodology": "Explanation of how value was determined",
  "marketContext": "Market analysis and context",
  "marketType": "Auction|Retail|Insurance|Private Sale",
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "confidenceScore": number (0-100),
  "requiresExpertReview": boolean,
  "limitations": "Limitations of this assessment",
  "sources": ["source 1", "source 2", ...]
}

Be professional, thorough, and honest. If you cannot provide a confident valuation, say so and recommend expert review.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: AppraisalRequest = await request.json();
    const { images, description, category } = body;

    if (!description || !category) {
      return NextResponse.json(
        { error: 'Description and category are required' },
        { status: 400 }
      );
    }

    const content: Anthropic.MessageParam['content'] = [
      {
        type: 'text',
        text: buildAppraisalPrompt(description, category),
      },
    ];

    for (const imageBase64 of images) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      const mediaType = imageBase64.includes('image/jpeg') ? 'image/jpeg' : 'image/png';

      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data,
        },
      });
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    });

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as Anthropic.TextBlock).text)
      .join('\n');

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const appraisalData: AppraisalResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      data: appraisalData,
    });
  } catch (error) {
    console.error('Appraisal error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process appraisal',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
