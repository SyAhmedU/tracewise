import { useEffect, useState } from 'react';
import { type Workflow, newWorkflow } from './lib/types';
import {
  listWorkflows, saveWorkflow, deleteWorkflow, getWorkflow,
  loadAutosave, writeAutosave, clearAutosave, linkHandoff,
} from './lib/store';
import type { WorkedExample } from './lib/examples';
import SyedBar from './components/SyedBar';
import Landing from './components/Landing';
import Wizard from './components/Wizard';
import Ecosystem from './components/Ecosystem';

type Mode = 'home' | 'wizard' | 'ecosystem';

/** The example-level interpretation that travels with a loaded worked example —
 * shown in the Automation-Fit stage next to the engine's computed scores so the
 * human read and the deterministic output sit side by side. Null for blank or
 * saved/reopened workflows. */
export type ExampleRead = { label: string; behavioralContext: string; fieldSpecificFit: string };

export default function App() {
  const [mode, setMode] = useState<Mode>('home');
  const [wf, setWf] = useState<Workflow | null>(null);
  const [stage, setStage] = useState(0);
  const [workflows, setWorkflows] = useState<Workflow[]>(() => listWorkflows());
  const [resume, setResume] = useState<{ wf: Workflow; stage: number } | null>(() => loadAutosave());
  const [exampleRead, setExampleRead] = useState<ExampleRead | null>(null);

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

  const startNew = () => { setExampleRead(null); setWf(newWorkflow()); setStage(0); setMode('wizard'); };
  const loadExample = (ex: WorkedExample) => {
    setExampleRead({ label: ex.label, behavioralContext: ex.behavioralContext, fieldSpecificFit: ex.fieldSpecificFit });
    setWf(ex.build()); setStage(0); setMode('wizard'); window.scrollTo(0, 0);
  };
  const open = (id: string) => { const w = getWorkflow(id); if (w) { setExampleRead(null); setWf(w); setStage(0); setMode('wizard'); } };
  const doResume = () => { if (resume) { setExampleRead(null); setWf(resume.wf); setStage(resume.stage); setMode('wizard'); } };

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

  const openEcosystem = () => { setMode('ecosystem'); window.scrollTo(0, 0); };
  const confirmLink = (workflowId: string, handoffId: string, targetId: string | null) => {
    linkHandoff(workflowId, handoffId, targetId);
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
            onLoadExample={loadExample}
            onEcosystem={openEcosystem}
          />
        )}
        {mode === 'wizard' && wf && (
          <Wizard wf={wf} update={update} stage={stage} setStage={setStage} onSaveExit={saveExit} exampleRead={exampleRead} singlePage={!!exampleRead} />
        )}
        {mode === 'ecosystem' && (
          <Ecosystem
            workflows={workflows}
            onBack={() => { setMode('home'); window.scrollTo(0, 0); }}
            onLink={confirmLink}
            onOpen={open}
          />
        )}
      </main>
    </div>
  );
}
