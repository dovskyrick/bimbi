import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Painting } from '../types/painting';

export function usePaintings() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'paintings'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const paintingsData: Painting[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: (data.createdAt as Timestamp).toDate(),
            updatedAt: (data.updatedAt as Timestamp).toDate(),
            reservedUntil: data.reservedUntil 
              ? (data.reservedUntil as Timestamp).toDate() 
              : undefined,
          } as Painting;
        });
        
        setPaintings(paintingsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching paintings:', err);
        setError('Failed to load paintings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { paintings, loading, error };
}

