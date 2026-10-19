#!/usr/bin/env node
/** One-shot seed writer for top public exercises (idempotent overwrite). */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'exercises');

const items = [
	{
		id: 'question-led-rough-prototype',
		title: 'Question-led rough prototype',
		urn: 'urn:in-practice:exercise:129910890898c06d58c0c8da',
		technique_id: 'question-led-prototype',
		status: 'ready',
		categories: ['urn:in-practice:concept:prototyping', 'family:development'],
		fieldlex: ['ct:prototyping', 'ct:generativeAiCoCreation'],
		units: ['U3', 'U5'],
		summary:
			'Build the smallest surface that answers one test question. Optional generative tools stay in early variation; you keep the final form.',
		time_min: 20,
		group: 'alone to make; one classmate tests',
		materials: [
			'shared class brief or D1 problem',
			'paper/card or digital mock-up tool',
			'optional generative tool for early variation only',
		],
		requirements: [
			'Write the test question before you build.',
			'If you use GenAI, log prompt, keep, and re-author moves.',
		],
		accessibility: 'Seated digital mock-ups accepted; oral test answers OK.',
		steps: [
			'Write the one question this prototype must answer.',
			'Decide whether it tests role, look and feel, or how it works.',
			'Build only the surface needed to answer it — by hand, code, or staged tool output you then edit.',
			'If a generative tool supplied a variant, log the prompt, what you kept, and what you re-authored.',
			'Let one classmate try the prototype; record the answer to your question.',
		],
		adaptation:
			'20-minute class timing; optional GenAI for variation only; mandatory prompt/edit log are professor adaptations of the sprint prototype mindset.',
		quote: {
			chicago: '(Knapp, Zeratsky, and Kowitz 2016, chap. 13)',
			verbatim:
				'The prototype is meant to answer questions, so keep it focused. […] You don’t need a fully functional product—you just need a real-looking façade to which customers can react.',
			ref_key: 'knapp-2016',
		},
		portfolio_trace: 'The brief; the test question; before/after; prompts or manual steps; the test answer.',
		judged_by: 'Portfolio rubric — creative fluency, flexibility, and originality',
		ahmes: {
			document_coat: '98b7e339',
			vault_slug:
				'jake_knapp_john_zeratsky_braden_kowitz_sprint_how_to_solve_big_problems_and_test_new_ideas_in_just_five_days_simon_schuster_2016_98b7e339',
			nodes: [
				{
					node_id: '9b6eece5-281f-552e-8dfe-ebfa855d4c7e',
					page_index: 89,
					chicago: '(Knapp, Zeratsky, and Kowitz 2016, chap. 13)',
					role: 'quote',
				},
			],
		},
	},
	{
		id: 'hits-and-dot-voting',
		title: 'Hits and dot voting',
		urn: 'urn:in-practice:exercise:c478dad9bd877b62478ffbf9',
		technique_id: 'hits-dot-voting',
		status: 'ready',
		categories: ['urn:in-practice:concept:selection', 'family:selection'],
		fieldlex: [],
		units: ['U2', 'U4'],
		summary:
			'Mark interesting parts in silence before you debate. Hits gather heat; a later vote decides — without groupthink in the first pass.',
		time_min: 15,
		group: '3–10',
		materials: ['idea sheets on a wall or board', 'dot stickers', 'optional digital whiteboard'],
		requirements: [
			'Ideas must already be visible (one per sheet).',
			'No talking during the heat-map pass.',
		],
		accessibility: 'Digital whiteboard voting; allow seated access to the wall.',
		steps: [
			'Put all ideas on the wall, one per note or sheet.',
			'Read in silence; each person places small dots on parts that look strong (hits).',
			'Each person then gets one larger vote for one idea.',
			'Cluster the dots and read out the top three.',
			'The decider (or the group) chooses, and records why.',
		],
		adaptation:
			'Classroom timing and portfolio fields are professor adaptations of the sprint sticky decision / heat map sequence.',
		quote: {
			chicago: '(Knapp, Zeratsky, and Kowitz 2016, chap. 10)',
			verbatim:
				'Heat map: Look at all the solutions in silence, and use dot stickers to mark interesting parts.',
			ref_key: 'knapp-2016',
		},
		portfolio_trace: 'Photo or list of dotted sheets; top three; chosen idea and criterion.',
		judged_by: 'Portfolio rubric — critical analysis and judgement',
		ahmes: {
			document_coat: '98b7e339',
			vault_slug:
				'jake_knapp_john_zeratsky_braden_kowitz_sprint_how_to_solve_big_problems_and_test_new_ideas_in_just_five_days_simon_schuster_2016_98b7e339',
			nodes: [
				{
					node_id: '81dab6ef-a500-58de-83d2-c23463dbb8f6',
					page_index: 0,
					chicago: '(Knapp, Zeratsky, and Kowitz 2016, chap. 10)',
					role: 'quote',
				},
			],
		},
	},
	{
		id: 'alternative-uses-task',
		title: 'Alternative Uses Task',
		urn: 'urn:in-practice:exercise:chen-aut-seed',
		technique_id: 'alternative-uses-task',
		status: 'ready',
		categories: ['urn:in-practice:concept:divergent-thinking', 'family:generation'],
		fieldlex: ['ct:divergentThinking'],
		units: ['U1', 'U2'],
		summary:
			'List many uses for one ordinary object under a timer. Fluency first; then notice flexibility across categories.',
		time_min: 15,
		group: 'individual, then shared board',
		materials: ['object or image', 'paper', 'timer'],
		requirements: ['One shared prompt object for the class.', 'No judging during the timed list.'],
		accessibility: 'Oral or typed lists accepted; image prompt can replace a physical object.',
		steps: [
			'Show one everyday object (brick, paperclip, shoe) and start a visible timer.',
			'Each student lists as many uses as possible in silence.',
			'Stop; count the list (fluency).',
			'Mark how many different categories appear (flexibility).',
			'Share two surprising uses with a neighbour; keep the full list for the portfolio.',
		],
		adaptation: 'Classroom timing and portfolio fields are course adaptations of the unusual-uses / brick prompt reported with Guilford’s abilities.',
		quote: {
			chicago: '(Chen 2011, 40)',
			verbatim:
				'How many uses can you think of for a brick? […] More interestingly, individuals differ considerably in terms of the number of answers they can come up with.',
			ref_key: 'chen-2012',
		},
		portfolio_trace: 'Timed list; fluency count; flexibility note; two shared uses.',
		judged_by: 'Portfolio rubric — creative fluency, flexibility, and originality',
		ahmes: {
			document_coat: 'd048ab99',
			vault_slug: 'chaomei_chen_turning_points_the_nature_of_creativity_d048ab99',
			nodes: [
				{
					node_id: '6ae8c91e-b6e0-50b4-9210-9a156249cabd',
					page_index: 39,
					chicago: '(Chen 2011, 40)',
					role: 'quote',
				},
				{
					node_id: '54682031-ef7a-5a49-bad5-7bc16670f05e',
					page_index: 39,
					chicago: '(Chen 2011, 40)',
					role: 'quote',
				},
			],
		},
	},
	{
		id: 'random-word-stimulation',
		title: 'Random word stimulation',
		urn: 'urn:in-practice:exercise:02d790f8312a82fe11c37e45',
		technique_id: 'random-word',
		status: 'ready',
		categories: ['urn:in-practice:concept:association', 'family:generation'],
		fieldlex: [],
		units: ['U2', 'U5'],
		summary:
			'Force a lateral jump: relate a random word to your brief, then show the path. Same word, many situations.',
		time_min: 10,
		group: 'individual, then brief share',
		materials: ['random word (card, book, or app)', 'brief', 'paper'],
		requirements: ['Agree one shared brief.', 'Do not swap the random word mid-pass.'],
		accessibility: 'Spoken paths accepted; seated work OK.',
		steps: [
			'State the problem in one sentence.',
			'Draw or receive one random word.',
			'Write three links from the word to the problem without judging them.',
			'Pick one link and sketch or note a design move it suggests.',
			'Optional: one student describes their path to the class so others see the same word used differently.',
		],
		adaptation: 'Ten-minute class clock and design-studio wording are professor adaptations of de Bono’s random-word classroom session.',
		quote: {
			chicago: '(de Bono 1970, 28)',
			verbatim:
				'Before they hand in their results some of the students are asked by the teacher to describe to the rest of the class how they related the word to their own problem. […] one can get an idea of how the same random word can be of use in many different situations.',
			ref_key: 'debono-1970',
		},
		portfolio_trace: 'Problem sentence; random word; three links; chosen move.',
		judged_by: 'Portfolio rubric — creative fluency, flexibility, and originality',
		ahmes: {
			document_coat: 'bb5aec96',
			vault_slug:
				'de_bono_edward_lateral_thinking_a_textbook_of_creativity_1970_viking_penguin_books_bb5aec96',
			nodes: [
				{
					node_id: '92fc3782-e726-5f29-86ba-6c984885b13c',
					page_index: 27,
					chicago: '(de Bono 1970, 28)',
					role: 'quote',
				},
			],
		},
	},
	{
		id: 'ask-a-crab',
		title: 'Ask a Crab — picture diverge',
		urn: 'urn:in-practice:exercise:6a53c97a0ceade0b828ae569',
		technique_id: 'brainstorming-osborn',
		status: 'ready',
		categories: ['urn:in-practice:concept:association', 'family:generation'],
		fieldlex: [],
		units: ['U4'],
		summary:
			'Use an unrelated picture to open workplace ideas before you judge. Save the path from image to idea — not only the favourite.',
		time_min: 20,
		group: 'same team as the U4 idea set',
		materials: ['unrelated picture prompt', 'U4 brief or workplace problem', 'paper'],
		requirements: [
			'Keep generation separate from selection.',
			'Record the picture ID or description in the trace.',
		],
		accessibility: 'Large-print or screen images; oral idea lists OK.',
		steps: [
			'Show one unrelated picture to the team.',
			'In a timed pass, each person writes ideas the picture suggests for the workplace brief.',
			'Read ideas aloud without ranking them yet.',
			'Save a short path: picture → association → idea.',
			'Stop before voting; selection belongs to a later exercise.',
		],
		adaptation:
			'Classroom adaptation of Ask a Crab’s early blueprint steps; full five-step source is not claimed as the class procedure.',
		quote: {
			chicago: '(Michalko 2010, 440)',
			verbatim:
				'Instruct the group members to examine each picture and write their ideas. After a designated period, ask the group members to read their ideas aloud.',
			ref_key: 'michalko-2010',
		},
		portfolio_trace: 'Picture note; idea list; one association path; no selection claim.',
		judged_by: 'Portfolio rubric — creative fluency, flexibility, and originality',
		ahmes: {
			document_coat: '2fa7eabe',
			vault_slug:
				'michalko_michael_thinkertoys_a_handbook_of_creative_thinking_techniques_2010_ten_speed_press_2fa7eabe',
			nodes: [
				{
					node_id: 'aa4b906e-9a2d-55e4-bd39-1dd0aad4c63d',
					page_index: 439,
					chicago: '(Michalko 2010, 440)',
					role: 'quote',
				},
			],
		},
	},
	{
		id: 'visitor-journey-walkthrough',
		title: 'Visitor Journey Walkthrough',
		urn: 'urn:in-practice:exercise:f518593e47f80d5a916ce40c',
		technique_id: 'contextual-observation',
		status: 'ready',
		categories: ['urn:in-practice:concept:observation', 'family:framing'],
		fieldlex: [],
		units: ['U4'],
		summary:
			'Walk a Creative Campus route from a first-time visitor’s side. Record actions and words; select one prior idea against evidence — not against taste.',
		time_min: 20,
		group: 'team; rotate walker, observer, recorder',
		materials: [
			'prior idea set (e.g. U4.1)',
			'agreed public campus route to the Atrium information point',
			'route note sheet',
		],
		requirements: [
			'Do not impersonate a disability or claim to represent a community.',
			'Do not record identifiable members of the public.',
			'Peer walkthroughs are not visitor research.',
		],
		accessibility: 'Seated route-map walkthrough allowed; mark observed vs imagined parts.',
		steps: [
			'Agree the Creative Campus route, destination, and a neutral first-time visitor task.',
			'One teammate walks without seeing the idea set; the observer records actions, words, pauses, and turns.',
			'Switch roles or use a seated map walkthrough if needed.',
			'Compare notes with the idea set; select one idea that responds to a recorded moment; name the criterion and one unresolved question.',
		],
		adaptation:
			'Professor adaptation of “Walking in the Customer’s Shoes” to a short Creative Campus route with portfolio fields.',
		quote: {
			chicago: '(Michalko 2010, 371)',
			verbatim:
				'Walking in the customer’s shoes. In this approach, people turn around to find out what it’s really like to be someone in a different position. […] Posing as customers, they walk',
			ref_key: 'michalko-2010',
		},
		portfolio_trace:
			'Route and task; roles; observation notes; selected idea and criterion; unresolved question; limitation note.',
		judged_by: 'Portfolio rubric — critical analysis and judgement',
		ahmes: {
			document_coat: '2fa7eabe',
			vault_slug:
				'michalko_michael_thinkertoys_a_handbook_of_creative_thinking_techniques_2010_ten_speed_press_2fa7eabe',
			nodes: [
				{
					node_id: 'd1f916c0-e642-5b14-8bde-88a0b6f9d3af',
					page_index: 370,
					chicago: '(Michalko 2010, 371)',
					role: 'quote',
				},
			],
		},
	},
	{
		id: 'reflection-in-action-log',
		title: 'Reflection-in-action log',
		urn: 'urn:in-practice:exercise:00ffb619768a6e98072728a5',
		technique_id: 'reflection-in-action-log',
		status: 'ready',
		categories: ['urn:in-practice:concept:reflection', 'family:reflection'],
		fieldlex: ['ct:processTransparency'],
		units: ['U3', 'U6'],
		summary:
			'Log surprises while you work — when the situation talks back — then name one move you changed.',
		time_min: 15,
		group: 'individual',
		materials: ['current making session', 'notebook or voice notes'],
		requirements: ['Log during work, not only after polishing.', 'Keep entries short and dated.'],
		accessibility: 'Voice notes accepted; no drawing required.',
		steps: [
			'During a short making pass, note three moments of surprise or resistance.',
			'For each, write what the work “said back” (a constraint, a failure, an unexpected fit).',
			'Name one strategy you changed in response.',
			'Mark whether the change opened or closed options.',
			'Keep the log beside the artefact for critique.',
		],
		adaptation: 'Classroom timing and portfolio fields adapt Schön’s reflective conversation to a short studio log.',
		quote: {
			chicago: '(Schön 1983, 79)',
			verbatim:
				'In a good process of design, this conversation with the situation is reflective. […] the situation talks back, the practitioner listens; and as he appreciates what he hears, he reframes',
			ref_key: 'schon-1983',
		},
		portfolio_trace: 'Three surprise notes; one changed strategy; open/close mark.',
		judged_by: 'Portfolio rubric — critical analysis and judgement',
		ahmes: {
			document_coat: '4d215203',
			vault_slug:
				'donald_a_schon_the_reflective_practitioner_how_professionals_think_in_action_1984_basic_books_4d215203',
			nodes: [
				{
					node_id: '6f338205-e0df-5f6a-af28-05067bfe7975',
					page_index: 11,
					chicago: '(Schön 1983, 79)',
					role: 'quote',
				},
				{
					node_id: '96a636ec-19f9-54e5-908a-ed823e8a7665',
					page_index: 13,
					chicago: '(Schön 1983, 79)',
					role: 'quote',
				},
			],
		},
	},
	{
		id: 'seed-collection',
		title: 'Seed collection',
		urn: 'urn:in-practice:exercise:01e7d7fc39c6197869ddaeea',
		technique_id: 'seed-collection',
		status: 'ready',
		categories: ['urn:in-practice:concept:creative-habits', 'family:generation'],
		fieldlex: [],
		units: ['U2', 'U4', 'U6'],
		summary:
			'Collect many small starting points without ranking them. Later, water the ones that still resonate — photos, phrases, and sounds all count.',
		time_min: 20,
		group: 'individual or pairs',
		materials: ['notebook or phone notes', 'optional camera for tools/fixtures only (no people)'],
		requirements: [
			'Do not rank while collecting.',
			'If photographing on campus: tools and fixtures only; no faces or badges.',
		],
		accessibility: 'Voice notes, photos or text all count as seeds.',
		steps: [
			'Collect at least five seeds (phrase, sound, image, tool, fixture) in one place.',
			'Do not compare or rank them while collecting.',
			'Pick three seeds that still interest you.',
			'Develop each in a different direction for five minutes.',
			'Keep the seed that grew most; note why.',
		],
		adaptation:
			'Compressed class timing; optional Creative Campus tool/fixture photography with a no-people rule is a professor adaptation.',
		quote: {
			chicago: '(Rubin 2023, 50)',
			verbatim:
				'The seed that doesn’t get watered cannot reveal its ability to bear fruit. Collect many seeds and then, over time, look back and see which ones resonate.',
			ref_key: 'rubin-2023',
		},
		portfolio_trace: 'Five seeds; three developed; one kept with reason; consent note if photos.',
		judged_by: 'Portfolio rubric — creative fluency, flexibility, and originality',
		ahmes: {
			document_coat: '574691eb',
			vault_slug: 'rick_rubin_the_creative_act_a_way_of_being_penguin_publishing_group_2023_574691eb',
			nodes: [
				{
					node_id: '891dfa26-d0fd-5024-87dd-3fb34bd87100',
					page_index: 49,
					chicago: '(Rubin 2023, 50)',
					role: 'quote',
				},
			],
		},
	},
	{
		id: 'process-trail',
		title: 'Process trail',
		urn: 'urn:in-practice:exercise:a073813313fed5939b6194af',
		technique_id: 'process-trail',
		status: 'ready',
		categories: ['urn:in-practice:concept:reflection', 'family:reflection'],
		fieldlex: ['ct:processTransparency'],
		units: ['U1', 'U5'],
		summary:
			'Order every version and discarded idea on one board. Mark diverge and converge; write the turning point assessors can read.',
		time_min: 20,
		group: 'individual; optional pair read',
		materials: ['exports from a recent making loop', 'one board slide or A3 sheet'],
		requirements: ['Include discarded options.', 'Attach tool prompts where they belong.'],
		accessibility: 'Digital board accepted; voice caption for the turning point OK.',
		steps: [
			'Save every version, sketch, and discarded idea with a date or order number.',
			'Arrange them in order on one page or board.',
			'Mark where you diverged (opened options) and converged (closed them).',
			'Write one paragraph on the turning point — what changed your direction?',
			'Attach tool prompts to the steps where they belong.',
		],
		adaptation:
			'Professor adaptation of process-journal catalogue practice; diverge/converge marks and GenAI prompt attachments are course wording (source status: gap).',
		quote: {
			chicago: '(course adaptation)',
			verbatim:
				'Arrange every version in order; mark where you opened options and where you closed them; name the turning point.',
			ref_key: '',
		},
		portfolio_trace: 'Ordered trail; diverge/converge marks; turning-point paragraph; prompt attachments.',
		judged_by: 'Portfolio rubric — critical analysis and judgement',
		ahmes: {
			document_coat: '',
			vault_slug: '',
			nodes: [],
		},
	},
	{
		id: 'mental-locks-audit',
		title: 'Mental locks audit',
		urn: 'urn:in-practice:exercise:0b497d0ff09fe1fe764b1c52',
		technique_id: 'mental-locks-audit',
		status: 'ready',
		categories: ['urn:in-practice:concept:reflection', 'family:reflection'],
		fieldlex: [],
		units: ['U6'],
		summary:
			'Name the belief that closed an idea. Reopen one locked path for five minutes — personal development as craft, not soft-skill theatre.',
		time_min: 15,
		group: 'individual',
		materials: ['a dropped or blocked idea from recent work', 'paper'],
		requirements: ['Stay tied to a making brief.', 'Do not treat this as therapy.'],
		accessibility: 'Typed or oral audit OK.',
		steps: [
			'Pick one idea you dropped this week.',
			'Write the belief or rule that closed it (the “lock”).',
			'Reopen the idea for five minutes under a temporary opposite rule.',
			'Note what appeared that the lock had blocked.',
			'Decide keep, transform, or shelve — with one craft reason.',
		],
		adaptation:
			'Classroom adaptation of Open Mental Locks catalogue records (von Oech held; steps are course wording).',
		quote: {
			chicago: '(course adaptation)',
			verbatim:
				'Name the lock that closed the idea; reopen it under an opposite rule for five minutes; decide with a craft reason.',
			ref_key: '',
		},
		portfolio_trace: 'Dropped idea; lock sentence; five-minute reopen note; keep/transform/shelve.',
		judged_by: 'Portfolio rubric — critical analysis and judgement',
		ahmes: {
			document_coat: '',
			vault_slug: '',
			nodes: [],
		},
	},
];

for (const ex of items) {
	if (!ex.ahmes.document_coat) delete ex.ahmes;
	writeFileSync(join(dir, `${ex.id}.yml`), yaml.dump(ex, { lineWidth: 100, noRefs: true }), 'utf8');
	console.log('wrote', ex.id);
}
console.log(`seeded ${items.length} exercises`);
