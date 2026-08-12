import React, { useState, useRef, useEffect } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid } from "../../utils/helpers.jsx";
import { SECTIONS, DEFAULT_TESTS } from "../../constants/data.js";
import { Icon } from "../common/Icons.jsx";

export function ParametersView({ tests = {}, onSave }) {
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(tests || DEFAULT_TESTS)));
  const [sec, setSec] = useState("hematology");
  const [editing, setEditing] = useState(null);
  const [newGroup, setNewGroup] = useState("");
  
  const blank = {
    name: "",
    unit: "",
    normalMin: "",
    normalMax: "",
    normalText: "",
    inputType: "text",
    options: [],
    brands: [],
    showBrand: false,
    showUnit: true,
    showNormal: true,
    showFlag: true,
  };

  const [newT, setNewT] = useState(blank);
  const [newTG, setNewTG] = useState("");
  const [newOptInput, setNewOptInput] = useState("");
  const [editOptInput, setEditOptInput] = useState("");
  const [newBrandInput, setNewBrandInput] = useState("");
  const [editBrandInput, setEditBrandInput] = useState("");
  const [newTGName, setNewTGName] = useState("");
  const [flash, setFlash] = useState(false);

  const groups = local[sec] || [];
  const localRef = useRef(local);
  localRef.current = local;

  useEffect(() => {
    return () => {
      onSave(localRef.current);
    };
  }, [onSave]);

  const save = () => {
    onSave(local);
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  };

  const reset = () => {
    if (!confirm("Reset parameters for this section to default configuration?")) return;
    setLocal((prev) => {
      const u = { ...prev, [sec]: JSON.parse(JSON.stringify(DEFAULT_TESTS[sec] || [])) };
      onSave(u);
      return u;
    });
  };

  const addGroup = () => {
    if (!newGroup.trim()) return;
    setLocal((prev) => {
      const grps = prev[sec] || [];
      if (grps.find((g) => g.group === newGroup.trim())) {
        alert("A group with this name already exists.");
        return prev;
      }
      return { ...prev, [sec]: [...grps, { group: newGroup.trim(), tests: [] }] };
    });
    setNewGroup("");
  };

  const delGroup = (gi) => {
    if (!confirm("Delete this test group and all its parameters?")) return;
    setLocal((prev) => ({ ...prev, [sec]: (prev[sec] || []).filter((_, i) => i !== gi) }));
  };

  const addTest = () => {
    if (!newT.name.trim()) return alert("Parameter name is required.");
    if (newTG === "") return alert("Please select or create a group first.");

    const t = {
      id: "t_" + uid(),
      name: newT.name.trim(),
      unit: newT.unit.trim(),
      normalMin: newT.normalMin !== "" && newT.normalMin !== undefined ? String(newT.normalMin).trim() : undefined,
      normalMax: newT.normalMax !== "" && newT.normalMax !== undefined ? String(newT.normalMax).trim() : undefined,
      normalText: newT.normalText.trim(),
      inputType: newT.inputType || "text",
      options: newT.inputType === "dropdown" ? (Array.isArray(newT.options) ? newT.options : []) : undefined,
      brands: Array.isArray(newT.brands) ? newT.brands : [],
      showBrand: newT.showBrand || false,
      showUnit: newT.showUnit !== false,
      showNormal: newT.showNormal !== false,
      showFlag: newT.showFlag !== false,
    };

    if (newTG === "__new__") {
      if (!newTGName.trim()) return alert("Please enter a name for the new group.");
      setLocal((prev) => {
        const grps = prev[sec] || [];
        if (grps.find((g) => g.group === newTGName.trim())) {
          return { ...prev, [sec]: grps.map((g) => (g.group === newTGName.trim() ? { ...g, tests: [...g.tests, t] } : g)) };
        }
        return { ...prev, [sec]: [...grps, { group: newTGName.trim(), tests: [t] }] };
      });
      setNewTGName("");
    } else {
      const gi = parseInt(newTG, 10);
      setLocal((prev) => {
        const grps = prev[sec] || [];
        return { ...prev, [sec]: grps.map((g, i) => (i === gi ? { ...g, tests: [...g.tests, t] } : g)) };
      });
    }

    setNewT((b) => ({ ...blank, inputType: b.inputType }));
    setNewOptInput("");
    setNewBrandInput("");
  };

  const delTest = (gi, ti) => {
    setLocal((prev) => ({
      ...prev,
      [sec]: (prev[sec] || []).map((g, i) => (i === gi ? { ...g, tests: g.tests.filter((_, j) => j !== ti) } : g)),
    }));
    setEditing(null);
  };

  const updT = (gi, ti, k, v) => {
    setLocal((prev) => {
      let parsed = v;
      if (k === "normalMin" || k === "normalMax") {
        if (v === "" || v === null || v === undefined) {
          parsed = undefined;
        } else {
          const s = String(v).trim();
          if (/^-?\d*\.?\d*$/.test(s)) {
            parsed = s;
          } else {
            return prev;
          }
        }
      }
      return {
        ...prev,
        [sec]: (prev[sec] || []).map((g, i) => (i === gi ? { ...g, tests: g.tests.map((t, j) => (j === ti ? { ...t, [k]: parsed } : t)) } : g)),
      };
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="parameters" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Test Parameter Configurations</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Configure test parameters, normal reference ranges, and units per section</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button style={Btn("ghost", { height: 34, fontSize: 12 })} onClick={reset}>↺ Reset Defaults</button>
          <button style={Btn(flash ? "success" : "accent", { height: 34, fontSize: 12 })} onClick={save}>
            {flash ? "✓ Saved!" : "💾 Save Changes"}
          </button>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16 }}>
        {/* Left Section Picker */}
        <Card>
          <CardHead title="Sections" icon={<Icon name="parameters" size={16} color={C.accent} />} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                onClick={() => { setSec(s.id); setEditing(null); setNewTG(""); setNewTGName(""); }}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderBottom: `1px solid ${C.border}`,
                  background: sec === s.id ? C.accentLight : "#fff",
                  borderLeft: sec === s.id ? `3px solid ${C.accent}` : "3px solid transparent",
                  fontSize: 12.5,
                  color: sec === s.id ? C.accent : C.text,
                  fontWeight: sec === s.id ? 700 : 500,
                }}
              >
                {s.label}
              </div>
            ))}
          </div>
        </Card>

        {/* Right Parameter Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Add Group */}
          <Card style={{ padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>NEW GROUP:</span>
            <input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} style={inp({ flex: 1 })} placeholder="Enter group name (e.g. Lipid Profile)..." />
            <button style={Btn("ghost", { height: 32, fontSize: 12 })} onClick={addGroup}>+ Add Group</button>
          </Card>

          {/* Add Test Form */}
          <Card>
            <CardHead title="Add New Parameter" icon={<Icon name="check" size={16} color={C.accent} />} />
            <div style={{ padding: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <Field label="Target Group" style={{ width: newTG === "__new__" ? 130 : 160 }}>
                <select value={newTG} onChange={(e) => { setNewTG(e.target.value); if (e.target.value !== "__new__") setNewTGName(""); }} style={inp({ width: newTG === "__new__" ? 130 : 160 })}>
                  <option value="">— Select —</option>
                  {groups.map((g, i) => <option key={i} value={i}>{g.group}</option>)}
                  <option value="__new__">＋ New group...</option>
                </select>
              </Field>

              {newTG === "__new__" && (
                <Field label="New Group Name" style={{ width: 160 }}>
                  <input value={newTGName} onChange={(e) => setNewTGName(e.target.value)} style={inp({ width: 160 })} placeholder="Group name..." autoFocus />
                </Field>
              )}

              {[["Parameter Name", "name", 160], ["Unit", "unit", 65], ["Min", "normalMin", 70], ["Max", "normalMax", 70], ["Reference Range Text", "normalText", 130]].map(([l, k, w]) => (
                <Field key={k} label={l} style={{ width: w }}>
                  <input value={newT[k]} onChange={(e) => setNewT((p) => ({ ...p, [k]: e.target.value }))} style={inp({ width: w })} placeholder={l} />
                </Field>
              ))}

              <Field label="Format" style={{ width: 110 }}>
                <select value={newT.inputType} onChange={(e) => setNewT((p) => ({ ...p, inputType: e.target.value, options: [] }))} style={inp({ width: 110 })}>
                  <option value="text">✏ Manual</option>
                  <option value="dropdown">▾ Dropdown</option>
                </select>
              </Field>

              {newT.inputType === "dropdown" && (
                <Field label="Dropdown Options (Type + Enter)" style={{ minWidth: 220, flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "4px 6px", border: `1px solid ${C.border}`, borderRadius: 6, background: "#fff", minHeight: 32, alignItems: "center" }}>
                    {(Array.isArray(newT.options) ? newT.options : []).map((o, i) => (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 3, background: C.accentLight, color: C.accent, borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
                        {o}
                        <span onClick={() => setNewT((p) => ({ ...p, options: p.options.filter((_, j) => j !== i) }))} style={{ cursor: "pointer", fontSize: 10, opacity: 0.7 }}>✕</span>
                      </span>
                    ))}
                    <input
                      value={newOptInput}
                      onChange={(e) => setNewOptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === ",") && newOptInput.trim()) {
                          e.preventDefault();
                          setNewT((p) => ({ ...p, options: [...(p.options || []), newOptInput.trim()] }));
                          setNewOptInput("");
                        }
                      }}
                      style={{ border: "none", outline: "none", fontSize: 12, minWidth: 80, flex: 1, padding: "1px 2px" }}
                      placeholder={newT.options?.length ? "Add..." : "Type option + Enter"}
                    />
                  </div>
                </Field>
              )}

              <button style={Btn("accent", { alignSelf: "flex-end", height: 34, fontSize: 12 })} onClick={addTest}>
                + Add Parameter
              </button>
            </div>
          </Card>

          {/* Group Parameter Tables */}
          {groups.map((grp, gi) => (
            <Card key={gi}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface }}>
                <input
                  value={grp.group}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setLocal((prev) => ({ ...prev, [sec]: (prev[sec] || []).map((g, i) => (i === gi ? { ...g, group: newName } : g)) }));
                  }}
                  style={{ fontWeight: 700, fontSize: 13, color: C.primary, background: "transparent", border: "none", borderBottom: `1px dashed ${C.accent}`, outline: "none", padding: "2px 4px", flex: 1, marginRight: 8, fontFamily: "inherit" }}
                  placeholder="Group name..."
                />
                <button style={Btn("danger", { fontSize: 11, height: 26, padding: "0 10px" })} onClick={() => delGroup(gi)}>
                  ✕ Delete Group
                </button>
              </div>

              {grp.tests.length === 0 ? (
                <div style={{ padding: "12px 14px", color: C.faint, fontSize: 12, fontStyle: "italic" }}>No parameters in this group.</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Parameter</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Unit</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Min</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Max</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Reference Display Text</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Input Format</th>
                      <th style={{ padding: "8px 12px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grp.tests.map((t, ti) => {
                      const isEd = editing?.gi === gi && editing?.ti === ti;

                      return (
                        <tr key={t.id || ti} style={{ borderBottom: `1px solid ${C.border}`, background: isEd ? C.accentLight : "#fff" }}>
                          {isEd ? (
                            <>
                              {[["name", 140], ["unit", 60], ["normalMin", 60], ["normalMax", 60], ["normalText", 120]].map(([k, w]) => (
                                <td key={k} style={{ padding: "6px" }}>
                                  <input
                                    value={t[k] !== undefined && t[k] !== null ? String(t[k]) : ""}
                                    onChange={(e) => updT(gi, ti, k, e.target.value)}
                                    style={inp({ width: w, height: 28 })}
                                  />
                                </td>
                              ))}
                              <td style={{ padding: "6px" }}>
                                <select value={t.inputType || "text"} onChange={(e) => updT(gi, ti, "inputType", e.target.value)} style={inp({ width: 110, height: 28 })}>
                                  <option value="text">✏ Manual</option>
                                  <option value="dropdown">▾ Dropdown</option>
                                </select>
                              </td>
                              <td style={{ padding: "6px", textAlign: "right" }}>
                                <button style={Btn("accent", { fontSize: 11, height: 26, padding: "0 10px" })} onClick={() => setEditing(null)}>
                                  ✓ Done
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: "8px 12px", fontWeight: 600, color: C.text }}>{t.name}</td>
                              <td style={{ padding: "8px 12px", color: C.muted }}>{t.unit || "—"}</td>
                              <td style={{ padding: "8px 12px", color: C.muted }}>{t.normalMin ?? "—"}</td>
                              <td style={{ padding: "8px 12px", color: C.muted }}>{t.normalMax ?? "—"}</td>
                              <td style={{ padding: "8px 12px", color: C.text }}>{t.normalText || "—"}</td>
                              <td style={{ padding: "8px 12px" }}>
                                <span style={{ padding: "2px 8px", borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, fontSize: 10.5, fontWeight: 600 }}>
                                  {t.inputType === "dropdown" ? "▾ Dropdown" : "✏ Manual"}
                                </span>
                              </td>
                              <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                  <button style={Btn("ghost", { fontSize: 11, height: 26, padding: "0 10px" })} onClick={() => setEditing({ gi, ti })}>
                                    Edit
                                  </button>
                                  <button style={Btn("danger", { fontSize: 11, height: 26, padding: "0 10px" })} onClick={() => delTest(gi, ti)}>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
