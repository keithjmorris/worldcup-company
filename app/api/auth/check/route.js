import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ allowed: false });
    }

    const normalised = email.toLowerCase().trim();
    const domain = normalised.split('@')[1];

    // Check allowed domains
    const allowedDomains = ['xenomorph.com', 'newmodel.vc', 'wellsmaltings.org.uk']; // add your company domain here

    if (allowedDomains.includes(domain)) {
      return Response.json({ allowed: true });
    }

    // Check individual allowed emails for exceptions
    const docRef = doc(db, 'allowed_emails', normalised);
    const docSnap = await getDoc(docRef);

    return Response.json({ allowed: docSnap.exists() });
  } catch (err) {
    return Response.json({ allowed: false }, { status: 500 });
  }
}