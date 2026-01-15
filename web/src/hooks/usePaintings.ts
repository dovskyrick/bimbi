import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
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
        // Try with orderBy first, fallback to no ordering if index missing
        let q = query(
          collection(db, 'paintings'),
          orderBy('createdAt', 'desc')
        );
        
        let snapshot;
        try {
          snapshot = await getDocs(q);
        } catch (orderError: any) {
          // If index missing, fetch without ordering
          if (orderError.code === 'failed-precondition') {
            console.warn('Firestore index missing, fetching without order');
            q = query(collection(db, 'paintings'));
            snapshot = await getDocs(q);
          } else {
            throw orderError;
          }
        }
        
        const paintingsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Painting;
        });
        
        // Sort manually if we couldn't use orderBy
        paintingsData.sort((a, b) => {
          const aTime = a.createdAt.getTime();
          const bTime = b.createdAt.getTime();
          return bTime - aTime; // Descending
        });
        
        setPaintings(paintingsData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching paintings:', err);
        setError(err.message || 'Failed to load paintings');
      } finally {
        setLoading(false);
      }
    }

    fetchPaintings();
  }, []);

  return { paintings, loading, error };
}

export function usePainting(id: string | undefined) {
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchPainting() {
      try {
        setLoading(true);
        const docRef = doc(db, 'paintings', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPainting({
            ...data,
            id: docSnap.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Painting);
          setError(null);
        } else {
          setError('Painting not found');
        }
      } catch (err) {
        console.error('Error fetching painting:', err);
        setError('Failed to load painting');
      } finally {
        setLoading(false);
      }
    }

    fetchPainting();
  }, [id]);

  return { painting, loading, error };
}
