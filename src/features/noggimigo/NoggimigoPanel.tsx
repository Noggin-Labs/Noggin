import { useEffect, useState } from "react";
import { ArrowRight, Lightbulb, LoaderCircle, Sparkles, Wifi, WifiOff } from "lucide-react";
import "./NoggimigoPanel.css";

type LessonId = "fractions" | "equivalent-fractions" | "algebra-balance" | "photosynthesis" | "circuits" | "phonics" | "emotion-compass";
type Prompt = { completed?: boolean; lesson_id?: string; title?: string; question?: string; progress?: string; message?: string };
type SessionPayload = {
  session_id: string;
  lesson_id: string;
  lesson: { title: string; subject: string; topic: string; objective: string };
  prompt: Prompt;
  model_enabled: boolean;
  result?: { status: string; feedback: string; advanced?: boolean; completed?: boolean; model_message?: string; model_fallback?: boolean };
};

const lessonMap: Record<LessonId, string> = {
  fractions: "fractions_intro",
  "equivalent-fractions": "equivalent_fractions",
  "algebra-balance": "algebra_intro",
  photosynthesis: "photosynthesis_intro",
  circuits: "circuits_intro",
  phonics: "phonics_intro",
  "emotion-compass": "emotion_compass_intro",
};

const apiBase = (import.meta.env.VITE_NOGGIMIGO_API_URL || "http://localhost:8000").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail || `Noggimigo request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function NoggimigoPanel({ lessonId }: { lessonId: LessonId }) {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<SessionPayload["result"] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setSession(null);
    setFeedback(null);
    setHint("");
    setAnswer("");
    setError("");
    setBusy(true);
    request<SessionPayload>("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonMap[lessonId] }),
      signal: controller.signal,
    }).then(setSession).catch((reason: unknown) => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Noggimigo is unavailable.");
    }).finally(() => {
      if (!controller.signal.aborted) setBusy(false);
    });
    return () => controller.abort();
  }, [lessonId]);

  const askForHint = async () => {
    if (!session) return;
    setBusy(true);
    setError("");
    try {
      const payload = await request<SessionPayload & { result: { feedback: string } }>(
        `/api/sessions/${session.session_id}/hint`, { method: "POST" },
      );
      setSession(payload);
      setHint(payload.result.feedback);
      setFeedback(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The hint could not be loaded.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!session || !answer.trim()) return;
    setBusy(true);
    setError("");
    try {
      const payload = await request<SessionPayload>(
        `/api/sessions/${session.session_id}/answer`,
        { method: "POST", body: JSON.stringify({ answer: answer.trim() }) },
      );
      setSession(payload);
      setFeedback(payload.result || null);
      setHint("");
      if (payload.result?.advanced) setAnswer("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Your answer could not be checked.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="noggimigo-panel" aria-label="Noggimigo learning companion">
      <div className="noggimigo-panel-heading">
        <span className="noggimigo-avatar"><Sparkles size={17}/></span>
        <div><strong>Noggimigo</strong><small>Your learning companion</small></div>
        <span className={error ? "noggimigo-status offline" : "noggimigo-status"} title={error ? "Connection unavailable" : "Connected to the tutoring runtime"}>
          {error ? <WifiOff size={13}/> : <Wifi size={13}/>}
          {error ? "Offline" : "Connected"}
        </span>
      </div>
      {busy && !session ? <div className="noggimigo-loading"><LoaderCircle size={16}/> Starting your lesson…</div> : null}
      {error ? <p className="noggimigo-error" role="status">{error} Start the Python API to use guided tutoring.</p> : null}
      {session ? <>
        <div className="noggimigo-progress"><span>{session.lesson.topic}</span><span>{session.prompt.progress || (session.prompt.completed ? "Complete" : "")}</span></div>
        <p className="noggimigo-question">{session.prompt.completed ? "You have reached the end of this guided practice." : session.prompt.question}</p>
        {hint ? <div className="noggimigo-hint"><Lightbulb size={15}/><span>{hint}</span></div> : null}
        {feedback ? <div className={feedback.advanced ? "noggimigo-feedback success" : "noggimigo-feedback"}>
          <strong>{feedback.status === "CORRECT" ? "That's correct." : feedback.status === "COMPLETE" ? "Practice complete." : "Let's try another way."}</strong>
          <p>{feedback.model_message || feedback.feedback}</p>
          {feedback.model_fallback ? <small>Using the verified deterministic tutor response.</small> : null}
        </div> : null}
        {!session.prompt.completed ? <div className="noggimigo-answer-row">
          <input aria-label="Your answer for Noggimigo" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void submit(); }} placeholder="Try an answer…" maxLength={200}/>
          <button onClick={() => void submit()} disabled={busy || !answer.trim()} aria-label="Submit answer"><ArrowRight size={16}/></button>
        </div> : null}
        <button className="noggimigo-hint-button" onClick={() => void askForHint()} disabled={busy || !!session.prompt.completed}>
          {busy ? <LoaderCircle size={14} className="spin"/> : <Lightbulb size={14}/>} Ask for a hint
        </button>
        <small className="noggimigo-footnote">{session.model_enabled ? "Local language model enabled · answers remain deterministically verified." : "Deterministic tutoring active · optional local model is off."}</small>
      </> : null}
    </section>
  );
}
