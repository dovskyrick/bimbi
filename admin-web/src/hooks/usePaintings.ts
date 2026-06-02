import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Painting } from '../types/painting';

export function usePaintings() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaintings() {
      try {
        setLoading(true);
        let q = query(collection(db, 'paintings'), orderBy('createdAt', 'desc'));
        let snapshot;
        try {
          snapshot = await getDocs(q);
        } catch (orderError: unknown) {
          const err = orderError as { code?: string };
          if (err.code === 'failed-precondition') {
            q = query(collection(db, 'paintings'));
            snapshot = await getDocs(q);
          } else {
            throw orderError;
          }
        }

        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            ...d,
            id: doc.id,
            createdAt: d['createdAt']?.toDate() || new Date(),
            updatedAt: d['updatedAt']?.toDate() || new Date(),
          } as Painting;
        });

        data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setPaintings(data);
        setError(null);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e.message || 'Failed to load paintings');
      } finally {
        setLoading(false);
      }
    }

    fetchPaintings();
  }, []);

  return { paintings, loading, error };
}
