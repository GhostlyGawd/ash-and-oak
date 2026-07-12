"use client";

import { useEffect, useMemo, useState } from "react";

type Tab = "Today" | "Work" | "World" | "Life" | "Chronicle";
type CommitmentId = "clinic" | "fever" | "debt";
type Tone = "good" | "bad" | "neutral";
type Patient = { id: string; name: string; detail: string; severity: number; diagnosed: boolean; status: "waiting" | "stable" | "recovered" | "lost"; canPay: boolean };
type Person = { name: string; role: string; trust: number; note: string };
type HistoryEvent = { id: string; day: number; title: string; summary: string; cause: string; effect: string; tone: Tone };
type GameState = {
  started: boolean; selectedCommitments: CommitmentId[]; day: number; season: string; year: number;
  silver: number; energy: number; stress: number; food: number; herbs: number; medicine: number;
  clinic: number; fever: number; bridge: number; reputation: number; debt: number; legalRisk: number;
  wellsKnown: boolean; templeObligation: boolean; clinicOpen: boolean; patients: Patient[];
  people: Record<string, Person>; history: HistoryEvent[]; lastSummary: string[]; legacy: number;
};
type Decision = {
  key: string; eyebrow: string; title: string; intention: string; why: string; cost: string[];
  effects: string[]; risks: string[]; affected: string[]; days: number; enabled: boolean; blocked?: string;
};

const commitmentInfo: Record<CommitmentId, { icon: string; title: string; promise: string; color: string }> = {
  clinic: { icon: "⌂", title: "Keep the clinic open", promise: "Give Riverward a place that heals anyone who reaches its door.", color: "moss" },
  fever: { icon: "⚕", title: "Contain the Greendale fever", promise: "Find the cause, treat the sick, and prevent another family from being lost.", color: "rust" },
  debt: { icon: "⚖", title: "Repay Maeve’s debt", promise: "Clear the apothecary loan without becoming someone Maeve would despise.", color: "ochre" },
};

const initial: GameState = {
  started: false, selectedCommitments: [], day: 17, season: "Harvestfall", year: 312,
  silver: 21, energy: 76, stress: 24, food: 4, herbs: 4, medicine: 2,
  clinic: 58, fever: 46, bridge: 61, reputation: 12, debt: 28, legalRisk: 0,
  wellsKnown: false, templeObligation: false, clinicOpen: true, legacy: 0,
  patients: [
    { id: "tomas", name: "Tomas Greendale", detail: "Farmer’s son · fever and shaking", severity: 74, diagnosed: true, status: "waiting", canPay: false },
    { id: "ilyra", name: "Ilyra Venn", detail: "Weaver · persistent cough", severity: 52, diagnosed: false, status: "waiting", canPay: true },
    { id: "brann", name: "Brann Oakward", detail: "Watchman · infected hand", severity: 37, diagnosed: false, status: "waiting", canPay: true },
  ],
  people: {
    mara: { name: "Mara Greendale", role: "Farmer and Tomas’s mother", trust: 42, note: "She brought Tomas through the rain and has no money to offer." },
    maeve: { name: "Maeve of Stillbrook", role: "Mentor and creditor", trust: 68, note: "Her loan built the clinic. She has never once asked for it back." },
    prior: { name: "Prior Aldren", role: "Keeper of the river temple", trust: 24, note: "He has medicine to spare, but temple gifts create public obligations." },
    ren: { name: "Ren Ashstep", role: "Former smuggling contact", trust: 36, note: "He can move medicine through quarantine—for a price and a future favor." },
  },
  history: [
    { id: "rain", day: 17, title: "The cold rain reached Greendale", summary: "Three households reported fever before the lower well was closed.", cause: "Early rain → flooded field drains → contaminated water", effect: "Fever pressure rose; the clinic began receiving patients.", tone: "bad" },
    { id: "clinic", day: 11, title: "Elara opened a room on Tanner’s Lane", summary: "Maeve’s loan bought two beds, a stove, and an apothecary cabinet.", cause: "Maeve trusted her former apprentice with 28 silver.", effect: "Riverward gained a public clinic; Elara gained a debt and a home.", tone: "good" },
  ],
  lastSummary: ["Cold rain contaminated the lower farms.", "Three patients arrived at your clinic.", "Your lease payment is due in six days."],
};

const patientNames = ["Sella Morn", "Corin Pike", "Nella Rowan", "Orren Vale", "Mira Fen"];
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const stamp = (g: GameState, suffix: string) => `${g.year}-${g.season}-${g.day}-${suffix}`;

function commitmentProgress(id: CommitmentId, g: GameState) {
  if (id === "clinic") return clamp((g.clinic + g.reputation) / 2);
  if (id === "fever") return clamp(100 - g.fever + (g.wellsKnown ? 15 : 0));
  return clamp(100 - (g.debt / 28) * 100);
}

function decisionFor(key: string, g: GameState): Decision {
  if (key.startsWith("diagnose:")) {
    const p = g.patients.find(x => x.id === key.split(":")[1])!;
    return { key, eyebrow: "Clinical decision", title: `Examine ${p.name}`, intention: "Learn what is actually wrong before spending scarce medicine.", why: "A diagnosis unlocks a targeted treatment and prevents waste.", cost: ["8 energy", "No time passes"], effects: ["Reveals the illness", "Unlocks treatment", "Builds Medicine experience"], risks: ["Other patients continue waiting"], affected: [p.name, "Riverward clinic"], days: 0, enabled: g.energy >= 8, blocked: "You are too exhausted to examine another patient." };
  }
  if (key.startsWith("treat:")) {
    const p = g.patients.find(x => x.id === key.split(":")[1])!;
    const can = p.diagnosed && g.medicine >= 1 && g.herbs >= 1;
    return { key, eyebrow: "Treatment decision", title: `Treat ${p.name}`, intention: p.canPay ? "Stabilize the patient with a full course of medicine." : "Treat them even though their family cannot pay.", why: `${p.name} is at ${p.severity}% severity. Waiting may make recovery harder.`, cost: ["1 medicine", "1 herb bundle", "10 energy"], effects: ["Patient becomes stable", p.canPay ? "+7 silver payment" : "+12 trust with Mara", "Fever pressure falls slightly"], risks: ["Only one medicine dose remains for other patients"], affected: [p.name, p.id === "tomas" ? "Mara Greendale" : "Riverward clinic"], days: 0, enabled: can, blocked: !p.diagnosed ? "Examine the patient first." : "You need 1 medicine and 1 herb bundle." };
  }
  const decisions: Record<string, Decision> = {
    investigate: { key, eyebrow: "Commitment: contain the fever", title: "Investigate the lower wells", intention: "Find the source instead of treating symptoms forever.", why: "The fever will keep creating patients until its cause is understood.", cost: ["1 day", "18 energy", "Clinic unattended"], effects: ["Reveals the outbreak’s cause", "Greatly advances the fever commitment", "Unlocks a permanent remedy"], risks: ["Waiting patients worsen by 6–12%", "Exposure may raise your stress"], affected: ["Greendale families", "Every current patient", "Riverward council"], days: 1, enabled: g.energy >= 18 && !g.wellsKnown, blocked: g.wellsKnown ? "You already traced the fever to the lower well." : "You need at least 18 energy." },
    cleanse: { key, eyebrow: "Permanent remedy", title: "Close and cleanse the lower well", intention: "Stop new infections at their source.", why: "Your investigation found field runoff entering a cracked stone lining.", cost: ["12 silver", "2 herb bundles", "1 day"], effects: ["Fever pressure falls sharply", "No new fever patients for several days", "+10 Greendale trust"], risks: ["The clinic lease will be harder to pay", "Greendale uses a distant well during repairs"], affected: ["Greendale families", "Riverward market", "Your clinic"], days: 1, enabled: g.wellsKnown && g.silver >= 12 && g.herbs >= 2, blocked: !g.wellsKnown ? "Investigate the wells first." : "You need 12 silver and 2 herb bundles." },
    temple: { key, eyebrow: "Political choice", title: "Ask the river temple for medicine", intention: "Restock today by accepting the temple’s help.", why: "Prior Aldren has medicine. His generosity is real, but never politically neutral.", cost: ["A public obligation", "No silver", "No time passes"], effects: ["Gain 3 medicine", "+8 trust with Prior Aldren", "Three patients can be treated"], risks: ["The temple may call on you later", "Independent healers may question your neutrality"], affected: ["Prior Aldren", "Your patients", "Healers’ guild"], days: 0, enabled: !g.templeObligation, blocked: "You already owe the river temple a public service." },
    smuggle: { key, eyebrow: "Illegal choice", title: "Buy medicine from Ren Ashstep", intention: "Use your old life to bypass the quarantine shortage.", why: "Ren can deliver tonight. The council has forbidden unregistered medicine on the river road.", cost: ["8 silver", "A favor owed to Ren", "No time passes"], effects: ["Gain 4 medicine", "+6 trust with Ren", "Clinic can treat four patients"], risks: ["+18 legal risk", "Discovery could damage clinic reputation"], affected: ["Ren Ashstep", "Oak Watch", "Your patients"], days: 0, enabled: g.silver >= 8, blocked: "You need 8 silver." },
    privateCare: { key, eyebrow: "Moral choice", title: "Accept a wealthy private patient", intention: "Earn enough to protect the clinic’s future.", why: "Master Vell will pay well for immediate attention while poorer patients wait.", cost: ["1 medicine", "12 energy", "Other patients wait"], effects: ["Gain 18 silver", "Debt becomes easier to repay", "+4 merchant standing"], risks: ["-6 local reputation", "Waiting patients worsen"], affected: ["Master Vell", "Mara Greendale", "Your clinic"], days: 0, enabled: g.medicine >= 1 && g.energy >= 12, blocked: "You need 1 medicine and 12 energy." },
    forage: { key, eyebrow: "Supply run", title: "Forage the Severwood margin", intention: "Trade a day of clinic time for ingredients you control.", why: "Yarrow and river reed still grow beyond the west road.", cost: ["1 day", "20 energy", "1 food ration"], effects: ["Gain 4 herb bundles", "No silver spent", "Survival experience"], risks: ["Patients worsen while you are away", "Road danger is moderate"], affected: ["Your patients", "Severwood gatherers"], days: 1, enabled: g.energy >= 20 && g.food >= 1, blocked: "You need 20 energy and one food ration." },
    repay: { key, eyebrow: "Personal obligation", title: "Pay Maeve 10 silver", intention: "Honor the trust that made your clinic possible.", why: `You still owe ${g.debt} silver. Maeve is not demanding payment—but the debt shapes every choice.`, cost: [`${Math.min(10, g.debt)} silver`, "No time passes"], effects: ["Debt falls", "+5 trust with Maeve", "Advances your chosen commitment"], risks: ["Fewer reserves for medicine and rent"], affected: ["Maeve of Stillbrook", "Your clinic"], days: 0, enabled: g.debt > 0 && g.silver >= Math.min(10, g.debt), blocked: g.debt <= 0 ? "Maeve’s debt is already repaid." : "You do not have enough silver." },
    rest: { key, eyebrow: "Recovery", title: "Close the clinic and rest", intention: "Recover before exhaustion begins causing mistakes.", why: "Rest is not a chore meter. It matters because patients depend on your judgment.", cost: ["1 day", "1 food ration", "Patients wait"], effects: ["Energy restored to 94", "Stress falls by 18", "Old wounds settle"], risks: ["Untreated patients worsen", "Fever continues spreading"], affected: ["You", "Every waiting patient"], days: 1, enabled: g.food >= 1, blocked: "You need one food ration." },
    endDay: { key, eyebrow: "Let the world move", title: "End the day", intention: "Accept what remains unfinished and see what tomorrow brings.", why: "Riverward continues whether or not every problem is solved.", cost: ["1 day", "Waiting patients may worsen"], effects: ["New situations may emerge", "Markets and disease advance", "Delayed consequences arrive"], risks: ["Urgent problems do not pause"], affected: ["Riverward", "Your patients", "Your commitments"], days: 1, enabled: true },
    bridge: { key, eyebrow: "World opportunity", title: "Fund emergency bridge braces", intention: "Keep the Greendale grain route open before winter.", why: "Bridge damage is already raising travel time and food prices.", cost: ["14 silver", "No time passes"], effects: ["Bridge condition +24", "Food pressure falls tomorrow", "+5 council standing"], risks: ["Less money for the clinic and debt"], affected: ["Greendale farmers", "Riverward merchants", "Miller’s Rest"], days: 0, enabled: g.silver >= 14 && g.bridge < 90, blocked: g.bridge >= 90 ? "The bridge is already secure." : "You need 14 silver." },
  };
  return decisions[key];
}

function advanceWorld(source: GameState, days: number, origin: HistoryEvent): GameState {
  const g: GameState = { ...source, patients: source.patients.map(p => ({ ...p })), people: { ...source.people }, history: [origin, ...source.history], lastSummary: [] };
  for (let i = 0; i < days; i++) {
    g.day += 1;
    if (g.day > 30) { g.day = 1; g.season = g.season === "Harvestfall" ? "Longnight" : g.season === "Longnight" ? "Deepwinter" : "Seedtide"; if (g.season === "Deepwinter") g.year += 1; }
    g.energy = clamp(g.energy - 7); g.stress = clamp(g.stress + 3); g.fever = clamp(g.fever + (g.wellsKnown ? 1 : 4)); g.bridge = clamp(g.bridge - 1);
    g.patients = g.patients.map(p => p.status === "waiting" ? { ...p, severity: clamp(p.severity + 7 + (p.severity > 70 ? 3 : 0)), status: p.severity >= 94 ? "lost" : p.status } : p.status === "stable" ? { ...p, severity: clamp(p.severity - 18), status: p.severity < 28 ? "recovered" : p.status } : p);
    const updates = [`Day ${g.day}: fever pressure ${g.wellsKnown ? "rose slightly" : "continued to spread"}.`];
    if (g.day % 4 === 0) {
      const name = patientNames[g.day % patientNames.length];
      const id = `patient-${g.year}-${g.day}`;
      if (!g.patients.some(p => p.id === id)) { g.patients.push({ id, name, detail: "New arrival · symptoms unknown", severity: 34 + (g.fever % 28), diagnosed: false, status: "waiting", canPay: g.day % 2 === 0 }); updates.push(`${name} arrived at the clinic seeking help.`); }
    }
    if (g.bridge < 45) updates.push("Caravans began avoiding Old Rowan Bridge; food costs will rise.");
    g.lastSummary.push(...updates);
  }
  return g;
}

export default function Home() {
  const [game, setGame] = useState<GameState>(initial);
  const [tab, setTab] = useState<Tab>("Today");
  const [draftCommitments, setDraftCommitments] = useState<CommitmentId[]>(["clinic", "fever"]);
  const [decisionKey, setDecisionKey] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("ash-oak-save-v2");
      if (saved) { try { setGame({ ...initial, ...JSON.parse(saved) }); } catch {} }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("ash-oak-save-v2", JSON.stringify(game)); }, [game, hydrated]);

  const activePatients = game.patients.filter(p => p.status === "waiting" || p.status === "stable");
  const urgentPatients = activePatients.filter(p => p.severity >= 65).length;
  const selectedDecision = decisionKey ? decisionFor(decisionKey, game) : null;
  const date = `${game.day} ${game.season} · Year ${game.year}`;

  const priorities = useMemo(() => {
    const items = [];
    if (urgentPatients) items.push({ tone: "urgent", icon: "⚕", title: `${urgentPatients} patient${urgentPatients > 1 ? "s need" : " needs"} you`, body: "Untreated patients worsen when a day passes.", action: "Open the clinic", tab: "Work" as Tab });
    if (!game.wellsKnown) items.push({ tone: "warning", icon: "⌁", title: "The fever has no known source", body: "Treatments help individuals, but new cases will continue.", action: "Investigate the cause", decision: "investigate" });
    else if (game.fever > 18) items.push({ tone: "warning", icon: "⌁", title: "You found the source", body: "The lower well can now be cleansed permanently.", action: "Cleanse the well", decision: "cleanse" });
    if (game.medicine < 2) items.push({ tone: "calm", icon: "✚", title: "Medicine is running low", body: "Choose who to ask, what to owe, or how to earn more.", action: "Review supply options", tab: "Work" as Tab });
    return items.slice(0, 3);
  }, [game, urgentPatients]);

  function resolveDecision(d: Decision) {
    if (!d.enabled) return;
    setGame(current => {
      let g: GameState = { ...current, patients: current.patients.map(p => ({ ...p })), people: Object.fromEntries(Object.entries(current.people).map(([k,v]) => [k,{...v}])) };
      let summary = "Your choice changed the shape of tomorrow.";
      if (d.key.startsWith("diagnose:")) { const id = d.key.split(":")[1]; g.energy -= 8; g.patients = g.patients.map(p => p.id === id ? { ...p, diagnosed: true, detail: p.id === "brann" ? "Watchman · river-rot infection" : "Patient · marsh fever confirmed" } : p); summary = "The symptoms now have a name. Targeted treatment is possible."; }
      else if (d.key.startsWith("treat:")) { const id = d.key.split(":")[1]; const patient = g.patients.find(p => p.id === id)!; g.energy -= 10; g.medicine -= 1; g.herbs -= 1; g.fever = clamp(g.fever - 3); if (patient.canPay) g.silver += 7; else { g.reputation += 4; g.people.mara.trust = clamp(g.people.mara.trust + 12); } g.patients = g.patients.map(p => p.id === id ? { ...p, status: "stable", severity: clamp(p.severity - 25) } : p); summary = `${patient.name} is stable. ${patient.canPay ? "Their payment strengthens the clinic." : "Mara will remember that you asked for nothing."}`; }
      else if (d.key === "investigate") { g.energy -= 18; g.stress += 6; g.wellsKnown = true; g.fever = clamp(g.fever - 8); summary = "You traced the fever to a cracked well lining. A permanent remedy is now possible."; }
      else if (d.key === "cleanse") { g.silver -= 12; g.herbs -= 2; g.fever = clamp(g.fever - 34); g.reputation += 6; g.people.mara.trust = clamp(g.people.mara.trust + 10); summary = "The contaminated well is sealed. New infections begin to fall."; }
      else if (d.key === "temple") { g.medicine += 3; g.templeObligation = true; g.people.prior.trust = clamp(g.people.prior.trust + 8); summary = "Three medicine doses arrived. The temple will eventually ask what your gratitude means."; }
      else if (d.key === "smuggle") { g.silver -= 8; g.medicine += 4; g.legalRisk += 18; g.people.ren.trust = clamp(g.people.ren.trust + 6); summary = "Ren delivered unregistered medicine. Patients can be treated, but the Oak Watch may learn how."; }
      else if (d.key === "privateCare") { g.medicine -= 1; g.energy -= 12; g.silver += 18; g.reputation = Math.max(0, g.reputation - 6); g.patients = g.patients.map(p => p.status === "waiting" ? { ...p, severity: clamp(p.severity + 4) } : p); summary = "The clinic can afford supplies. People in the waiting room noticed who came first."; }
      else if (d.key === "forage") { g.energy -= 20; g.food -= 1; g.herbs += 4; summary = "You returned with yarrow and river reed. The waiting room did not stand still."; }
      else if (d.key === "repay") { const paid = Math.min(10, g.debt); g.silver -= paid; g.debt -= paid; g.people.maeve.trust = clamp(g.people.maeve.trust + 5); summary = `Maeve accepted ${paid} silver without ceremony. ${g.debt ? `${g.debt} remains.` : "The debt is cleared."}`; }
      else if (d.key === "rest") { g.food -= 1; g.energy = 101; g.stress = Math.max(0, g.stress - 21); summary = "You slept without dreams. At dawn, the clinic door was already occupied."; }
      else if (d.key === "bridge") { g.silver -= 14; g.bridge = clamp(g.bridge + 24); g.reputation += 5; summary = "Oak braces now hold the eastern arch. Grain caravans will arrive sooner."; }

      g.energy = clamp(g.energy); g.stress = clamp(g.stress);
      const event: HistoryEvent = { id: stamp(g,d.key), day: g.day, title: d.title, summary, cause: `Elara chose: ${d.intention}`, effect: d.effects.join(" · "), tone: d.key === "smuggle" || d.key === "privateCare" ? "neutral" : "good" };
      if (d.days) g = advanceWorld(g, d.days, event); else { g.history = [event, ...g.history]; g.lastSummary = [summary]; }
      g.legacy += d.key === "endDay" ? 0 : 1;
      return g;
    });
    setDecisionKey(null); setToast(d.effects[0]);
  }

  function startLife() { if (draftCommitments.length !== 2) return; setGame(g => ({ ...g, started: true, selectedCommitments: draftCommitments })); }
  function toggleCommitment(id: CommitmentId) { setDraftCommitments(s => s.includes(id) ? s.filter(x => x !== id) : s.length < 2 ? [...s,id] : s); }
  function reset() { if (confirm("Begin Elara’s story again? This clears the current local chronicle.")) { localStorage.removeItem("ash-oak-save-v2"); setGame(initial); setDraftCommitments(["clinic","fever"]); setTab("Today"); } }

  if (!game.started) return <Onboarding selected={draftCommitments} toggle={toggleCommitment} start={startLife}/>;

  return <main className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setTab("Today")}><span>♣</span><b>Chronicle of Ash & Oak</b></button>
      <div className="place-mark">✥ Riverward</div><div className="world-date">{date}</div>
      <nav aria-label="Main navigation">{(["Today","Work","World","Life","Chronicle"] as Tab[]).map(t => <button key={t} className={tab===t?"active":""} onClick={() => setTab(t)}>{t}{t==="Today"&&urgentPatients>0?<i>{urgentPatients}</i>:null}</button>)}</nav>
      <button className="reset" onClick={reset} aria-label="Reset story">↻</button>
    </header>

    <aside className="identity-rail">
      <div className="avatar">E<span>♣</span></div><h1>Elara Thornfield</h1><p className="calling">Riverward healer</p>
      <div className="life-line"><span>Today</span><strong>{game.energy >= 55 ? "Capable" : game.energy >= 25 ? "Strained" : "Exhausted"}</strong></div>
      <Stat label="Energy" value={game.energy} tone={game.energy<30?"bad":"good"}/><Stat label="Stress" value={game.stress} invert/><Stat label="Clinic" value={game.clinic}/>
      <SectionTitle>Your commitments</SectionTitle>
      <div className="rail-commitments">{game.selectedCommitments.map(id => {const c=commitmentInfo[id],p=commitmentProgress(id,game); return <button key={id} onClick={()=>setTab("Today")}><span className={c.color}>{c.icon}</span><div><strong>{c.title}</strong><i><b style={{width:`${p}%`}}></b></i><small>{p}%</small></div></button>})}</div>
      <SectionTitle>What you carry</SectionTitle><div className="inventory"><span><b>{game.medicine}</b> medicine</span><span><b>{game.herbs}</b> herbs</span><span><b>{game.food}</b> food</span><span><b>{game.silver}</b> silver</span></div>
      <div className="rail-footer"><span>Age 23</span><span>Legacy {game.legacy}</span></div>
    </aside>

    <section className="main-content">
      {tab === "Today" && <TodayView game={game} priorities={priorities} setTab={setTab} decide={setDecisionKey}/>} 
      {tab === "Work" && <WorkView game={game} decide={setDecisionKey}/>} 
      {tab === "World" && <WorldView game={game} decide={setDecisionKey}/>} 
      {tab === "Life" && <LifeView game={game} decide={setDecisionKey}/>} 
      {tab === "Chronicle" && <ChronicleView game={game}/>} 
    </section>

    <aside className="context-rail">
      <h2>Why today matters</h2><p className="context-lead">You are not here to clear a quest list. You are deciding what kind of healer—and neighbor—Elara becomes.</p>
      <SectionTitle>Pressure</SectionTitle><Pressure icon="⚕" label="Greendale fever" value={game.fever} note={game.wellsKnown?"Cause known":"Source unknown"}/><Pressure icon="⌂" label="Clinic stability" value={game.clinic} note={`${activePatients.length} active patients`}/><Pressure icon="⚖" label="Maeve’s debt" value={clamp((game.debt/28)*100)} note={`${game.debt} silver remains`}/>
      <SectionTitle>People affected</SectionTitle><div className="people-mini">{Object.entries(game.people).slice(0,3).map(([id,p])=><div key={id}><span>{p.name[0]}</span><p><strong>{p.name}</strong><small>Trust {p.trust} · {p.role}</small></p></div>)}</div>
      <SectionTitle>When you act</SectionTitle><ol className="feedback-loop"><li>Review the intention and tradeoffs</li><li>Choose what matters most</li><li>Time and systems respond</li><li>People and history remember</li></ol>
      <button className="end-day" onClick={()=>setDecisionKey("endDay")}>End the day <span>Let the world move →</span></button>
    </aside>

    {selectedDecision && <DecisionPanel decision={selectedDecision} onClose={()=>setDecisionKey(null)} onConfirm={()=>resolveDecision(selectedDecision)}/>} 
    {toast && <div className="toast" role="status">{toast}<button onClick={()=>setToast("")} aria-label="Dismiss">×</button></div>}
  </main>;
}

function Onboarding({selected,toggle,start}:{selected:CommitmentId[];toggle:(id:CommitmentId)=>void;start:()=>void}) {
  return <main className="onboarding"><div className="onboarding-art"></div><section><span className="kicker">Riverward · 17 Harvestfall, Year 312</span><h1>A life begins with<br/>what you choose to care about.</h1><p>You are Elara Thornfield, a young healer with a borrowed clinic, too few supplies, and a town already in motion. Choose two promises. They will shape which situations find you and what your choices mean.</p><div className="commitment-picker">{(Object.keys(commitmentInfo) as CommitmentId[]).map(id=>{const c=commitmentInfo[id];return <button key={id} className={selected.includes(id)?"selected":""} onClick={()=>toggle(id)}><span className={c.color}>{c.icon}</span><div><strong>{c.title}</strong><p>{c.promise}</p></div><i>{selected.includes(id)?"Chosen":"Choose"}</i></button>})}</div><div className="begin-row"><small>{selected.length}/2 promises chosen</small><button disabled={selected.length!==2} onClick={start}>Begin Elara’s life <span>→</span></button></div></section></main>;
}

function TodayView({game,priorities,setTab,decide}:{game:GameState;priorities:{tone:string;icon:string;title:string;body:string;action:string;tab?:Tab;decision?:string}[];setTab:(t:Tab)=>void;decide:(k:string)=>void}) {
  return <div className="screen today-screen"><div className="screen-heading"><span>Your life, today</span><h2>Good morning, Elara.</h2><p>You cannot do everything. Choose what deserves this day.</p></div>
    <section className="away-summary"><div><span>While you were away</span><strong>{game.lastSummary.length} things changed</strong></div><ul>{game.lastSummary.slice(-3).map((s,i)=><li key={i}>{s}</li>)}</ul></section>
    <div className="section-row"><div><span>Needs your attention</span><h3>Decisions with stakes</h3></div><small>Nothing here is mandatory. Everything will continue.</small></div>
    <div className="priority-grid">{priorities.map((p,i)=><article className={p.tone} key={p.title}><span className="priority-number">0{i+1}</span><div className="priority-icon">{p.icon}</div><h3>{p.title}</h3><p>{p.body}</p><button onClick={()=>p.tab?setTab(p.tab):decide(p.decision!)}>{p.action}<span>→</span></button></article>)}</div>
    <div className="commitment-board"><div className="section-row"><div><span>The longer life</span><h3>Your chosen commitments</h3></div><small>Success creates responsibilities, not an empty quest list.</small></div>{game.selectedCommitments.map(id=>{const c=commitmentInfo[id],p=commitmentProgress(id,game);return <article key={id}><span className={c.color}>{c.icon}</span><div><h4>{c.title}</h4><p>{c.promise}</p><i><b style={{width:`${p}%`}}></b></i></div><strong>{p}%</strong></article>})}</div>
  </div>;
}

function WorkView({game,decide}:{game:GameState;decide:(k:string)=>void}) {
  return <div className="screen work-screen"><div className="screen-heading"><span>Tanner’s Lane clinic</span><h2>The waiting room</h2><p>Care is not a resource conversion. Every bed holds a person, a family, and a future memory.</p></div>
    <div className="work-layout"><section><div className="section-row"><div><span>Patients</span><h3>{game.patients.filter(p=>p.status==="waiting"||p.status==="stable").length} people under your care</h3></div><small>Severity rises when days pass</small></div><div className="patient-list">{game.patients.map(p=><article className={`patient ${p.status}`} key={p.id}><div className="patient-initial">{p.name[0]}</div><div><h4>{p.name}</h4><p>{p.detail}</p><span className="patient-status">{p.status}</span></div><div className="severity"><small>Severity</small><strong>{p.severity}%</strong><i><b style={{width:`${p.severity}%`}}></b></i></div>{p.status==="waiting"?<button onClick={()=>decide(`${p.diagnosed?"treat":"diagnose"}:${p.id}`)}>{p.diagnosed?"Review treatment":"Examine"} →</button>:<span className="outcome">{p.status==="stable"?"Under care":"Recorded"}</span>}</article>)}</div></section>
      <aside className="supply-panel"><h3>Supply choices</h3><p>Shortage is meaningful because choosing a supplier changes who you owe.</p><SupplyAction icon="✚" title="Ask the river temple" detail="3 medicine · public obligation" onClick={()=>decide("temple")}/><SupplyAction icon="☾" title="Contact Ren Ashstep" detail="4 medicine · illegal favor" onClick={()=>decide("smuggle")}/><SupplyAction icon="♣" title="Forage Severwood" detail="4 herbs · one day away" onClick={()=>decide("forage")}/><SupplyAction icon="◆" title="Take private work" detail="18 silver · others wait" onClick={()=>decide("privateCare")}/><div className="stock-ledger"><span>Current stock</span><div><b>{game.medicine}</b> medicine</div><div><b>{game.herbs}</b> herbs</div><div><b>{game.silver}</b> silver</div></div></aside></div>
  </div>;
}

function WorldView({game,decide}:{game:GameState;decide:(k:string)=>void}) {
  return <div className="world-screen"><div className="world-map"><div className="map-shade"></div><button className="world-pin farms selected"><span>⚕</span><b>Greendale</b><small>Fever {game.fever}%</small></button><button className="world-pin town"><span>⌂</span><b>Riverward</b><small>Your clinic</small></button><button className="world-pin bridge"><span>⌁</span><b>Old Rowan Bridge</b><small>Condition {game.bridge}%</small></button><button className="world-pin forest"><span>♣</span><b>Severwood</b><small>Herbs available</small></button></div><aside className="world-story"><span>Regional situation</span><h2>The Greendale fever</h2><p>Cold rain flooded field drains and illness followed. Treating patients saves lives now; finding the source changes what happens next.</p><div className="cause-chain"><b>Cold rain</b><i>→</i><b>Field runoff</b><i>→</i><b>Lower well</b><i>→</i><b>New patients</b></div><button onClick={()=>decide(game.wellsKnown?"cleanse":"investigate")}>{game.wellsKnown?"Cleanse the lower well":"Investigate the source"}<span>See costs and consequences →</span></button><hr/><h3>Another pressure</h3><p>Old Rowan Bridge is at {game.bridge}%. If it fails, grain takes a longer road and Riverward’s food prices rise.</p><button className="secondary" onClick={()=>decide("bridge")}>Consider bridge repairs →</button></aside></div>;
}

function LifeView({game,decide}:{game:GameState;decide:(k:string)=>void}) {
  return <div className="screen life-screen"><div className="screen-heading"><span>More than a build</span><h2>The life around your skills</h2><p>Progress is the web of people, obligations, places, and memories attached to you.</p></div><div className="life-layout"><section className="relationship-list"><div className="section-row"><div><span>Relationships</span><h3>People who remember</h3></div></div>{Object.entries(game.people).map(([id,p])=><article key={id}><div>{p.name[0]}</div><section><h4>{p.name}</h4><span>{p.role}</span><p>{p.note}</p><i><b style={{width:`${p.trust}%`}}></b></i><small>Trust {p.trust}</small></section></article>)}</section><aside><div className="life-card"><span>Obligation</span><h3>Maeve’s apothecary loan</h3><strong>{game.debt} silver remains</strong><p>The debt enabled your clinic. Paying it protects that relationship but reduces the supplies you can buy today.</p><button onClick={()=>decide("repay")}>Consider a payment →</button></div><div className="life-card"><span>Body history</span><h3>Old winterglass scar</h3><p>A burn across the left palm. Fine work costs more energy in deep cold; Severwood hunters recognize the mark.</p></div>{game.templeObligation&&<div className="life-card obligation"><span>New obligation</span><h3>A service owed to the temple</h3><p>Prior Aldren supplied medicine during the Greendale fever. He will eventually ask for public support.</p></div>}{game.legalRisk>0&&<div className="life-card danger-card"><span>Legal exposure</span><h3>The Oak Watch is listening</h3><p>Your unregistered medicine created {game.legalRisk}% suspicion along the river road.</p></div>}<button className="rest-card" onClick={()=>decide("rest")}>Close for a day and recover <span>Energy {game.energy}% →</span></button></aside></div></div>;
}

function ChronicleView({game}:{game:GameState}) {
  return <div className="screen chronicle-screen"><div className="screen-heading"><span>Permanent record</span><h2>What changed because of you</h2><p>The Chronicle records decisions, their causes, and the consequences still moving through the world.</p></div><div className="chronicle-list">{game.history.map(e=><article key={e.id} className={e.tone}><time>Day {e.day} · {game.season}, {game.year}</time><div className="history-mark">{e.tone==="good"?"✦":e.tone==="bad"?"!":"⌁"}</div><section><h3>{e.title}</h3><p>{e.summary}</p><div className="causal-proof"><span><b>Because</b>{e.cause}</span><i>→</i><span><b>Therefore</b>{e.effect}</span></div></section></article>)}</div></div>;
}

function DecisionPanel({decision,onClose,onConfirm}:{decision:Decision;onClose:()=>void;onConfirm:()=>void}) {
  return <div className="decision-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="decision-panel" role="dialog" aria-modal="true" aria-labelledby="decision-title"><button className="close" onClick={onClose} aria-label="Close decision">×</button><span className="decision-eyebrow">{decision.eyebrow}</span><h2 id="decision-title">{decision.title}</h2><p className="intention">“{decision.intention}”</p><div className="why"><b>Why this matters</b><p>{decision.why}</p></div><div className="decision-columns"><InfoList title="It will cost" items={decision.cost}/><InfoList title="Likely effects" items={decision.effects} good/><InfoList title="Risks & tradeoffs" items={decision.risks} risk/></div><div className="affected"><b>People and places affected</b>{decision.affected.map(x=><span key={x}>{x}</span>)}</div>{!decision.enabled&&<p className="blocked">{decision.blocked}</p>}<footer><button className="cancel" onClick={onClose}>Not now</button><button className="confirm" disabled={!decision.enabled} onClick={onConfirm}>Commit to this choice <span>{decision.days?`${decision.days} day${decision.days>1?"s":""} passes`:"Act now"} →</span></button></footer></section></div>;
}

function SectionTitle({children}:{children:React.ReactNode}) { return <div className="section-title"><i></i><span>{children}</span><i></i></div>; }
function Stat({label,value,invert,tone}:{label:string;value:number;invert?:boolean;tone?:string}) { const display=invert?100-value:value; return <div className="stat"><div><span>{label}</span><b>{value}%</b></div><i><b className={tone||""} style={{width:`${display}%`}}></b></i></div>; }
function Pressure({icon,label,value,note}:{icon:string;label:string;value:number;note:string}) { return <div className="pressure"><span>{icon}</span><div><b>{label}</b><small>{note}</small><i><em style={{width:`${value}%`}}></em></i></div><strong>{value}</strong></div>; }
function SupplyAction({icon,title,detail,onClick}:{icon:string;title:string;detail:string;onClick:()=>void}) { return <button className="supply-action" onClick={onClick}><span>{icon}</span><p><b>{title}</b><small>{detail}</small></p><i>→</i></button>; }
function InfoList({title,items,good,risk}:{title:string;items:string[];good?:boolean;risk?:boolean}) { return <div className={`info-list ${good?"good":""} ${risk?"risk":""}`}><h3>{title}</h3>{items.map(x=><p key={x}><span>{good?"+":risk?"!":"−"}</span>{x}</p>)}</div>; }
