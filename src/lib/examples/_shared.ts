// Shared types + factory for the worked-example library. Each sector file
// exports an array of WorkedExample using the helpers here.
import {
  type Workflow, type Step, type Frequency, type FrictionTag,
  SCHEMA_VERSION, uid,
} from '../types';

export type StepSpec = Partial<Step> & { action: string };

export function S(order: number, p: StepSpec): Step {
  return {
    id: uid('st'), order,
    action: p.action,
    tool: p.tool ?? '',
    inputWhat: p.inputWhat ?? '',
    inputSource: p.inputSource ?? '',
    outputWhat: p.outputWhat ?? '',
    outputDestination: p.outputDestination ?? '',
    timeMins: p.timeMins ?? null,
    frequency: (p.frequency ?? null) as Frequency | null,
    frictionTags: (p.frictionTags ?? []) as FrictionTag[],
    isShadow: p.isShadow ?? false,
    needsJudgment: p.needsJudgment ?? false,
    isPainful: p.isPainful ?? false,
    notes: p.notes ?? '',
  };
}

export interface WfSpec {
  role: string;
  context: string;
  outputName: string;
  officialVersion: string;
  instanceAnchor: string;
  trigger: string;
  steps: Step[];
  handoffs: { direction: 'wait-on' | 'hand-to'; who: string; what: string; typicalDelay: string }[];
  exceptions: { trigger: string; whatYouDo: string; howOften: string }[];
}

export function mk(spec: WfSpec): Workflow {
  const now = Date.now();
  return {
    id: uid('wf'),
    schemaVersion: SCHEMA_VERSION,
    role: spec.role,
    context: spec.context,
    outputName: spec.outputName,
    officialVersion: spec.officialVersion,
    instanceAnchor: spec.instanceAnchor,
    trigger: spec.trigger,
    steps: spec.steps,
    handoffs: spec.handoffs.map((h) => ({ id: uid('ho'), ...h })),
    exceptions: spec.exceptions.map((e) => ({ id: uid('ex'), ...e })),
    createdAt: now,
    updatedAt: now,
  };
}

export interface WorkedExample {
  key: string;
  label: string;
  domain: string;
  region?: string;
  emoji: string;
  summary: string;
  /** One or two sentences naming the field-specific human / cultural / trust
   * dynamic that any AI or automation intervention here will hit. The shadow
   * tools and personal registers in the workflow are usually SOLUTIONS to this
   * dynamic, not bugs — replacing them mechanically without addressing the
   * underlying need is what causes resistance and quiet rejection. */
  behavioralContext: string;
  /** One or two sentences naming what a realistic, field-appropriate
   * intervention actually looks like — taking the behavioral context above
   * seriously. Deliberately specific, not generic. */
  fieldSpecificFit: string;
  build: () => Workflow;
}
