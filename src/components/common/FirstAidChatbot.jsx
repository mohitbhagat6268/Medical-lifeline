import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import {
  Bot, GraduationCap, MessageCircle, Mic, MicOff,
  Pill, Send, Syringe, Volume2, VolumeX, X
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../../services/firebase';
import { MEDICAL_KNOWLEDGE } from '../../data/medicalKnowledge';
import {
  isSpeechSynthesisSupported,
  isVoiceRecognitionSupported,
  speakText,
  startVoiceListener,
  stopSpeaking,
} from '../../services/voiceService';

const QUICK_PROMPTS = ['Dog bite', 'Tetanus injection', 'Snake bite', 'Fever medicine', 'Chest pain'];

export default function FirstAidChatbot() {
  const [open, setOpen] = useState(false);
  const [teachMode, setTeachMode] = useState(false);
  const [input, setInput] = useState('');
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [listeningChat, setListeningChat] = useState(false);
  const [learnedKnowledge, setLearnedKnowledge] = useState([]);
  const [teachForm, setTeachForm] = useState({ keyword: '', steps: '', medicines: '', injections: '' });

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! I am trained on First-Aid, Medicines, and Emergency Injections. Ask me by typing or tapping the Mic icon, or click Teach to add new medical data.',
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'chatbot_knowledge'), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLearnedKnowledge(items);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const findBestAnswer = (query) => {
    const lower = query.toLowerCase();
    const words = lower.split(/\s+/).filter((w) => w.length > 2);
    const allKnowledge = [...learnedKnowledge, ...MEDICAL_KNOWLEDGE];

    let bestMatch = null;
    let highestScore = 0;

    for (const entry of allKnowledge) {
      let score = 0;
      for (const kw of entry.keywords || []) {
        const k = kw.toLowerCase();
        if (lower.includes(k)) score += k.includes(' ') ? 5 : 3;
        else if (words.some((w) => k.includes(w))) score += 1;
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry;
      }
    }

    return highestScore > 0 ? bestMatch : null;
  };

  const askQuestion = (text) => {
    const userText = text.trim();
    if (!userText) return;

    const match = findBestAnswer(userText);
    const botReply = match
      ? {
          sender: 'bot',
          title: match.title,
          steps: match.steps || [],
          medicines: match.medicines,
          injections: match.injections,
          disclaimer: 'Informational first-aid guidance only. Injections & prescriptions must be given by a licensed doctor.',
        }
      : {
          sender: 'bot',
          text: `I don't have trained data for "${userText}" yet. Click "Teach" below to add it to my permanent Firestore knowledge base.`,
          unknownTopic: userText,
        };

    setMessages((prev) => [...prev, { sender: 'user', text: userText }, botReply]);
    setInput('');
  };

  const handleSend = (e) => {
    e.preventDefault();
    askQuestion(input);
  };

  const handleSpeakMessage = (msg, idx) => {
    if (speakingIndex === idx) {
      stopSpeaking();
      setSpeakingIndex(null);
      return;
    }

    const script = [
      msg.title,
      ...msg.steps.map((s, n) => `Step ${n + 1}: ${s}`),
      msg.medicines ? `Medicines: ${msg.medicines}` : '',
    ]
      .filter(Boolean)
      .join('. ');

    setSpeakingIndex(idx);
    speakText(script, () => setSpeakingIndex(null));
  };

  const handleVoiceQuestion = () => {
    if (!isVoiceRecognitionSupported()) {
      toast.error('Voice input requires Chrome or Edge.');
      return;
    }
    setListeningChat(true);
    startVoiceListener({
      onResult: (transcript) => askQuestion(transcript),
      onError: (err) => toast.error(err),
      onEnd: () => setListeningChat(false),
    });
  };

  const handleTeachSubmit = async (e) => {
    e.preventDefault();
    if (!teachForm.keyword.trim() || !teachForm.steps.trim()) {
      toast.error('Enter at least a keyword/topic and first-aid steps.');
      return;
    }

    const newEntry = {
      title: `${teachForm.keyword.trim()} (Trained)`,
      keywords: teachForm.keyword.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean),
      steps: teachForm.steps.split('\n').map((s) => s.trim()).filter(Boolean),
      medicines: teachForm.medicines.trim() || 'Consult a doctor for appropriate medication.',
      injections: teachForm.injections.trim() || 'Consult a doctor if any injection or vaccine is required.',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'chatbot_knowledge'), newEntry);
      toast.success(`Trained on "${teachForm.keyword}"!`);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Training complete for "${teachForm.keyword}". Ask me about it anytime!` },
      ]);
      setTeachForm({ keyword: '', steps: '', medicines: '', injections: '' });
      setTeachMode(false);
    } catch (err) {
      toast.error('Failed to save training data.');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 bg-surface border border-border-subtle rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[540px]">
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="font-display font-semibold text-sm leading-tight">First-Aid & Med AI</p>
                <p className="text-[11px] text-blue-100">
                  {MEDICAL_KNOWLEDGE.length + learnedKnowledge.length} medical topics trained
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTeachMode(!teachMode)}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  teachMode ? 'bg-white text-primary font-semibold' : 'hover:bg-white/15'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Teach</span>
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/15 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {teachMode ? (
            <form onSubmit={handleTeachSubmit} className="p-4 space-y-3 overflow-y-auto text-xs">
              <p className="font-semibold text-text-main">Train New Medical Topic</p>
              <div>
                <label className="block text-text-muted mb-1">Topic / Keywords (comma separated)</label>
                <input
                  value={teachForm.keyword}
                  onChange={(e) => setTeachForm({ ...teachForm, keyword: e.target.value })}
                  placeholder="e.g. scorpion sting, scorpion"
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-text-muted mb-1">First-Aid Steps (one per line)</label>
                <textarea
                  rows={3}
                  value={teachForm.steps}
                  onChange={(e) => setTeachForm({ ...teachForm, steps: e.target.value })}
                  placeholder="Wash area with soap and water&#10;Apply a cool compress&#10;Visit hospital if severe pain"
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-text-muted mb-1">Medicines (OTC / General)</label>
                <input
                  value={teachForm.medicines}
                  onChange={(e) => setTeachForm({ ...teachForm, medicines: e.target.value })}
                  placeholder="e.g. Paracetamol for pain"
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-text-muted mb-1">Injections / Vaccines (Clinical)</label>
                <input
                  value={teachForm.injections}
                  onChange={(e) => setTeachForm({ ...teachForm, injections: e.target.value })}
                  placeholder="e.g. Tetanus booster if needed"
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary/90 cursor-pointer"
              >
                Save to Knowledge Base
              </button>
            </form>
          ) : (
            <>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-bg-app text-xs">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[88%] rounded-xl p-3 ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-surface border border-border-subtle text-text-main shadow-xs'
                      }`}
                    >
                      {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                      {msg.title && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-display font-bold text-primary">{msg.title}</p>
                            {isSpeechSynthesisSupported() && (
                              <button
                                type="button"
                                onClick={() => handleSpeakMessage(msg, i)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-bg-app border border-border-subtle text-[11px] font-medium text-text-main hover:border-primary hover:text-primary cursor-pointer shrink-0"
                                title="Read steps aloud"
                              >
                                {speakingIndex === i ? (
                                  <VolumeX className="w-3.5 h-3.5 text-emergency" />
                                ) : (
                                  <Volume2 className="w-3.5 h-3.5 text-primary" />
                                )}
                                <span>{speakingIndex === i ? 'Stop' : 'Listen'}</span>
                              </button>
                            )}
                          </div>

                          <ol className="list-decimal pl-4 space-y-1 text-text-main">
                            {msg.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                          </ol>

                          {msg.medicines && (
                            <div className="p-2 rounded-lg bg-bg-app border border-border-subtle flex items-start gap-2">
                              <Pill className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-secondary">Medicines: </span>
                                <span className="text-text-muted">{msg.medicines}</span>
                              </div>
                            </div>
                          )}

                          {msg.injections && (
                            <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex items-start gap-2">
                              <Syringe className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-primary">Injections / Vaccines: </span>
                                <span className="text-text-muted">{msg.injections}</span>
                              </div>
                            </div>
                          )}

                          <p className="text-[10px] text-text-muted italic">{msg.disclaimer}</p>
                        </div>
                      )}

                      {msg.unknownTopic && (
                        <button
                          onClick={() => {
                            setTeachForm({ ...teachForm, keyword: msg.unknownTopic });
                            setTeachMode(true);
                          }}
                          className="mt-2 inline-flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer"
                        >
                          <GraduationCap className="w-3.5 h-3.5" /> Teach "{msg.unknownTopic}"
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Quick Topic Chips */}
              <div className="px-3 py-2 bg-surface border-t border-border-subtle flex gap-1.5 overflow-x-auto">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => askQuestion(q)}
                    className="px-2.5 py-1 rounded-full bg-bg-app border border-border-subtle text-[11px] font-medium text-text-muted hover:border-primary hover:text-primary shrink-0 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="p-3 bg-surface border-t border-border-subtle flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about dog bite, tetanus, fever..."
                  className="flex-1 px-3 py-2 rounded-lg border border-border-subtle text-xs focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleVoiceQuestion}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                    listeningChat
                      ? 'bg-emergency/10 border-emergency text-emergency animate-pulse'
                      : 'border-border-subtle text-text-muted hover:text-primary hover:border-primary'
                  }`}
                  aria-label="Ask by voice"
                  title="Ask by voice"
                >
                  {listeningChat ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="ml-auto flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-white font-semibold text-xs shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
      >
        <MessageCircle className="w-5 h-5" />
        <span>First-Aid AI</span>
      </button>
    </div>
  );
}