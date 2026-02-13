import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Tag, Download, Eye, Copy, Check, Calendar, ExternalLink, Package, Box } from 'lucide-react';
import { getFlow } from '../api';

const N8N_IMPORT_BASE = import.meta.env.VITE_N8N_IMPORT_BASE || 'https://n8n-its-dev.hku.hk';

export default function FlowDetailPage() {
  const { id } = useParams();
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const demoContainerRef = useRef(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getFlow(id);
        setFlow(data);
      } catch (err) {
        console.error('Failed to load flow:', err.message);
        setFlow(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (flow?.flowJson && demoContainerRef.current) {
      try {
        const parsed = typeof flow.flowJson === 'string' ? JSON.parse(flow.flowJson) : flow.flowJson;
        const workflowStr = JSON.stringify(parsed).replace(/'/g, '&#39;');
        demoContainerRef.current.innerHTML = `<n8n-demo workflow='${workflowStr}'></n8n-demo>`;
      } catch (e) {
        console.error('Failed to parse flow JSON:', e);
        demoContainerRef.current.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:2rem;">Unable to render workflow preview.</p>';
      }
    }
  }, [flow]);

  const handleCopy = async () => {
    if (!flow?.flowJson) return;
    await navigator.clipboard.writeText(
      typeof flow.flowJson === 'string' ? flow.flowJson : JSON.stringify(flow.flowJson, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parsedWorkflow = React.useMemo(() => {
    if (!flow?.flowJson) return null;
    try {
      return typeof flow.flowJson === 'string' ? JSON.parse(flow.flowJson) : flow.flowJson;
    } catch {
      return null;
    }
  }, [flow]);

  const communityNodes = React.useMemo(() => {
    if (!parsedWorkflow?.nodes) return [];
    const seen = new Set();
    return parsedWorkflow.nodes
      .filter((n) => !n.type.startsWith('n8n-nodes-base.') && !seen.has(n.type) && seen.add(n.type))
      .map((n) => ({ type: n.type, package: n.type.split('.')[0] }));
  }, [parsedWorkflow]);

  const handleImport = () => {
    if (!flow?.flowJson) return;
    const json = typeof flow.flowJson === 'string' ? flow.flowJson : JSON.stringify(flow.flowJson);
    const encoded = encodeURIComponent(json);
    window.open(`${N8N_IMPORT_BASE}/#/workflow/new?workflow=${encoded}`, '_blank');
  };

  const handleDownload = () => {
    if (!flow?.flowJson) return;
    const json = typeof flow.flowJson === 'string' ? flow.flowJson : JSON.stringify(flow.flowJson, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flow.name?.replace(/\s+/g, '_') || 'flow'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-hku-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="text-center py-20 text-gray-500">
        Flow not found. <Link to="/" className="text-hku-green underline">Go back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-hku-green transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to flows
      </Link>

      <h1 className="text-3xl font-bold text-gray-800">{flow.name}</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Workflow Preview</span>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-xs flex items-center gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
            <button onClick={handleDownload} className="btn-primary text-xs flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button onClick={handleImport} className="btn-primary text-xs flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> Import to n8n
            </button>
          </div>
        </div>
        <div ref={demoContainerRef} style={{ width: '100%' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {parsedWorkflow?.nodes?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Nodes ({parsedWorkflow.nodes.length})</span>
              </div>
              <div className="divide-y divide-gray-100">
                {parsedWorkflow.nodes.map((node, i) => {
                  const isCommunity = !node.type.startsWith('n8n-nodes-base.');
                  return (
                    <div key={i} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Box className={`w-4 h-4 ${isCommunity ? 'text-amber-600' : 'text-gray-400'}`} />
                        <div>
                          <div className="text-sm font-medium text-gray-700">{node.name}</div>
                          <div className="text-xs text-gray-400">{node.type}</div>
                        </div>
                      </div>
                      {isCommunity && (
                        <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Community</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {communityNodes.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-amber-700" />
                <span className="text-sm font-medium text-amber-700">Required Community Nodes</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Install these community nodes in your n8n instance before importing:</p>
              <div className="space-y-1.5">
                {communityNodes.map((cn) => (
                  <div key={cn.package} className="flex items-center justify-between">
                    <code className="text-xs bg-white px-2 py-1 rounded border border-amber-200">{cn.package}</code>
                    <a
                      href={`https://www.npmjs.com/package/${cn.package}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-hku-green hover:underline flex items-center gap-1"
                    >
                      npm <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
            <h2 className="font-semibold text-lg text-gray-800">Details</h2>

            <p className="text-sm text-gray-500 leading-relaxed">{flow.description}</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <User className="w-4 h-4" />
                <span>{flow.author}</span>
              </div>
              {flow.category && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span className="text-hku-green">{flow.category}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{flow.viewCount ?? 0} views</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Download className="w-4 h-4" />
                <span>{flow.downloadCount ?? 0} downloads</span>
              </div>
              {flow.createdAt && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(flow.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {flow.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {flow.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
