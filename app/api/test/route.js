export async function GET() {
  return Response.json({
    hasFirebaseKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    keyStart: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 5),
  });
}