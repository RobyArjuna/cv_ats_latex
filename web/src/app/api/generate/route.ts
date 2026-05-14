import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/latex';
import { CVDataSchema } from '@/types/cv';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Zod validation — parses, coerces defaults, and returns typed data
    const result = CVDataSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const data = result.data;
    const pdfBuffer = await generatePDF(data);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cv_${data.personalInfo.name.replace(/\s+/g, '_').toLowerCase()}.pdf"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('PDF Generation Error:', message);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: message },
      { status: 500 }
    );
  }
}
