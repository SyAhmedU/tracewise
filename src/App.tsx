import { useEffect, useState } from 'react';
import { type Workflow, newWorkflow } from './lib/types';
import {
  listWorkflows, saveWorkflow, deleteWorkflow, getWorkflow,
  loadAutosave, writeAutosave, clearAutosave,
} from './lib/store';
import SyedBar from './components/SyedBar';
import Landing from './components/Landing';
import Wizard from './components/Wizard';

type Mode = 'home' | 'wizard';

export default function App() {
  const [mode, setMode] = useState<Mode>('home');
  const [wf, setWf] = useState<Workflow | null>(null);
  const [stage, setStage] = useState(0);
  const [workflows, setWorkflows] = useState<Workflow[]>(() => listWorkflows());
  const [resume, setResume] = useState<{ wf: Workflow; stage: number } | null>(() => loadAutosave());

  // autosave the in-progress capture
  useEffect(() => {
    if (mode === 'wizard' && wf) writeAutosave(wf, stage);
  }, [wf, stage, mode]);

  const update = (fn: (d: Workflow) => void) => {
    setWf((prev) => {
      if (!prev) return prev;
      const next: Workflow = structuredClone(prev);
      fn(next);
      next.updatedAt = Date.now();
      return next;
    });
  };

  const startNew = () => { setWf(newWorkflow()); setStage(0); setMode('wizard'); };
  const open = (id: string) => { const w = getWorkflow(id); if (w) { setWf(w); setStage(0); setMode('wizard'); } };
  const doResume = () => { if (resume) { setWf(resume.wf); setStage(resume.stage); setMode('wizard'); } };

  const saveExit = () => {
    if (wf && (wf.outputName.trim() || wf.steps.length > 0)) saveWorkflow(wf);
    clearAutosave();
    setResume(null);
    setWorkflows(listWorkflows());
    setWf(null);
    setMode('home');
    window.scrollTo(0, 0);
  };

  const remove = (id: string) => {
    deleteWorkflow(id);
    setWorkflows(listWorkflows());
  };

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      <SyedBar projectName="Tracewise — map the work you actually do" />
      <main style={{ flex: 1, width: '100%', maxWidth: 760, margin: '0 auto', padding: '28px 20px 80px' }}>
        {mode === 'home' && (
          <Landing
            workflows={workflows}
            onNew={startNew}
            onOpen={open}
            onDelete={remove}
            resumeAvailable={!!resume}
            onResume={doResume}
          />
        )}
        {mode === 'wizard' && wf && (
          <Wizard wf={wf} update={update} stage={stage} setStage={setStage} onSaveExit={saveExit} />
        )}
      </main>
    </div>
  );
}
