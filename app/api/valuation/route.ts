import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { text, images } = data;

    // Basic validation
    if (!text && (!images || images.length === 0)) {
      return NextResponse.json({ error: 'Please provide text or images for valuation.' }, { status: 400 });
    }

    // In a real application, you would integrate with an AI valuation model here.
    // For this example, we'll simulate a valuation.

    let valuation = 0;
    let confidence = 0;
    const explanations = [];

    if (text) {
      valuation += 50 + text.length * 0.1; // Base value for text + per character
      confidence += 20;
      explanations.push("Text provided contributed to the valuation.");
    }

    if (images && images.length > 0) {
      valuation += images.length * 100; // Each image adds 100 to valuation
      confidence += images.length * 15; // Each image increases confidence
      explanations.push(`${images.length} image(s) provided significantly contributed to the valuation.`);
    }

    // Cap confidence at 95% for this mock
    confidence = Math.min(confidence, 95);

    if (confidence < 30) {
        explanations.push("The confidence in this valuation is low. Providing more details and images will improve accuracy.");
    } else if (confidence < 60) {
        explanations.push("The confidence in this valuation is moderate. More details and/or images could improve it.");
    } else {
        explanations.push("The confidence in this valuation is good. The information provided was helpful.");
    }

    // Add the core message about information improving accuracy
    const accuracyMessage = "Ju mer information och bilder AI:n får, desto mer exakt blir värderingen. För bästa resultat, beskriv objektet noggrant och ladda upp tydliga bilder från olika vinklar.";

    return NextResponse.json({
      valuation,
      confidence,
      message: accuracyMessage,
      explanations,
    });

  } catch (error) {
    console.error('Valuation API error:', error);
    return NextResponse.json({ error: 'An error occurred during the valuation process.' }, { status: 500 });
  }
}
