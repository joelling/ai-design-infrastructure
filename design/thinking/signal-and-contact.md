# Signal and Contact

*2026-04-07*

---

User research is usually described as a service. It serves delivery — it answers questions the product team needs answered before the next decision. It is timed to project phases, categorised by method, and evaluated by whether it produced usable outputs in time. Organisations that take it seriously enough build research practices: dedicated researchers, scheduled studies, insight repositories, regular cadences of usability testing. Those that take it less seriously commission it episodically, when something needs validating, when a decision is too exposed to make without cover.

This framing is not wrong, but it is incomplete in a way that matters. User research is not one thing that can be performed at different levels of rigour. It contains two fundamentally different acts that happen to share a name. The first is contact: being present with a human in a specific moment, attending to what they say and what they don't, constructing an understanding of their world from a position inside it. The second is synthesis: processing signals — transcripts, support tickets, survey responses, usage data — into patterns. Both are valuable. They are not substitutes. Contact generates novel evidence. Synthesis reorganises existing evidence. Treating them as points on the same continuum is the framing error that AI now makes consequential.

What has historically fused these two acts is economics. Synthesis was expensive. Analysing fifty interviews, building an affinity diagram, coding themes, writing a research report — this consumed weeks of a researcher's time. The cost of this synthesis was absorbed into the cost of the study, so the two acts were bundled: you did the study and you did the analysis, and both counted as research. AI is now separating them. Synthesis is becoming cheap, fast, and largely automatable. Contact is not. What that separation reveals is that the two acts have always been distinct — and that an organisation that mistakes one for the other has not reduced its research spend. It has changed what it is actually doing.

---

## A. The Research Horizon

```
  ┌─────────────────┬──────────────────┬───────────────────┐
  │   GENERATIVE    │   EVALUATIVE     │   CONFIRMATORY    │
  │                 │                  │                   │
  │ Ethnography     │ Concept Testing  │ A/B Testing       │
  │ Field Studies   │ Usability Tests  │ Surveys           │
  │ Diary Studies   │ Prototype Review │ Analytics         │
  │ Mental Models   │ Expert Review    │ Benchmarking      │
  ├─────────────────┼──────────────────┼───────────────────┤
  │ "What world do  │ "Does our        │ "Which of these   │
  │  they inhabit?" │  approach work?" │  works better?"   │
  ├─────────────────┼──────────────────┼───────────────────┤
  │ Months          │ Weeks            │ Days              │
  │ High contact    │ Moderate contact │ Low contact       │
  │ Output: Insight │ Output: Guidance │ Output: Decision  │
  └─────────────────┴──────────────────┴───────────────────┘
  ◀─── STRATEGIC                                TACTICAL ───▶
```

The standard taxonomy of user research positions a spectrum from strategic to tactical, generative to evaluative, with methods arrayed along it according to time horizon and proximity to a product decision. At one end: ethnographic field studies, longitudinal panels, diary studies, mental model research. At the other: A/B tests, exit surveys, funnel analytics, five-second tests. Between them, usability testing, concept validation, prototype walkthroughs, card sorting. The framing is familiar enough to have become invisible — so familiar that the epistemological difference between the two ends has been smoothed over, treated as a matter of time horizon and budget rather than a fundamental difference in what kind of knowing is being produced.

The three modes of inquiry described above are not just different methods operating at different speeds. They ask different kinds of questions and produce different kinds of answers. Confirmatory research — A/B tests, benchmarking, surveys — asks which of two known options performs better. The world it operates in is closed: the options are defined, the metrics are set, the answer is a number. Evaluative research asks whether a proposed solution works for the people it was designed for. This world is slightly more open: the solution exists, but its fit with human behaviour is unknown and must be tested. The question is empirical but the answer is qualitative — "this works but that part doesn't, and here's why". Generative research asks what world the researcher has not yet entered. There is no proposed solution. There may not yet be a defined problem. The researcher is not testing a model of the user — they are constructing one from first contact.

These three modes cannot be substituted for each other. This seems obvious when stated directly, but the practical consequences are consistently underestimated. Getting a usability test result does not answer a generative question. An A/B test that shows version B outperforms version A tells you nothing about whether either version solves the right problem. An organisation that runs regular usability tests and continuous A/B experiments has a competent confirmatory and evaluative research practice. It does not have a generative research practice. What it understands well is how users respond to solutions it has already proposed. What it does not understand — and cannot understand from the methods it is running — is the world those users actually inhabit, the jobs they are actually trying to do, the constraints and meanings that shape their behaviour independently of any product.

Teresa Torres, in her work on continuous discovery, identifies the discipline of maintaining a regular cadence of customer interviews as the engine of a healthy product team. The insight is correct, but it is easy to misread. The cadence matters because regularity builds the habit of contact — weekly interviews keep the researcher in the field, accumulating small observations that compound into genuine understanding. What the cadence cannot do is substitute for the depth and structure of generative research when the product team is operating in a domain they have not yet properly understood. Continuous discovery is a maintenance mechanism. It keeps an existing understanding current. It is not the same as building the understanding in the first place.

The structural reason generative research is chronically underinvested is not that organisations are incurious. It is that generative research is structurally harder to sell and slower to produce legible output. A usability test delivers a prioritised list of issues by Friday. An ethnographic study delivers insight over months, in the form of stories and patterns that require interpretation and carry genuine uncertainty. The output of generative research cannot be put in a spreadsheet. The decision it informs may not even be a decision yet — it may be the prior question of whether the problem is the right problem. This is exactly the kind of thinking that Erika Hall, in *Just Enough Research*, argues organisations should do more of. Her phrase "just enough" is well-intentioned, but it is calibrated against a baseline of zero — any generative research is more than most teams are doing. The framing accepts the underinvestment rather than challenging it.

Karl Weick's concept of sensemaking offers a more precise description of what generative research actually does. Weick argues that in ambiguous and dynamic situations, people do not discover a pre-existing world — they enact one. The generative researcher is not uncovering facts about users that were always there, waiting to be found. They are constructing a model of a world through sustained contact with it, and that model is always partial, always perspectival, always subject to revision. This is not a weakness of generative research — it is its honest character. The pretence that research produces certainty rather than confidence calibration is the error, not the uncertainty itself.

The synthesis bottleneck reinforced this structural dynamic. Generative research is contact-intensive — it requires weeks in the field — but it is also synthesis-intensive. Fifty interviews produce perhaps two hundred pages of transcript. Turning that corpus into actionable insight — finding the patterns, building the mental model, identifying the tension dimensions that actually explain behaviour — consumed as much researcher time as the fieldwork itself. This made generative research expensive in a way that usability testing was not, and it made the investment harder to justify when the output was uncertain by design. The cost pushed organisations toward research they could afford, not research that answered the questions they most needed answered.

---

## B. How This Changes With AI

```
  ┌─────────────────┬──────────────────┬───────────────────┐
  │   GENERATIVE    │   EVALUATIVE     │   CONFIRMATORY    │
  │                 │                  │                   │
  │ Ethnography     │ Concept Testing  │ A/B Testing       │
  │ Field Studies   │ Usability Tests  │ Surveys           │
  │ Diary Studies   │ Prototype Review │ Analytics         │
  │ Mental Models   │ + Synthetic      │ Benchmarking      │
  │                 │   Participants   │                   │
  ├─────────────────┴──────────────────┴───────────────────┤
  │         NEW: Passive Signal Mining                     │
  │  support tickets · reviews · forums · usage data       │
  │  — large-scale pattern extraction, not contact         │
  ├─────────────────┬──────────────────┬───────────────────┤
  │ Unchanged       │ Synthesis: hours │ Continuous, not   │
  │                 │   not weeks      │   episodic        │
  ├─────────────────┼──────────────────┼───────────────────┤
  │ Bottleneck:     │ Bottleneck:      │ Bottleneck:       │
  │ Contact quality │ Inquiry design   │ Question quality  │
  └─────────────────┴──────────────────┴───────────────────┘
  ◀─── STRATEGIC                                TACTICAL ───▶
```

The first change is economic. The synthesis bottleneck that historically shaped where research investment flowed is collapsing. Transcription, thematic coding, affinity clustering, persona drafting from raw notes — work that once consumed weeks now takes hours. This changes the cost structure of qualitative research at every point on the spectrum. The evaluative study that previously took a researcher two weeks to analyse can now be turned around in a day. Continuous discovery programmes that required a full-time researcher to sustain become viable for teams that couldn't previously afford the overhead. The structural advantage of confirmatory research — cheap, fast, legible — is diminished when qualitative synthesis is no longer slow.

The second change is the emergence of new research categories that did not previously exist as a named practice.

Passive signal mining is the large-scale analysis of signals users produce without being studied: support tickets, app reviews, forum discussions, community posts, help-seeking behaviour, usage telemetry. This is not ethnography — the researcher was not present. It is not survey data — the users were not asked questions. It is a distinct category with its own epistemological character. What passive signal mining can reveal is what users said in unguarded moments, at scale, without research contamination from a facilitator's presence or a study's framing. It surfaces frequency distributions of pain signals, terminology, workarounds, and unmet needs across populations far larger than any study could recruit. What it cannot reveal is what users meant. Text without context — a support ticket without the session that preceded it, a forum post without the face that wrote it — is signal without interpretation. Pattern without cause.

Synthetic participants are AI simulations derived from existing research data — personas made computationally responsive rather than descriptively static, capable of reacting to new design concepts in ways that reflect the behavioural patterns the research revealed. This is a useful and contested category. Useful because it compresses the feedback loop between concept generation and first reaction: a designer can stress-test a new approach against a synthetic user before committing to a study. Contested because synthetic participants are a mirror of the evidence base, not a window on the world. They know only what the research knew. A synthetic participant built from six interviews conducted eighteen months ago reflects the world as it was understood then. The unexpected finding — the thing the study was not designed to surface but surfaced anyway — is precisely what a synthetic participant cannot generate. The value of synthetic participants is for early triangulation within a known evidence space. They cannot extend the evidence space.

What none of this changes is the epistemology of contact.

AI can synthesise any corpus. It cannot extend the corpus. The researcher who is physically present with a person — watching them hesitate before a term they would never use in a survey, noticing the workaround built into a workflow that no ticket ever described, hearing the offhand comment after the formal interview ends that reframes everything that came before it — is doing something categorically different from the researcher reading a synthesised report of existing signals. Contact generates novel evidence. It is the act of entering a world that would otherwise remain opaque. Synthesis reorganises evidence that already exists. It cannot produce the finding that was not already, in some form, in the data. It cannot generate the insight that comes from a researcher noticing something they were not looking for.

This distinction is not new. Steve Portigal's work on interviewing is built on the practice of creating the conditions in which a person reveals something they were not planning to reveal — through listening discipline, silence, careful sequencing, and a researcher's willingness to follow a thread that doesn't yet make sense. Indi Young's mental model research is grounded in the conviction that users' internal structures of reasoning can only be surfaced through sustained listening that is not yet in service of any solution. These practices require human presence. They cannot be replicated by processing signals that users already deposited elsewhere.

The failure mode this creates is the same failure mode identified in *The Weight at the Front*, applied to the research layer. AI synthesis is confident, readable, and structurally complete. A themes report extracted from four hundred support tickets looks like research. It has the format of research — user needs, pain points, frequency distributions, representative quotes. It will be filed in the insight repository alongside the field studies. It will be referenced in the design brief with equal weight. And it may be missing the one thing that a day in the field would have surfaced: the unexpected finding that reframes the problem, the behaviour that no ticket described because users had normalised it, the need so fundamental that no one thought to complain about its absence.

The organisation that has replaced field visits with passive signal mining has not done less research. It has done different research with different epistemological reach — and it may not have noticed the difference, because the output looks the same. This is the coherent wrongness risk applied one layer upstream. The pipeline described in *The Weight at the Front* executes faithfully from whatever the designer's foundations contain. What the designer's foundations contain is shaped by what the researcher provided. What the researcher provided is shaped by what they believed counted as research. If the researcher believes that a synthesised corpus is the same kind of evidence as witnessed contact, the error is invisible in the pipeline and invisible in the artefacts the pipeline produces — right up until the product meets the world it was not actually built for.

What AI changes, then, is where the constraint sits.

When synthesis is expensive, the bottleneck is back-end: the researcher's limiting factor is the time cost of analysis. When synthesis is cheap, the bottleneck moves to front-end: the researcher's limiting factor is inquiry design — the skill of deciding what is worth knowing, identifying who holds the knowledge, and creating the conditions in which they reveal it. This is the same structural shift described for the designer's role in the new pipeline. The burden relocates to the front, where it is less visible and less legible but more consequential.

The researcher who understands this is better positioned than before. Cheap synthesis means more research, faster, across more horizons. A generative study that previously consumed six weeks of synthesis time can now return initial patterns in a day, leaving the researcher free to spend more time in the field, with more participants, across wider contexts. Continuous discovery programmes become sustainable at smaller team sizes. The insight repository stays current rather than becoming a graveyard of studies commissioned for projects that have since shipped. The economics no longer force a choice between strategic and tactical — both become viable simultaneously.

The researcher who does not understand this is producing more evidence, faster, at higher apparent fidelity. They are running the synthesis pipeline on corpora that grow with each quarter of support tickets and forum posts. They are generating theme reports, priority stacks, and insight summaries that travel through the design pipeline as if they were the product of contact. They are not lying. The synthesis is correct. The themes are real. The output is just not the same thing as a researcher who has spent time in the world their users inhabit — and the difference will not be detectable in the artefacts until the product fails to fit the world it was built for.

---

The traditional framing of user research as a strategic-to-tactical spectrum was never quite right. It implied that the two ends were comparable in kind, differing only in time horizon and proximity to delivery. They were always epistemologically distinct. Generative research witnesses a world. Evaluative and confirmatory research tests a model of it. Both are necessary, and neither substitutes for the other. The spectrum framing obscured this by making the difference seem like a matter of budget and phase rather than a fundamental difference in what kind of knowing is being produced.

AI changes the economics of synthesis and creates new categories of signal processing — passive mining, synthetic participants, continuous analysis at scale — that are genuinely valuable and genuinely limited. The value is in volume, speed, and the ability to maintain an ongoing pulse across a large population without the cost of repeated studies. The limit is that none of it extends the corpus. None of it generates the insight that was not already, somewhere, in the existing evidence. None of it puts a researcher in the room.

The researcher's irreducible act is contact: entering a world the product has not yet modelled, attending closely enough to notice what was not planned, creating the conditions in which a person reveals something true. This has always been the act that mattered most and been invested in least. AI does not change that. It just makes the consequences of the gap harder to hide.

---

*Filed in: design/thinking/*
