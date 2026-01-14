import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Painting } from '../types/painting';

export function usePainting(paintingId: string) {
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paintingRef = doc(db, 'paintings', paintingId);

    const unsubscribe = onSnapshot(
      paintingRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setPainting({
            ...data,
            id: snapshot.id,
            createdAt: (data.createdAt as Timestamp).toDate(),
            updatedAt: (data.updatedAt as Timestamp).toDate(),
            reservedUntil: data.reservedUntil 
              ? (data.reservedUntil as Timestamp).toDate() 
              : undefined,
          } as Painting);
        } else {
          setError('Painting not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching painting:', err);
        setError('Failed to load painting');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [paintingId]);

  return { painting, loading, error };
}

