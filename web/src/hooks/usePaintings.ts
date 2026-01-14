import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Painting } from '../types/painting';

export function usePaintings() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaintings() {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'paintings'),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const paintingsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Painting;
        });
        
        setPaintings(paintingsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching paintings:', err);
        setError('Failed to load paintings');
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
