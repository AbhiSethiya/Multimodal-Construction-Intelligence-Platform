import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Send, 
  Bot, 
  User, 
  Bookmark, 
  CheckCircle2, 
  HelpCircle, 
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { getKnowledgePresets, askKnowledgeAssistant } from '../services/api';

export default function KnowledgeAssistantView() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [queryInput, setQueryInput] = useState('');
  const [domainFilter, setDomainFilter] = useState('Structural Concrete & Steel');
  const [samplePresets, setSamplePresets] = useState([]);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const data = await getKnowledgePresets();
      setSamplePresets(data.sample_queries);
      // Run first query as default showcase
      if (data.sample_queries?.length > 0) {
        handleRunQuery(data.sample_queries[0].query, data.sample_queries[0].domain);
      }
    } catch (err) {
      console.error("Failed to load knowledge presets:", err);
    }
  };

  const handleRunQuery = async (queryText, domain) => {
    const activeQuery = queryText || queryInput;
    if (!activeQuery.trim()) return;

    const userMsg = { id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, sender: 'user', text: activeQuery };
    setMessages(prev => [...prev, userMsg]);
    setQueryInput('');
    setLoading(true);

    try {
      const res = await askKnowledgeAssistant({
        query: activeQuery,
        domain_filter: domain || domainFilter
      });

      const botMsg = {
        id: `bot-${res.query_id || Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        sender: 'assistant',
        data: res
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Failed to query knowledge assistant:", err);
      const errorMsg = {
        id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        sender: 'assistant',
        text: "Error retrieving technical answer. Please check backend connection."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="knowledge-assistant-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <span className="badge-tag info">ACI 318 • OSHA 1926 • AISC • Eurocode 2</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Standard Compliance Verified
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Construction Knowledge & Engineering Copilot</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Multimodal decision-support assistant with cited standard specifications, engineering formulas, and quality inspection guidelines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Structural Concrete & Steel', 'Safety Codes & OSHA', 'MEP & Geotechnical'].map((d) => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={`badge-tag ${domainFilter === d ? 'medium' : 'info'}`}
              style={{ cursor: 'pointer', padding: '0.4rem 0.75rem' }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Sparkles size={14} style={{ color: 'var(--safety-amber)' }} /> Suggested Engineering Queries:
        </span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            className="btn-secondary"
            onClick={() => handleRunQuery(preset.query, preset.domain)}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '20px' }}
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
        <div className="chat-window">
          <div className="chat-history" id="chat-messages-container">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-bubble ${msg.sender}`}
                style={{ width: msg.sender === 'assistant' ? '92%' : 'auto' }}
              >
                {msg.sender === 'user' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} style={{ color: 'var(--safety-amber)' }} />
                    <span style={{ fontWeight: 600 }}>{msg.text}</span>
                  </div>
                ) : msg.data ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--safety-amber)', fontWeight: 700 }}>
                      <Bot size={18} />
                      <span>ConstructIQ Engineering Intelligence:</span>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.5' }}>
                      {msg.data.direct_answer}
                    </div>

                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {msg.data.detailed_technical_explanation}
                    </div>

                    {/* Formula Box */}
                    {msg.data.calculation_or_formula && (
                      <div className="formula-box">
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--safety-amber)', fontWeight: 700 }}>
                          Governing Formula / Engineering Equation:
                        </div>
                        <div style={{ marginTop: '0.2rem' }}>{msg.data.calculation_or_formula}</div>
                      </div>
                    )}

                    {/* Code Citations */}
                    {msg.data.code_citations?.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--safety-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          Verified Standard Citations:
                        </div>
                        {msg.data.code_citations.map((c, i) => (
                          <div key={i} className="citation-box">
                            <strong>{c.standard} ({c.clause}): </strong>
                            <span>{c.relevance}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Practical Site Checkpoints */}
                    {msg.data.practical_site_checkpoints?.length > 0 && (
                      <div style={{ 
                        marginTop: '0.4rem', 
                        padding: '0.75rem', 
                        background: 'rgba(16, 185, 129, 0.08)', 
                        border: '1px solid rgba(16, 185, 129, 0.25)', 
                        borderRadius: '6px' 
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-emerald)', marginBottom: '0.35rem' }}>
                          FIELD SUPERVISOR CHECKPOINTS:
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                          {msg.data.practical_site_checkpoints.map((pt, i) => (
                            <li key={i} style={{ marginBottom: '0.2rem' }}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Followup suggestions */}
                    {msg.data.suggested_followups?.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                        {msg.data.suggested_followups.map((f, i) => (
                          <button
                            key={i}
                            className="badge-tag info"
                            onClick={() => handleRunQuery(f, domainFilter)}
                            style={{ cursor: 'pointer', textAlign: 'left', fontSize: '0.7rem' }}
                          >
                            + {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>{msg.text}</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={14} className="animate-spin text-amber" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Querying civil engineering standards and multimodal reasoning...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div style={{ 
            padding: '1rem', 
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(10, 16, 30, 0.8)',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <input
              type="text"
              id="input-knowledge-query"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunQuery(queryInput, domainFilter)}
              placeholder="Ask any technical engineering question (e.g., concrete slump limits, rebar lap splice length, OSHA guardrail height)..."
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button 
              className="btn-primary" 
              onClick={() => handleRunQuery(queryInput, domainFilter)}
              disabled={loading}
              id="btn-send-knowledge-query"
            >
              <Send size={15} />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
