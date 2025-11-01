// src/lib/sales.js
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * อัปเดตรายการให้เป็น sold (ใช้จริง)
 * - ต้องส่ง buyerUid, paymentMethod, paymentRef
 */
export async function markListingAsSold(listingId, {
  buyerUid,
  buyerName,
  paymentMethod,
  paymentRef,
  soldBy,
}) {
  if (!listingId) throw new Error('missing listingId');
  if (!buyerUid)  throw new Error('missing buyerUid');
  if (!paymentMethod) throw new Error('missing paymentMethod');
  if (!paymentRef) throw new Error('missing paymentRef');

  const ref = doc(db, 'listings', listingId);
  await updateDoc(ref, {
    status: 'sold',
    soldAt: serverTimestamp(),
    buyerUid,
    buyerName: buyerName || '',
    paymentMethod,
    paymentRef,
    soldBy: soldBy || 'system',
  });
}
