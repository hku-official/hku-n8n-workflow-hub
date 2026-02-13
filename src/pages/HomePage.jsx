import React, { useState, useEffect, useCallback } from 'react';
import FlowCard from '../components/FlowCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { listFlows } from '../api';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [flows, setFlows] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFlows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listFlows({ category, search });
      setFlows(data?.flows || []);
    } catch (err) {
      console.error('API error:', err.message);
      setError('Failed to load flows. Please check the API connection.');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  const filtered = flows.filter((f) => {
    const matchCat = !category || f.category === category;
    const matchSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-3 text-gray-800">
          HKU <span className="text-hku-green">n8n Workflow</span> Hub
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Browse and share n8n automation workflows across HKU. Preview them live and import directly into your instance.
        </p>
      </section>

      <div className="max-w-xl mx-auto">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <CategoryFilter selected={category} onChange={setCategory} />

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-hku-green animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600">{error}</div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((flow) => (
            <FlowCard key={flow.id} flow={flow} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No flows found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
