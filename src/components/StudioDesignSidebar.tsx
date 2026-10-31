import { useEffect, useState } from 'react';
import type { ClientBrief } from '../data/clientModel';
import {
  VISUAL_FONTS, VISUAL_ICONS, VISUAL_SECTIONS,
  type VisualDesign, type VisualFont, type VisualSectionId, type VisualWidget,
} from '../data/visualDesign';

type Props = {
  brief: ClientBrief;
  patch: (updates: Partial<ClientBrief>) => void;
  activeSection: VisualSectionId;
  selectSection: (section: VisualSectionId) => void;
  selectedText: string;
  selectText: (field: string) => void;
  selectedWidget: string;
  selectWidget: (id: string) => void;
};

const control = 'w-full min-w-0 rounded-lg border border-white/15 bg-[#1d1c26] px-2.5 py-2 text-[12px] text-white outline-none focus:border-pink-400';
const smallButton = 'rounded-lg border border-white/15 bg-white/5 px-2.5 py-2 text-[11px] text-white/85 transition hover:bg-white/15';
const label = 'mb-1 block text-[10px] font-bold uppercase tracking-wider text-white/50';
const colorInput = 'h-10 w-11 shrink-0 cursor-pointer rounded-lg border border-white/15 bg-transparent p-1';

const editableFields = [
  ['name', 'Nama'], ['role', 'Profesi'], ['tagline', 'Tagline'], ['bio', 'Cerita singkat'],
  ['location', 'Lokasi'], ['journey:heading', 'Judul perjalanan'], ['journey:kicker', 'Subjudul perjalanan'],
  ['picks:heading', 'Judul pilihan'], ['picks:kicker', 'Subjudul pilihan'],
  ['skills:heading', 'Judul keahlian'], ['skills:kicker', 'Subjudul keahlian'],
] as const;

export default function StudioDesignSidebar({ brief, patch, activeSection, selectSection, selectedText, selectText, selectedWidget, selectWidget }: Props) {
  const [tab, setTab] = useState<'section' | 'text' | 'widgets'>('section');
  useEffect(() => { if (selectedWidget) setTab('widgets'); else if (selectedText) setTab('text'); }, [selectedText, selectedWidget]);
  const visualDesign = brief.visualDesign ?? {};
  const save = (next: VisualDesign) => patch({ visualDesign: next });
  const backgrounds = visualDesign.sectionBackgrounds ?? {};
  const textStyles = visualDesign.textStyles ?? {};
  const widgets = visualDesign.widgets ?? [];
  const currentTextStyle = selectedText ? textStyles[selectedText] ?? {} : {};

  const updateTextStyle = (change: Partial<typeof currentTextStyle>) => {
    if (!selectedText || !/^[a-z0-9:-]{1,100}$/.test(selectedText)) return;
    save({ ...visualDesign, textStyles: { ...textStyles, [selectedText]: { ...currentTextStyle, ...change } } });
  };
  const updateWidget = (id: string, changes: Partial<VisualWidget>) => save({ ...visualDesign, widgets: widgets.map((widget) => widget.id === id ? { ...widget, ...changes } : widget) });
  const addWidget = (type: VisualWidget['type']) => {
    if (widgets.length >= 60) return;
    const id = `widget-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const item: VisualWidget = { id, section: activeSection, type, text: type === 'text' ? 'Tulis teks baru di sini' : '', icon: 'star', fontSize: type === 'text' ? 20 : 28 };
    save({ ...visualDesign, widgets: [...widgets, item] });
    selectWidget(id);
    setTab('widgets');
  };
  const moveWidget = (id: string, direction: -1 | 1) => {
    const copy = [...widgets]; const index = copy.findIndex((w) => w.id === id); const other = index + direction;
    if (index < 0 || other < 0 || other >= copy.length || copy[other].section !== copy[index].section) return;
    [copy[index], copy[other]] = [copy[other], copy[index]];
    save({ ...visualDesign, widgets: copy });
  };

  return <aside className="w-full shrink-0 border-b border-white/10 bg-[#14131c] p-4 text-white lg:w-[310px] lg:border-b-0 lg:border-r lg:p-5" aria-label="Panel desain visual">
    <div className="mb-4"><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-pink-400">PESONAFLIX BUILDER</p><h3 className="mt-1 text-lg font-bold">Desain Halaman</h3><p className="mt-1 text-xs leading-relaxed text-white/50">Klik teks di preview atau pilih section. Perubahan langsung terlihat.</p></div>
    <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-black/30 p-1" role="tablist" aria-label="Pengaturan desain">
      {([['section', 'Section'], ['text', 'Teks'], ['widgets', 'Elemen']] as const).map(([id, name]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={`rounded-lg px-2 py-2 text-xs font-semibold ${tab === id ? 'bg-[#c92c5c] text-white' : 'text-white/60 hover:bg-white/10'}`} onClick={() => setTab(id)}>{name}</button>)}
    </div>
    <label className={label} htmlFor="studio-section">Section yang diedit</label>
    <select id="studio-section" className={`${control} mb-5`} value={activeSection} onChange={(e) => selectSection(e.target.value as VisualSectionId)}>
      {VISUAL_SECTIONS.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}
    </select>

    {tab === 'section' && <div className="space-y-4" role="tabpanel">
      <div><span className={label}>Warna latar section</span><div className="flex items-center gap-2"><input type="color" className={colorInput} aria-label="Pilih warna latar section" value={backgrounds[activeSection] || '#15151d'} onChange={(e) => save({ ...visualDesign, sectionBackgrounds: { ...backgrounds, [activeSection]: e.target.value } })}/><input key={`${activeSection}-${backgrounds[activeSection] || ''}`} className={control} aria-label="Kode warna latar section" defaultValue={backgrounds[activeSection] || ''} placeholder="#15151d" maxLength={7} onBlur={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) save({ ...visualDesign, sectionBackgrounds: { ...backgrounds, [activeSection]: e.target.value } }); }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}/></div></div>
      <button type="button" className={smallButton} onClick={() => { const next = { ...backgrounds }; delete next[activeSection]; save({ ...visualDesign, sectionBackgrounds: next }); }}>↺ Kembalikan latar bawaan</button>
      <div className="rounded-xl bg-white/5 p-3 text-xs leading-relaxed text-white/60">Ganti latar bagian ini saja. Bagian lain dan halaman klien lain tetap aman.</div>
      <div className="grid grid-cols-2 gap-2"><button type="button" className={smallButton} onClick={() => addWidget('text')}>＋ Tambah Teks</button><button type="button" className={smallButton} onClick={() => addWidget('icon')}>＋ Tambah Ikon</button></div>
    </div>}

    {tab === 'text' && <div className="space-y-4" role="tabpanel">
      <div><label className={label} htmlFor="studio-text-target">Elemen tulisan</label><select id="studio-text-target" className={control} value={selectedText} onChange={(e) => selectText(e.target.value)}><option value="">Klik tulisan di preview…</option>{selectedText && !editableFields.some(([key]) => key === selectedText) && <option value={selectedText}>{selectedText}</option>}{editableFields.map(([field, name]) => <option key={field} value={field}>{name}</option>)}</select></div>
      {selectedText ? <>
        <div><span className={label}>Warna huruf</span><div className="flex items-center gap-2"><input type="color" aria-label="Pilih warna tulisan" className={colorInput} value={currentTextStyle.color || '#ffffff'} onChange={(e) => updateTextStyle({ color: e.target.value })}/><span className="text-xs text-white/70">{currentTextStyle.color || 'Warna template'}</span></div></div>
        <div><label className={label} htmlFor="studio-font-family">Jenis font</label><select id="studio-font-family" className={control} value={currentTextStyle.fontFamily || 'Default'} onChange={(e) => updateTextStyle({ fontFamily: e.target.value as VisualFont })}>{VISUAL_FONTS.map((font) => <option key={font}>{font}</option>)}</select></div>
        <div><label className={label} htmlFor="studio-font-size">Ukuran font (px)</label><input id="studio-font-size" type="number" min={10} max={112} className={control} value={currentTextStyle.fontSize ?? ''} placeholder="Ukuran bawaan" onChange={(e) => { const number = Number(e.target.value); if (Number.isInteger(number) && number >= 10 && number <= 112) updateTextStyle({ fontSize: number }); }}/></div>
        <button type="button" className={smallButton} onClick={() => { const next = { ...textStyles }; delete next[selectedText]; save({ ...visualDesign, textStyles: next }); }}>↺ Reset gaya tulisan</button>
      </> : <p className="rounded-xl bg-white/5 p-3 text-xs text-white/65">Klik nama, judul, deskripsi, atau teks kartu di kanvas untuk mengubah tampilannya.</p>}
    </div>}

    {tab === 'widgets' && <div className="space-y-4" role="tabpanel">
      <div className="grid grid-cols-2 gap-2"><button type="button" className={smallButton} onClick={() => addWidget('text')}>＋ Teks Baru</button><button type="button" className={smallButton} onClick={() => addWidget('icon')}>＋ Ikon Baru</button></div>
      {!widgets.some((widget) => widget.section === activeSection) && <p className="rounded-xl bg-white/5 p-3 text-xs text-white/60">Belum ada elemen tambahan di section ini.</p>}
      {widgets.filter((widget) => widget.section === activeSection).map((widget, index) => <div key={widget.id} className={`space-y-3 rounded-xl border p-3 ${selectedWidget === widget.id ? 'border-pink-400/70 bg-pink-500/10' : 'border-white/15 bg-white/5'}`}>
        <div className="flex items-center justify-between"><button className="text-xs font-bold" type="button" onClick={() => selectWidget(widget.id)}>{widget.type === 'text' ? 'Teks' : 'Ikon'} #{index + 1}</button><div className="flex items-center gap-1"><button type="button" aria-label="Naikkan elemen" className={smallButton} onClick={() => moveWidget(widget.id, -1)}>↑</button><button type="button" aria-label="Turunkan elemen" className={smallButton} onClick={() => moveWidget(widget.id, 1)}>↓</button><button type="button" aria-label="Hapus elemen" className={`${smallButton} text-red-300`} onClick={() => save({ ...visualDesign, widgets: widgets.filter((item) => item.id !== widget.id) })}>×</button></div></div>
        {widget.type === 'icon' && <div><label className={label} htmlFor={`widget-icon-${widget.id}`}>Pilih ikon</label><select id={`widget-icon-${widget.id}`} className={control} value={widget.icon || 'star'} onChange={(e) => updateWidget(widget.id, { icon: e.target.value as VisualWidget['icon'] })}>{VISUAL_ICONS.map((icon) => <option key={icon}>{icon}</option>)}</select></div>}
        <div><label className={label} htmlFor={`widget-text-${widget.id}`}>{widget.type === 'text' ? 'Isi teks' : 'Label ikon (opsional)'}</label><textarea id={`widget-text-${widget.id}`} rows={2} maxLength={1000} className={control} value={widget.text} onChange={(e) => updateWidget(widget.id, { text: e.target.value })}/></div>
        <div className="grid grid-cols-[44px_1fr] items-center gap-2"><input type="color" aria-label="Warna elemen" className={colorInput} value={widget.color || '#ffffff'} onChange={(e) => updateWidget(widget.id, { color: e.target.value })}/><input aria-label="Ukuran elemen dalam piksel" type="number" min={10} max={112} className={control} value={widget.fontSize || 20} onChange={(e) => { const value = Number(e.target.value); if (value >= 10 && value <= 112) updateWidget(widget.id, { fontSize: value }); }}/></div>
        <div><label className={label} htmlFor={`widget-font-${widget.id}`}>Font</label><select id={`widget-font-${widget.id}`} className={control} value={widget.fontFamily || 'Default'} onChange={(e) => updateWidget(widget.id, { fontFamily: e.target.value as VisualFont })}>{VISUAL_FONTS.map((font) => <option key={font}>{font}</option>)}</select></div>
        <div><label className={label} htmlFor={`widget-link-${widget.id}`}>Link (opsional)</label><input id={`widget-link-${widget.id}`} className={control} type="url" placeholder="https://..." value={widget.url || ''} onChange={(e) => updateWidget(widget.id, { url: e.target.value })}/></div>
      </div>)}
    </div>}
  </aside>;
}
