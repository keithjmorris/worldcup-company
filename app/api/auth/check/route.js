import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ allowed: false });
    }

    // Check against allowed emails in Firestore
    const docRef = doc(db, 'allowed_emails', email.toLowerCase().trim());
    const docSnap = await getDoc(docRef);

    return Response.json({ allowed: docSnap.exists() });
  } catch (err) {
    return Response.json({ allowed: false }, { status: 500 });
  }
}